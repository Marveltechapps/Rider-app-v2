/**
 * Select Hub Screen Component
 * Hub selection screen with map view and use-my-location
 */

import * as Location from 'expo-location';
import { reverseGeocode, formatPlaceName } from '../utils/location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import CircleInfoIcon from '../components/icons/CircleInfoIcon';
import HubIcon from '../components/icons/HubIcon';
import MapViewIcon from '../components/icons/MapViewIcon';
import UseLocationIcon from '../components/icons/UseLocationIcon';
import Header from '../components/layout/Header';
import { useUser } from '../contexts';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import { getWarehouses, type Warehouse } from '../api/operations';
import { updateRiderPreferredLocation } from '../api/rider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_DELTA = { latitudeDelta: 0.04, longitudeDelta: 0.04 };
const DEFAULT_REGION = { latitude: 12.9716, longitude: 77.5946, ...MAP_DELTA }; // Bangalore

interface Hub {
  id: string;
  name: string;
  distance: string;
  address: string;
  hubId: string;
  dispatchBays: string;
}

function mapWarehouseToHub(w: Warehouse, index: number): Hub {
  return {
    id: w.code ?? String(index),
    name: (w.name as string) ?? w.code ?? 'Hub',
    distance: (w.distance as string) || '—',
    address: [w.address, w.city, w.state, w.pincode].filter(Boolean).join(', ') || '—',
    hubId: w.code ?? String(index),
    dispatchBays: (w.dispatchBays as string) || '—',
  };
}

export default function SelectHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userData } = useUser();
  const params = useLocalSearchParams<{ cityId?: string; cityName?: string; latitude?: string; longitude?: string }>();
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  const modalAnim = React.useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const [renderMapModal, setRenderMapModal] = useState(false);

  // Persist onboarding step when user visits Select Hub
  useEffect(() => {
    (async () => {
      const { setStoredOnboardingStep } = await import('@/api/storage');
      await setStoredOnboardingStep('/select-hub');
    })();
  }, []);

  useEffect(() => {
    if (mapModalVisible) {
      setRenderMapModal(true);
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setRenderMapModal(false));
    }
  }, [mapModalVisible, modalAnim]);

  const [locationLoading, setLocationLoading] = useState(false);
  const [userPlaceName, setUserPlaceName] = useState<string | null>(null);
  const [userRegion, setUserRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>(() => {
    const lat = params.latitude != null ? parseFloat(params.latitude) : NaN;
    const lng = params.longitude != null ? parseFloat(params.longitude) : NaN;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { latitude: lat, longitude: lng, ...MAP_DELTA };
    }
    return DEFAULT_REGION;
  });

  const loadHubs = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('[SelectHubScreen] Calling getWarehouses with:', {
      latitude: String(userRegion.latitude),
      longitude: String(userRegion.longitude),
    });
    try {
      const res = await getWarehouses({
        latitude: String(userRegion.latitude),
        longitude: String(userRegion.longitude),
      });
      console.log('[SelectHubScreen] API response:', JSON.stringify(res));
      setHubs((res.warehouses ?? []).map(mapWarehouseToHub));
    } catch (e) {
      console.error('[SelectHubScreen] Error loading hubs:', e);
      setError(e instanceof Error ? e.message : 'Failed to load hubs');
      setHubs([]);
    } finally {
      setLoading(false);
    }
  }, [userRegion.latitude, userRegion.longitude]);

  useEffect(() => {
    loadHubs();
  }, [loadHubs]);

  useEffect(() => {
    // If no coordinates are provided in params, detect current location
    const lat = params.latitude != null ? parseFloat(params.latitude) : NaN;
    const lng = params.longitude != null ? parseFloat(params.longitude) : NaN;
    if (isNaN(lat) || isNaN(lng)) {
      handleUseLocation();
    }
  }, []);

  useEffect(() => {
    const lat = params.latitude != null ? parseFloat(params.latitude) : NaN;
    const lng = params.longitude != null ? parseFloat(params.longitude) : NaN;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setUserRegion({ latitude: lat, longitude: lng, ...MAP_DELTA });
      reverseGeocode(lat, lng)
        .then(({ formattedAddress }) => {
          if (formattedAddress) setUserPlaceName(formattedAddress);
        })
        .catch(() => {});
    }
  }, [params.latitude, params.longitude]);

  const handleHubSelect = (hub: Hub) => {
    setSelectedHub(hub);
  };

  const handleUseLocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location', 'Location permission is required to show your position on the map.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;
      const region = { latitude, longitude, ...MAP_DELTA };
      setUserRegion(region);
      try {
        const { formattedAddress } = await reverseGeocode(latitude, longitude);
        setUserPlaceName(formattedAddress || 'Current location');
      } catch {
        setUserPlaceName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
      setMapModalVisible(true);
    } catch (e) {
      Alert.alert('Location error', e instanceof Error ? e.message : 'Could not get location');
    } finally {
      setLocationLoading(false);
    }
  }, [loadHubs]);

  const handleUseThisLocationInModal = useCallback(() => {
    setMapModalVisible(false);
  }, []);

  const openMapView = useCallback(() => {
    setMapModalVisible(true);
  }, []);

  const handleConfirmHub = async () => {
    if (!selectedHub) return;
    const riderId = userData.riderId;
    if (riderId) {
      try {
        await updateRiderPreferredLocation(riderId, {
          latitude: userRegion.latitude,
          longitude: userRegion.longitude,
          addressLabel: userPlaceName ?? undefined,
          cityId: params.cityId,
          cityName: params.cityName,
          hubId: selectedHub.id,
          hubName: selectedHub.name,
        });
      } catch (err) {
        console.error('[SelectHubScreen] Failed to save preferred location:', err);
        // Don't block navigation if save fails
      }
    }
    console.log('[SelectHubScreen] Navigating to vehicle-details');
    router.replace({
      pathname: '/vehicle-details',
      params: {
        hubId: selectedHub.id,
        hubName: selectedHub.name,
      },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/search-location');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <Header
          title="Select Hub"
          subtitle="Choose your primary pickup location"
          onBack={handleBack}
        />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Map View Section – real map, tap to open full screen */}
            <TouchableOpacity
              style={styles.mapViewContainer}
              onPress={openMapView}
              activeOpacity={0.9}
            >
              {Platform.OS !== 'web' ? (
                <MapView
                  style={styles.mapViewMap}
                  provider={PROVIDER_GOOGLE}
                  region={userRegion}
                  initialRegion={userRegion}
                  showsUserLocation
                  showsMyLocationButton
                >
                  <Marker
                    coordinate={{ latitude: userRegion.latitude, longitude: userRegion.longitude }}
                    title="Your location"
                    pinColor={Theme.colors.primaryMedium}
                  />
                </MapView>
              ) : (
                <View style={styles.mapViewPlaceholderInner} />
              )}
            </TouchableOpacity>

            {/* Nearby Hubs Section */}
            <View style={styles.nearbyHubsSection}>
              <View style={styles.nearbyHubsHeader}>
                <Text style={styles.nearbyHubsTitle}>Nearby Hubs</Text>
                <TouchableOpacity
                  style={[styles.useLocationButton, locationLoading && styles.useLocationButtonDisabled]}
                  onPress={handleUseLocation}
                  activeOpacity={0.7}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <ActivityIndicator size="small" color="#32C96A" />
                  ) : (
                    <UseLocationIcon size={scale(10.5)} color="#32C96A" />
                  )}
                  <Text style={styles.useLocationText}>
                    {locationLoading ? 'Getting location…' : 'Use my location'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Hub Cards */}
              {loading ? (
                <View style={{ padding: scale(24), alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={Theme.colors.primaryMedium} />
                  <Text variant="caption" color={Theme.colors.textGrey} style={{ marginTop: 8 }}>Loading hubs…</Text>
                </View>
              ) : error ? (
                <View style={{ padding: scale(24) }}>
                  <Text variant="bodySm" color={Theme.colors.textGrey}>{error}</Text>
                </View>
              ) : (
              <View style={styles.hubsList}>
                {(hubs.length ? hubs : [{ id: 'fallback', name: 'No hubs loaded', distance: '', address: '', hubId: 'f', dispatchBays: '' }]).map((hub) => {
                  const isSelected = selectedHub?.id === hub.id;
                  return (
                    <TouchableOpacity
                      key={hub.id}
                      style={[
                        styles.hubCard,
                        isSelected && styles.hubCardSelected,
                      ]}
                      onPress={() => handleHubSelect(hub)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.hubCardContent}>
                        <View style={styles.hubIconContainer}>
                          <HubIcon size={scale(42)} color="#6A7282" />
                        </View>
                        <View style={styles.hubInfo}>
                          <View style={styles.hubHeader}>
                            <Text style={styles.hubName}>{hub.name}</Text>
                            <View style={styles.distanceBadge}>
                              <Text style={styles.distanceText}>{hub.distance}</Text>
                            </View>
                          </View>
                          <Text style={styles.hubAddress}>{hub.address}</Text>
                          <View style={styles.hubBadges}>
                            <View style={styles.hubBadge}>
                              <Text style={styles.hubBadgeText}>ID: {hub.hubId}</Text>
                            </View>
                            <View style={styles.hubBadge}>
                              <Text style={styles.hubBadgeText}>{hub.dispatchBays}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              )}
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <CircleInfoIcon size={scale(17.5)} color="#155DFC" />
              <Text style={styles.infoText}>
                This will be your primary reporting location. You can change this later from settings.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedHub && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirmHub}
            disabled={!selectedHub}
            activeOpacity={0.7}
          >
            <Text
              variant="loginButton"
              color={!selectedHub ? '#6B7280' : Theme.colors.white}
              style={styles.confirmButtonText}
            >
              Confirm Hub
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Full-screen map modal – opens from Map View tap or Use my location */}
      {renderMapModal && (
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: modalAnim }], zIndex: 1000 }]}>
          <SafeAreaView style={styles.mapModalContainer} edges={['top', 'bottom']}>
            <View style={styles.mapModalHeader}>
              <View style={styles.mapModalHeaderText}>
                <Text variant="h3" color={Theme.colors.textDark} style={styles.mapModalTitle}>
                  Your location
                </Text>
                {userPlaceName ? (
                  <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.mapModalSubtitle}>
                    {userPlaceName}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.mapModalClose}
                onPress={() => setMapModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text variant="body" color={Theme.colors.primaryMedium}>Close</Text>
              </TouchableOpacity>
            </View>
            {Platform.OS !== 'web' ? (
              <MapView
                style={styles.mapModalMap}
                provider={PROVIDER_GOOGLE}
                region={userRegion}
                initialRegion={userRegion}
                showsUserLocation
                showsMyLocationButton
                onRegionChangeComplete={(r) => setUserRegion(r)}
              >
                <Marker
                  coordinate={{ latitude: userRegion.latitude, longitude: userRegion.longitude }}
                  title={userPlaceName ?? 'You are here'}
                />
              </MapView>
            ) : (
              <View style={styles.mapModalWebFallback}>
                <Text variant="body" color={Theme.colors.textGrey}>
                  Map view is available in the app (iOS/Android). Your location: {userPlaceName ?? `${userRegion.latitude.toFixed(4)}, ${userRegion.longitude.toFixed(4)}`}
                </Text>
              </View>
            )}
            <View style={styles.mapModalFooter}>
              <TouchableOpacity
                style={styles.useThisLocationButton}
                onPress={handleUseThisLocationInModal}
                activeOpacity={0.7}
              >
                <Text variant="loginButton" color={Theme.colors.white} style={styles.useThisLocationButtonText}>
                  Use this location
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Exact Figma background
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(21),
    paddingBottom: verticalScale(21),
  },
  content: {
    width: '100%',
    maxWidth: scale(360),
    alignSelf: 'center',
    gap: verticalScale(21),
  },
  mapViewContainer: {
    width: '100%',
    height: scale(168),
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DC',
    borderRadius: scale(14),
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapViewMap: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: scale(14),
  },
  mapViewPlaceholderInner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E7EB',
  },
  mapViewButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    top: scale(57.75),
    alignSelf: 'center',
    width: scale(120),
  },
  mapViewText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    color: '#6A7282',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: scale(7),
  },
  useLocationButtonDisabled: {
    opacity: 0.7,
  },
  nearbyHubsSection: {
    width: '100%',
    gap: verticalScale(8),
  },
  nearbyHubsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  nearbyHubsTitle: {
    fontSize: scale(15.75),
    lineHeight: scale(23.63),
    color: '#101828',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '700',
  },
  useLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(3.5),
    height: scale(17.5),
  },
  useLocationText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    color: '#32C96A',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
  },
  hubsList: {
    width: '100%',
    gap: verticalScale(12 ),
  },
  hubCard: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    minHeight: scale(120),
  },
  hubCardSelected: {
    borderColor: Theme.colors.primaryMedium,
    borderWidth: 2,
    paddingHorizontal: scale(15), // Adjust for 2px border (16 - 1 = 15)
    paddingVertical: scale(15),
  },
  hubCardContent: {
    flexDirection: 'row',
    gap: scale(12),
    width: '100%',
  },
  hubIconContainer: {
    width: scale(42),
    height: scale(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubInfo: {
    flex: 1,
    gap: scale(4),
  },
  hubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  hubName: {
    fontSize: scale(14),
    lineHeight: scale(21),
    color: '#101828',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '700',
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: scale(8.75),
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: scale(12),
    lineHeight: scale(14),
    color: '#4A5565',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
  },
  hubAddress: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    color: '#6A7282',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
  },
  hubBadges: {
    flexDirection: 'row',
    gap: scale(12),
    width: '100%',
  },
  hubBadge: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: scale(0.75),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubBadgeText: {
    fontSize: scale(10),
    lineHeight: scale(15),
    color: '#6B7280',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
  },
  infoBox: {
    flexDirection: 'row',
    gap: scale(8),
    backgroundColor: '#EFF6FF',
    borderRadius: scale(8),
    padding: scale(14),
    paddingTop: scale(8),
    paddingBottom: scale(8),
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: scale(10),
    lineHeight: scale(14),
    color: '#1447E6',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
  },
  bottomSection: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(22),
    paddingBottom: verticalScale(21),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButton: {
    height: scale(42),
    backgroundColor: '#32C96A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.buttonPrimary,
  },
  confirmButtonDisabled: {
    backgroundColor: '#E5E7EB',
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
    textAlign: 'center',
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  mapModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: Theme.colors.white,
    minHeight: verticalScale(64),
  },
  mapModalHeaderText: {
    flex: 1,
  },
  mapModalTitle: {
    marginBottom: verticalScale(2),
  },
  mapModalSubtitle: {
    marginBottom: 0,
  },
  mapModalClose: {
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
  },
  mapModalMap: {
    flex: 1,
    minHeight: 300,
  },
  mapModalWebFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(24),
    backgroundColor: '#F3F4F6',
  },
  mapModalFooter: {
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: Theme.colors.white,
  },
  useThisLocationButton: {
    height: scale(42),
    backgroundColor: '#32C96A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  useThisLocationButtonText: {
    fontSize: scale(15.75),
    fontWeight: '700',
    color: Theme.colors.white,
  },
});

