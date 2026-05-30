/**
 * Search Location Screen Component
 * City selection screen with real-time map and location detection
 * 
 * @component
 * @example
 * <SearchLocationScreen />
 */

import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ConfirmDialog from '../components/ConfirmDialog';
import Text from '../components/common/Text';
import LocationIcon from '../components/icons/LocationIcon';
import SearchIcon from '../components/icons/SearchIcon';
import Header from '../components/layout/Header';
import { useUser } from '../contexts';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import { updateRiderPreferredLocation } from '../api/rider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_DELTA = { latitudeDelta: 0.04, longitudeDelta: 0.04 };

import { fetchCities, City as CityFromApi } from '../api/masterData';
import { reverseGeocode, searchPlaces, formatPlaceName } from '../utils/location';

type City = CityFromApi;
 
export default function SearchLocationScreen() {
  const router = useRouter();
  const { userData, updateUserData, logout } = useUser();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [logoutBackDialogVisible, setLogoutBackDialogVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [detectedCity, setDetectedCity] = useState<City | null>(null);
  const [displayPlaceName, setDisplayPlaceName] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Array<{ label: string; latitude: number; longitude: number }>>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const modalAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [renderMap, setRenderMap] = useState(false);
  const citySearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // No fallback cities; only show server data
  useEffect(() => {
    // Debounce server-side city search
    if (citySearchTimeoutRef.current) clearTimeout(citySearchTimeoutRef.current);
    citySearchTimeoutRef.current = setTimeout(async () => {
      setCitiesLoading(true);
      setCitiesError(null);
      try {
        const q = searchQuery.trim();
        const res = await fetchCities({ search: q || undefined, isActive: true, limit: 200 });
        setCities(res.data);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
        setCitiesError('Failed to load cities from server');
        setCities([]);
      } finally {
        setCitiesLoading(false);
      }
    }, 300);
    return () => {
      if (citySearchTimeoutRef.current) clearTimeout(citySearchTimeoutRef.current);
    };
  }, [searchQuery]);

  // Pre-select city from user profile on load
  useEffect(() => {
    if (cities.length > 0 && userData.preferredLocation?.cityId && !selectedCity) {
      const cityId = userData.preferredLocation.cityId;
      const matched = cities.find(c => c.id === cityId);
      if (matched) {
        setSelectedCity(matched);
        // If there are coordinates, set region so map modal works immediately
        if (userData.preferredLocation.latitude && userData.preferredLocation.longitude) {
          setRegion({
            latitude: userData.preferredLocation.latitude,
            longitude: userData.preferredLocation.longitude,
            ...MAP_DELTA,
          });
          if (userData.preferredLocation.addressLabel) {
            setDisplayPlaceName(userData.preferredLocation.addressLabel);
          }
        }
      }
    }
  }, [cities, userData.preferredLocation]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2 || Platform.OS === 'web') {
      setSearchResults([]);
      return;
    }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      searchTimeoutRef.current = null;
      setSearchLoading(true);
      setSearchResults([]);
      try {
        const results = await searchPlaces(q);
        setSearchResults(results);
      } catch (e) {
        console.error('Search failed:', e);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleSearchResultSelect = useCallback((item: { label: string; latitude: number; longitude: number }) => {
    const city: City = {
      id: item.label.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '') || 'place',
      name: item.label,
      state: '',
    };
    setSelectedCity(city);
    setRegion({ latitude: item.latitude, longitude: item.longitude, ...MAP_DELTA });
    setDisplayPlaceName(item.label);
    setSearchResults([]);
    setSearchQuery(item.label);
    setMapVisible(true);
  }, []);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return cities;
    }
    const query = searchQuery.toLowerCase();
    return cities.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        (city.state ?? '').toLowerCase().includes(query)
    );
  }, [searchQuery, cities]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  const [saving, setSaving] = useState(false);
  const handleContinue = async () => {
    if (!selectedCity) return;
    setSaving(true);
    try {
      const riderId = userData.riderId;
      if (riderId) {
        // preferred-location endpoint expects lat/lng; send 0,0 when unknown
        const lat = region?.latitude ?? 0;
        const lng = region?.longitude ?? 0;
        const res = await updateRiderPreferredLocation(riderId, {
          latitude: lat,
          longitude: lng,
          cityId: selectedCity.id,
          cityName: selectedCity.name,
        });
        if (res?.rider?.preferredLocation) {
          updateUserData({ preferredLocation: res.rider.preferredLocation });
        }
      }
      const params: Record<string, string> = {
        cityId: selectedCity.id,
        cityName: selectedCity.name,
      };
      if (region != null) {
        params.latitude = String(region.latitude);
        params.longitude = String(region.longitude);
      }
      router.replace({ pathname: '/select-hub', params });
    } catch {
      // ignore — still navigate so onboarding flow proceeds; consider showing toast later
      const params: Record<string, string> = {
        cityId: selectedCity.id,
        cityName: selectedCity.name,
      };
      if (region != null) {
        params.latitude = String(region.latitude);
        params.longitude = String(region.longitude);
      }
      router.replace({ pathname: '/select-hub', params });
    } finally {
      setSaving(false);
    }
  };

  const renderCityItem = ({ item, index }: { item: City; index: number }) => {
    const isSelected = selectedCity?.id === item.id;
    const isLastItem = index === filteredCities.length - 1;
    return (
      <TouchableOpacity
        style={[
          styles.cityItem,
          isLastItem && styles.cityItemLast,
        ]}
        onPress={() => handleCitySelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cityItemContent}>
          <View style={styles.cityIconContainer}>
            <View style={[styles.cityIcon, isSelected && styles.cityIconSelected]}>
              <LocationIcon size={scale(14)} color="#6B7280" />
            </View>
          </View>
          <View style={styles.cityInfo}>
            <Text style={styles.cityName}>
              {item.name}
            </Text>
            <Text style={styles.cityState}>
              {item.state}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (mapVisible) {
      setRenderMap(true);
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setRenderMap(false));
    }
  }, [mapVisible, modalAnim]);

  const handleDetectLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setRegion({ latitude, longitude, ...MAP_DELTA });
      const address = await reverseGeocode(latitude, longitude);
      if (address) {
        setDisplayPlaceName(address.formattedAddress);
      }
      setMapVisible(true);
    } catch (err) {
      console.error('Location detection failed:', err);
      setLocationError('Failed to detect your location');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleUseDetectedLocation = () => {
    if (region) {
      const query = displayPlaceName?.toLowerCase() || '';
      const matched = cities.find(c => query.includes(c.name.toLowerCase()));
      if (matched) {
        setSelectedCity(matched);
      } else {
        setSelectedCity({
          id: 'detected-' + Date.now(),
          name: displayPlaceName?.split(',')[0] || 'Detected Location',
          state: displayPlaceName?.split(',')[1]?.trim() || ''
        });
      }
    }
    setMapVisible(false);
  };

  const confirmLogoutFromCitySelect = useCallback(async () => {
    await logout();
    setLogoutBackDialogVisible(false);
    router.replace('/login');
  }, [logout, router]);

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <Header
          title="Select City"
          subtitle="Choose the city where you want to deliver"
          onBack={() => setLogoutBackDialogVisible(true)}
        />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Search and Location Section */}
            <View style={styles.searchSection}>
              {/* Search Input Container */}
              <View style={styles.searchInputWrapper}>
                <View style={styles.searchInputContainer}>
                  <SearchIcon size={scale(17.5)} color="#6B7280" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search city"
                    placeholderTextColor="#717182"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>

              {/* Search results dropdown (like Google Maps) – when user types a place name */}
              {searchQuery.trim().length >= 2 && (
                <View style={styles.searchResultsContainer}>
                  {searchLoading ? (
                    <View style={styles.searchResultItem}>
                      <ActivityIndicator size="small" color="#6B7280" />
                      <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.searchResultLabel}>
                        Searching…
                      </Text>
                    </View>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((item, idx) => (
                      <TouchableOpacity
                        key={`${item.latitude}-${item.longitude}-${idx}`}
                        style={[styles.searchResultItem, idx === searchResults.length - 1 && styles.searchResultItemLast]}
                        onPress={() => handleSearchResultSelect(item)}
                        activeOpacity={0.7}
                      >
                        <LocationIcon size={scale(16)} color="#6B7280" />
                        <Text variant="bodySm" color={Theme.colors.textDark} style={styles.searchResultLabel} numberOfLines={1}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.searchResultItem}>
                      <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.searchResultLabel}>
                        No places found. Try a different name or use Detect my location.
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Detect Location Button – real-time map + GPS */}
              <TouchableOpacity
                style={[styles.detectLocationButton, locationLoading && styles.detectLocationButtonDisabled]}
                onPress={handleDetectLocation}
                activeOpacity={0.7}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator size="small" color="#32C96A" />
                ) : (
                  <LocationIcon size={scale(18)} color="#32C96A" />
                )}
                <Text style={styles.detectLocationText}>
                  {locationLoading ? 'Detecting…' : 'Use my location'}
                </Text>
              </TouchableOpacity>
              {locationError ? (
                <Text variant="caption" style={styles.locationErrorText}>
                  {locationError}
                </Text>
              ) : null}
            </View>

            {/* All Cities Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>
                  ALL CITIES
                </Text>
              </View>
              <View style={styles.allCitiesContainer}>
                {citiesLoading && cities.length === 0 ? (
                  <View style={{ height: scale(100), justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={Theme.colors.primaryMedium} />
                    <Text variant="bodySm" color={Theme.colors.textGrey} style={{ marginTop: scale(8) }}>
                      Loading cities…
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={filteredCities}
                    renderItem={({ item, index }) =>
                      // Ensure each row is exactly 64px high per Figma
                      <View style={{ height: scale(68), justifyContent: 'center' }}>
                        {renderCityItem({ item, index })}
                      </View>
                    }
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    getItemLayout={(_, index) => ({
                      length: scale(68),
                      offset: scale(68) * index,
                      index,
                    })}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedCity && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedCity}
            activeOpacity={0.7}
          >
            <Text
              variant="loginButton"
              color={!selectedCity ? '#6B7280' : Theme.colors.white}
              style={styles.continueButtonText}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
    {renderMap && (
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: modalAnim }], zIndex: 1000 }]}>
        <SafeAreaView style={styles.mapModalContainer} edges={['top', 'bottom']}>
          <View style={styles.mapModalHeader}>
            <View style={styles.mapModalHeaderContent}>
              <Text variant="h3" color={Theme.colors.textDark} style={styles.mapModalTitle}>
                Your location
              </Text>
              <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.mapModalSubtitle}>
                {displayPlaceName ?? (detectedCity ? `${detectedCity.name}${detectedCity.state ? `, ${detectedCity.state}` : ''}` : '—')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.mapModalClose}
              onPress={() => setMapVisible(false)}
              activeOpacity={0.7}
            >
              <Text variant="body" color={Theme.colors.primaryMedium}>Close</Text>
            </TouchableOpacity>
          </View>
          {region && (
            <View style={styles.mapWrapper}>
              {Platform.OS !== 'web' ? (
                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  region={region}
                  initialRegion={region}
                  showsUserLocation
                  showsMyLocationButton
                  onRegionChangeComplete={setRegion}
                  mapType="standard"
                >
                  <Marker
                    coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                    title="You are here"
                  />
                </MapView>
              ) : (
                <View style={styles.mapWebFallback}>
                  <LocationIcon size={scale(48)} color="#32C96A" />
                  <Text variant="body" color={Theme.colors.textGrey} style={styles.mapWebText}>
                    Map view is available in the app (iOS/Android). Your detected city: {detectedCity?.name ?? '—'}
                  </Text>
                </View>
              )}
            </View>
          )}
          <View style={styles.mapModalFooter}>
            <TouchableOpacity
              style={styles.useLocationButton}
              onPress={handleUseDetectedLocation}
              activeOpacity={0.7}
            >
              <Text variant="loginButton" color={Theme.colors.white} style={styles.useLocationButtonText}>
                Use this location
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    )}
      <ConfirmDialog
        visible={logoutBackDialogVisible}
        title="Log out?"
        message="Do you want to go back to the login screen? This will sign you out."
        confirmLabel="Log out"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        onCancel={() => setLogoutBackDialogVisible(false)}
        onConfirm={confirmLogoutFromCitySelect}
      />
  </>
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
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(21),
  },
  content: {
    width: '100%',
    maxWidth: scale(360),
    alignSelf: 'center',
    gap: verticalScale(20),
  },
  searchSection: {
    flexDirection: 'column',
    gap: verticalScale(0), // Exact Figma gap between search and detect button
    width: '100%',
  },
  searchInputWrapper: {
    width: '100%',
    paddingVertical: verticalScale(12), // Exact Figma padding
    alignItems: 'center',
  },
  searchInputContainer: {
    width: '100%',
    maxWidth: scale(360),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(8),
    paddingHorizontal: scale(10.5),
    height: scale(56),
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: Theme.typography.loginInput.fontFamily,
    color: Theme.colors.textDark,
    paddingVertical: 0,
    textAlignVertical: 'center',
    alignSelf: 'stretch',
  },
  searchResultsContainer: {
    width: '100%',
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(8),
    marginTop: verticalScale(4),
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultItemLast: {
    borderBottomWidth: 0,
  },
  searchResultLabel: {
    flex: 1,
  },
  detectLocationButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(8),
    paddingLeft: scale(12),
    paddingRight: scale(12),
    height: scale(42),
    alignSelf: 'stretch',
  },
  detectLocationText: {
    color: '#32C96A', // Exact Figma green
    fontSize: scale(14),
    lineHeight: scale(21), // 14 * 1.5
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
    textAlign: 'center',
  },
  detectLocationButtonDisabled: {
    opacity: 0.7,
  },
  locationErrorText: {
    color: '#C53030',
    marginTop: verticalScale(4),
    paddingHorizontal: scale(12),
  },
  section: {
    gap: verticalScale(8), // Exact Figma gap for All Cities section
    width: '100%',
  },
  sectionTitleContainer: {
    height: scale(17.5), // Exact Figma height for section title
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  sectionTitle: {
    letterSpacing: scale(0.625), // 5% of 12.25
    textTransform: 'uppercase',
    fontSize: scale(12.25), // Exact Figma fontSize
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    color: '#6A7282', // Exact Figma color
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
  },
  popularCitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8), // UI standard spacing
    width: '100%',
  },
  popularCityChip: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(12.75),
    paddingVertical: scale(8), // UI standard padding
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: scale(44),
  },
  popularCityText: {
    color: '#4A5565', // Exact Figma color
    fontSize: scale(14),
    lineHeight: scale(21), // 14 * 1.5
    textAlign: 'center',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
  },
  allCitiesContainer: {
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(14),
    paddingHorizontal: 0,
  },
  cityItem: {
    paddingHorizontal: scale(14), // Exact Figma padding
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', // Exact Figma separator color
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityItemLast: {
    borderBottomWidth: 0, // Remove border from last item
  },
  cityItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8), // Exact Figma gap between icon and text
    width: '100%',
  },
  cityIconContainer: {
    width: scale(28),
    height: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityIcon: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#F3F4F6', // Exact Figma icon background
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityIconSelected: {
    backgroundColor: Theme.colors.primaryLight,
    borderWidth: 2,
    borderColor: Theme.colors.primaryMedium,
  },
  cityInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cityName: {
    fontSize: scale(14),
    lineHeight: scale(21), // 14 * 1.5
    color: '#101828', // Exact Figma color
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
    marginTop: scale(0), // Adjust for exact Figma positioning
  },
  cityState: {
    fontSize: scale(12),
    lineHeight: scale(14), // 10.5 * 1.3333333333333333
    color: '#6B7280', // WCAG AA compliant
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
  },
  bottomSection: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6', // Exact Figma border
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(22),
    paddingBottom: verticalScale(21),
    // Shadow: 0px -4px 20px 0px rgba(0, 0, 0, 0.05)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  continueButton: {
    height: scale(42),
    backgroundColor: '#32C96A', // Exact Figma green when enabled
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.buttonPrimary,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB', // Exact Figma disabled color
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5), // 15.75 * 1.5555555555555556
    fontWeight: '700',
    textAlign: 'center',
  },
  // Real-time map modal
  mapModalContainer: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  mapModalHeader: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.white,
    minHeight: verticalScale(64),
  },
  mapModalHeaderContent: {
    flex: 1,
    marginRight: scale(16),
  },
  mapModalTitle: {
    marginBottom: verticalScale(2),
  },
  mapModalSubtitle: {
  },
  mapModalClose: {
    paddingVertical: verticalScale(4),
  },
  mapWrapper: {
    flex: 1,
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
    minHeight: 300,
  },
  mapWebFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: scale(24),
  },
  mapWebText: {
    textAlign: 'center',
    marginTop: verticalScale(16),
  },
  mapModalFooter: {
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  useLocationButton: {
    height: scale(42),
    backgroundColor: '#32C96A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  useLocationButtonText: {
    fontSize: scale(15.75),
    fontWeight: '700',
    color: Theme.colors.white,
  },
});

