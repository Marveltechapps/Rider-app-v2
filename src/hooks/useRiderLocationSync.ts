/**
 * Posts rider GPS to backend while active (fleet map sync)
 */

import * as Location from 'expo-location';
import { useEffect, useRef } from 'react';
import { updateRiderLocation } from '../api/location';

const POST_INTERVAL_MS = 15000;

export function useRiderLocationSync(riderId: string | undefined, enabled = true) {
  const lastPostRef = useRef(0);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    if (!riderId || !enabled) return;

    let cancelled = false;

    const postLocation = async (lat: number, lng: number) => {
      const now = Date.now();
      if (now - lastPostRef.current < POST_INTERVAL_MS) return;
      lastPostRef.current = now;
      try {
        await updateRiderLocation(riderId, { lat, lng });
      } catch {
        // Silent — map sync is best-effort
      }
    };

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) return;

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!cancelled) {
          await postLocation(loc.coords.latitude, loc.coords.longitude);
        }

        watchRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: POST_INTERVAL_MS,
            distanceInterval: 20,
          },
          (newLoc) => {
            if (!cancelled) {
              postLocation(newLoc.coords.latitude, newLoc.coords.longitude);
            }
          }
        );
      } catch {
        // Permission denied or unavailable
      }
    })();

    return () => {
      cancelled = true;
      watchRef.current?.remove();
      watchRef.current = null;
    };
  }, [riderId, enabled]);
}
