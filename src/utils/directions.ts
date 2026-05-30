/**
 * Google Directions API – fetch route and decode polyline
 */

export interface RouteResult {
  coordinates: Array<{ latitude: number; longitude: number }>;
  durationMinutes: number;
  distanceMeters: number;
}

/**
 * Decode Google's encoded polyline format
 * @see https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
function decodePolyline(encoded: string): Array<{ latitude: number; longitude: number }> {
  const points: Array<{ latitude: number; longitude: number }> = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }
  return points;
}

/**
 * Fetch directions from origin to destination using Google Directions API
 */
export async function fetchDirections(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): Promise<RouteResult | null> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const url =
    `https://maps.googleapis.com/maps/api/directions/json?` +
    `origin=${origin.latitude},${origin.longitude}` +
    `&destination=${destination.latitude},${destination.longitude}` +
    `&mode=driving` +
    `&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== 'OK' || !data.routes?.[0]) return null;

    const route = data.routes[0];
    const leg = route.legs?.[0];
    const encoded = route.overview_polyline?.points;
    if (!encoded) return null;

    const coordinates = decodePolyline(encoded);
    const durationMinutes = leg?.duration?.value ? Math.ceil(leg.duration.value / 60) : 5;
    const distanceMeters = leg?.distance?.value ?? 0;

    return { coordinates, durationMinutes, distanceMeters };
  } catch (e) {
    console.warn('Directions fetch failed:', e);
    return null;
  }
}
