import React, { useEffect, useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Text from '../common/Text';
import HubStoreIcon from '../icons/HubStoreIcon';
import CustomerAvatarIcon from '../icons/CustomerAvatarIcon';
import { Theme } from '../../constants/Theme';
import { scale } from '../../utils/responsive';
import type { LatLng } from '../../utils/fleetMapCoords';

const MAP_DELTA = { latitudeDelta: 0.03, longitudeDelta: 0.03 };
const NAV_FOLLOW_DELTA = { latitudeDelta: 0.012, longitudeDelta: 0.012 };

export interface OrderLiveMapViewProps {
  riderLocation: LatLng | null;
  pickupCoords: LatLng | null;
  dropCoords: LatLng | null;
  routeCoords: LatLng[];
  fitCoordinates: LatLng[];
  pickupLabel?: string;
  deliveryAddress?: string;
  showPickup?: boolean;
  showDrop?: boolean;
  showRider?: boolean;
  /** Increment to animate map to `recenterCoordinate` (typically rider GPS). */
  recenterTick?: number;
  recenterCoordinate?: LatLng | null;
  /** Live navigation: follow rider GPS, native blue dot, route overview once. */
  navigationMode?: boolean;
  /** Extra bottom padding so route/markers are not hidden under the footer. */
  mapPaddingBottom?: number;
}

export default function OrderLiveMapView({
  riderLocation,
  pickupCoords,
  dropCoords,
  routeCoords,
  fitCoordinates,
  pickupLabel,
  deliveryAddress,
  showPickup = true,
  showDrop = true,
  showRider = true,
  recenterTick = 0,
  recenterCoordinate = null,
  navigationMode = false,
  mapPaddingBottom = 260,
}: OrderLiveMapViewProps) {
  const mapRef = useRef<MapView>(null);
  const didOverviewFit = useRef(false);

  const initialRegion = riderLocation
    ? { ...riderLocation, ...MAP_DELTA }
    : pickupCoords
      ? { ...pickupCoords, ...MAP_DELTA }
      : dropCoords
        ? { ...dropCoords, ...MAP_DELTA }
        : null;

  const fitKey = fitCoordinates
    .map((c) => `${c.latitude.toFixed(5)},${c.longitude.toFixed(5)}`)
    .join('|');

  useEffect(() => {
    if (!mapRef.current || fitCoordinates.length === 0) return;
    if (navigationMode) {
      if (didOverviewFit.current) return;
      if (fitCoordinates.length < 2) return;
      didOverviewFit.current = true;
    }
    if (fitCoordinates.length === 1) {
      mapRef.current.animateToRegion({ ...fitCoordinates[0], ...MAP_DELTA }, 400);
      return;
    }
    mapRef.current.fitToCoordinates(fitCoordinates, {
      edgePadding: { top: 100, right: 60, bottom: mapPaddingBottom, left: 60 },
      animated: true,
    });
  }, [fitKey, navigationMode, mapPaddingBottom]);

  useEffect(() => {
    if (!navigationMode || !mapRef.current || !riderLocation) return;
    mapRef.current.animateToRegion({ ...riderLocation, ...NAV_FOLLOW_DELTA }, 280);
  }, [
    navigationMode,
    riderLocation?.latitude,
    riderLocation?.longitude,
    recenterTick,
  ]);

  useEffect(() => {
    if (!mapRef.current || !recenterTick) return;
    const target = recenterCoordinate ?? riderLocation;
    if (!target) return;
    const delta = navigationMode ? NAV_FOLLOW_DELTA : MAP_DELTA;
    mapRef.current.animateToRegion({ ...target, ...delta }, 350);
  }, [recenterTick, recenterCoordinate, riderLocation, navigationMode]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <Text variant="body" color={Theme.colors.textGrey}>
          Map available in app (iOS/Android)
        </Text>
      </View>
    );
  }

  if (!initialRegion) {
    return (
      <View style={styles.webFallback}>
        <Text variant="body" color={Theme.colors.textGrey}>
          Waiting for location data…
        </Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      showsUserLocation={navigationMode}
      showsMyLocationButton={false}
      followsUserLocation={false}
      mapType="standard"
      loadingEnabled
      loadingIndicatorColor={Theme.colors.primaryMedium}
    >
      {showPickup && pickupCoords && (
        <Marker coordinate={pickupCoords} title="Pickup" description={pickupLabel} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.markerWrap}>
            <HubStoreIcon size={scale(22)} color={Theme.colors.primaryMedium} />
          </View>
        </Marker>
      )}
      {showDrop && dropCoords && (
        <Marker coordinate={dropCoords} title="Drop" description={deliveryAddress} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.markerWrap}>
            <CustomerAvatarIcon size={scale(22)} color={Theme.colors.primaryMedium} />
          </View>
        </Marker>
      )}
      {showRider && !navigationMode && riderLocation && (
        <Marker coordinate={riderLocation} title="You" anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.riderDot} />
        </Marker>
      )}
      {routeCoords.length > 0 && (
        <Polyline
          coordinates={routeCoords}
          strokeColor="#2196F3"
          strokeWidth={scale(5)}
          lineCap="round"
          lineJoin="round"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  webFallback: {
    flex: 1,
    backgroundColor: Theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerWrap: {
    backgroundColor: Theme.colors.white,
    borderRadius: scale(20),
    padding: scale(6),
    borderWidth: 2,
    borderColor: Theme.colors.primaryMedium,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
  },
  riderDot: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    backgroundColor: '#2196F3',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Theme.shadows.small,
  },
});
