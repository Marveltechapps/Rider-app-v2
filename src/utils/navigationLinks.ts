import { Linking, Platform } from 'react-native';
import type { LatLng } from './fleetMapCoords';

/** Open Google / Apple Maps turn-by-turn from rider GPS to destination. */
export function openDrivingDirections(
  origin: LatLng | null,
  destination: LatLng,
  destinationLabel?: string
): void {
  const { latitude: dLat, longitude: dLng } = destination;
  let url: string;

  if (origin) {
    const { latitude: oLat, longitude: oLng } = origin;
    url =
      Platform.OS === 'ios'
        ? `maps://?saddr=${oLat},${oLng}&daddr=${dLat},${dLng}&dirflg=d`
        : `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${dLat},${dLng}&travelmode=driving`;
  } else {
    url =
      Platform.OS === 'ios'
        ? `maps://app?daddr=${dLat},${dLng}&dirflg=d`
        : `https://www.google.com/maps/dir/?api=1&destination=${dLat},${dLng}&travelmode=driving`;
  }

  Linking.openURL(url).catch(() => {
    if (destinationLabel) {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationLabel)}`
      ).catch(console.warn);
    }
  });
}
