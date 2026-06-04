/**
 * Shared live map state for order workflow screens.
 */

import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { BackendOrder } from '../api/orders';
import { fetchDirections } from '../utils/directions';
import {
  formatDeliveryAddress,
  getDropCoordinates,
  getOrderEtaMinutes,
  getPickupCoordinates,
  distanceMeters,
  getDropGeocodeQuery,
  getPickupGeocodeQuery,
  getPickupLabel,
  toLatLng,
  type LatLng,
} from '../utils/fleetMapCoords';
import { geocodeAddress } from '../utils/location';
import { isDarkstoreAtCurrentLocationEnabled } from '../utils/mapDevConfig';

type MapMode = 'to_hub' | 'hub_to_drop' | 'to_drop';

export function useOrderMapData(
  order: BackendOrder | undefined,
  mode: MapMode = 'to_hub'
) {
  const [riderLocation, setRiderLocation] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [routeEtaMinutes, setRouteEtaMinutes] = useState<number | null>(null);
  const [routeDistanceMeters, setRouteDistanceMeters] = useState<number | null>(null);
  const [geocodedPickup, setGeocodedPickup] = useState<LatLng | null>(null);
  const [geocodedDrop, setGeocodedDrop] = useState<LatLng | null>(null);
  const [locationReady, setLocationReady] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const lastRouteOriginRef = useRef<LatLng | null>(null);
  const lastDestinationKeyRef = useRef('');
  const [darkstorePinnedAtRider, setDarkstorePinnedAtRider] = useState<LatLng | null>(null);
  const useCurrentLocationAsDarkstore = isDarkstoreAtCurrentLocationEnabled();

  const pickupCoordsFromOrder = useMemo(() => {
    if (!order) return null;
    const c = getPickupCoordinates(order);
    return c ? toLatLng(c) : null;
  }, [order?._id, order?.metadata, order?.darkstoreCode, order?.warehouseCode]);

  const backendPickupCoords = pickupCoordsFromOrder ?? geocodedPickup;

  useEffect(() => {
    setDarkstorePinnedAtRider(null);
  }, [order?._id, useCurrentLocationAsDarkstore]);

  useEffect(() => {
    if (!useCurrentLocationAsDarkstore || mode !== 'to_hub' || !riderLocation) return;
    setDarkstorePinnedAtRider((prev) => prev ?? { ...riderLocation });
  }, [useCurrentLocationAsDarkstore, mode, riderLocation?.latitude, riderLocation?.longitude]);

  const pickupCoords = useMemo(() => {
    if (useCurrentLocationAsDarkstore && mode === 'to_hub') {
      return darkstorePinnedAtRider ?? riderLocation ?? backendPickupCoords;
    }
    return backendPickupCoords;
  }, [
    useCurrentLocationAsDarkstore,
    mode,
    darkstorePinnedAtRider,
    riderLocation,
    backendPickupCoords,
  ]);

  const dropCoordsFromOrder = useMemo(() => {
    if (!order) return null;
    const c = getDropCoordinates(order);
    return c ? toLatLng(c) : null;
  }, [order?._id, order?.delivery?.address?.coordinates, order?.metadata]);

  const dropCoords = dropCoordsFromOrder ?? geocodedDrop;

  useEffect(() => {
    lastRouteOriginRef.current = null;
    lastDestinationKeyRef.current = '';
    setRouteCoords([]);
    setRouteEtaMinutes(null);
    setRouteDistanceMeters(null);
  }, [
    order?._id,
    mode,
    pickupCoords?.latitude,
    pickupCoords?.longitude,
    dropCoords?.latitude,
    dropCoords?.longitude,
  ]);

  useEffect(() => {
    setGeocodedPickup(null);
    if (!order || pickupCoordsFromOrder) return;

    const query = getPickupGeocodeQuery(order);
    if (!query) return;

    let cancelled = false;
    geocodeAddress(query).then((result) => {
      if (cancelled || !result) return;
      setGeocodedPickup({ latitude: result.latitude, longitude: result.longitude });
    });

    return () => {
      cancelled = true;
    };
  }, [order?._id, order?.darkstoreCode, order?.warehouseCode, pickupCoordsFromOrder]);

  useEffect(() => {
    setGeocodedDrop(null);
    if (!order || dropCoordsFromOrder) return;
    if (mode === 'to_hub') return;

    const query = getDropGeocodeQuery(order);
    if (!query) return;

    let cancelled = false;
    geocodeAddress(query).then((result) => {
      if (cancelled || !result) return;
      setGeocodedDrop({ latitude: result.latitude, longitude: result.longitude });
    });

    return () => {
      cancelled = true;
    };
  }, [order?._id, order?.delivery?.address, dropCoordsFromOrder, mode]);

  const deliveryAddress = useMemo(() => formatDeliveryAddress(order), [order]);
  const pickupLabel = useMemo(() => getPickupLabel(order), [order]);

  useEffect(() => {
    let watchId: Location.LocationSubscription | null = null;
    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) return;

        const liveNav = mode === 'to_hub' || mode === 'to_drop';
        const accuracy = liveNav ? Location.Accuracy.High : Location.Accuracy.Balanced;
        const loc = await Location.getCurrentPositionAsync({ accuracy });
        if (!cancelled) {
          setRiderLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
          setLocationReady(true);
        }

        watchId = await Location.watchPositionAsync(
          {
            accuracy,
            timeInterval: liveNav ? 1500 : 2000,
            distanceInterval: liveNav ? 3 : 5,
          },
          (newLoc) => {
            if (!cancelled) {
              setRiderLocation({
                latitude: newLoc.coords.latitude,
                longitude: newLoc.coords.longitude,
              });
            }
          }
        );
      } catch (e) {
        console.warn('[useOrderMapData] location error:', e);
      }
    })();

    return () => {
      cancelled = true;
      watchId?.remove();
    };
  }, [mode]);

  useEffect(() => {
    let cancelled = false;

    const origin =
      mode === 'hub_to_drop'
        ? pickupCoords
        : riderLocation;
    const destination =
      mode === 'to_hub'
        ? pickupCoords
        : dropCoords;

    if (!origin || !destination) {
      setIsRouting(false);
      return;
    }

    const destKey = `${destination.latitude.toFixed(5)},${destination.longitude.toFixed(5)}`;
    const destChanged = destKey !== lastDestinationKeyRef.current;
    if (destChanged) lastDestinationKeyRef.current = destKey;

    const shouldRefetch =
      destChanged ||
      !lastRouteOriginRef.current ||
      distanceMeters(lastRouteOriginRef.current, origin) > 75;

    if (!shouldRefetch) return;

    setIsRouting(true);
    lastRouteOriginRef.current = origin;

    fetchDirections(origin, destination).then((result) => {
      if (cancelled || !result) {
        if (!cancelled) setIsRouting(false);
        return;
      }
      setRouteCoords(result.coordinates);
      setRouteEtaMinutes(result.durationMinutes);
      setRouteDistanceMeters(result.distanceMeters);
      setIsRouting(false);
    });

    return () => {
      cancelled = true;
    };
  }, [
    mode,
    riderLocation?.latitude,
    riderLocation?.longitude,
    pickupCoords?.latitude,
    pickupCoords?.longitude,
    dropCoords?.latitude,
    dropCoords?.longitude,
  ]);

  const etaMinutes = getOrderEtaMinutes(order, routeEtaMinutes ?? undefined);

  const fitCoordinates = useMemo(() => {
    const pts: LatLng[] = [];
    if (riderLocation) pts.push(riderLocation);
    if (pickupCoords && mode !== 'to_drop') pts.push(pickupCoords);
    if (dropCoords && mode !== 'to_hub') pts.push(dropCoords);
    if (routeCoords.length) pts.push(...routeCoords);
    return pts;
  }, [mode, riderLocation, pickupCoords, dropCoords, routeCoords]);

  return {
    riderLocation,
    pickupCoords,
    dropCoords,
    routeCoords,
    etaMinutes,
    routeDistanceMeters,
    deliveryAddress,
    pickupLabel,
    fitCoordinates,
    locationReady,
    isRouting,
    darkstoreUsesCurrentLocation: useCurrentLocationAsDarkstore && mode === 'to_hub',
  };
}
