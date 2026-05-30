import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface GeocodeResult {
  formattedAddress: string;
  city: string;
  state: string;
}

/**
 * Formats a reverse geocode result into a readable string
 */
export function formatPlaceName(rev: { 
  district?: string | null; 
  name?: string | null; 
  city?: string | null; 
  region?: string | null; 
  subregion?: string | null 
}): string {
  const area = rev.district ?? rev.name ?? rev.city ?? rev.subregion ?? '';
  const cityOrRegion = rev.city ?? rev.region ?? rev.subregion ?? '';
  if (area && cityOrRegion && area !== cityOrRegion) return `${area}, ${cityOrRegion}`;
  if (area || cityOrRegion) return area || cityOrRegion;
  return 'Current location';
}

/**
 * Performs reverse geocoding, preferring Google Maps API if key is available
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (apiKey) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        let city = '';
        let state = '';
        
        for (const component of result.address_components) {
          if (component.types.includes('locality')) {
            city = component.long_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (!city && component.types.includes('administrative_area_level_2')) {
            city = component.long_name;
          }
        }
        
        return {
          formattedAddress: result.formatted_address,
          city,
          state,
        };
      }
    } catch (error) {
      console.warn('Google Maps Reverse Geocoding failed, falling back to Expo:', error);
    }
  }

  // Fallback to Expo location
  try {
    const [reverse] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (reverse) {
      return {
        formattedAddress: formatPlaceName(reverse),
        city: reverse.city ?? reverse.subregion ?? reverse.region ?? '',
        state: reverse.region ?? reverse.subregion ?? '',
      };
    }
  } catch (error) {
    console.error('Expo Reverse Geocoding failed:', error);
  }

  return {
    formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    city: '',
    state: '',
  };
}

/**
 * Performs forward geocoding/place search, preferring Google Maps API
 */
export async function searchPlaces(query: string): Promise<Array<{ label: string; latitude: number; longitude: number }>> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (apiKey) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        return data.results.slice(0, 5).map((res: any) => ({
          label: res.formatted_address,
          latitude: res.geometry.location.lat,
          longitude: res.geometry.location.lng,
        }));
      }
    } catch (error) {
      console.warn('Google Maps Geocoding failed, falling back to Expo:', error);
    }
  }

  // Fallback to Expo geocode (Native only)
  if (Platform.OS !== 'web') {
    try {
      const locations = await Location.geocodeAsync(query);
      const limited = locations.slice(0, 3);
      const results: Array<{ label: string; latitude: number; longitude: number }> = [];
      
      for (const loc of limited) {
        const { formattedAddress } = await reverseGeocode(loc.latitude, loc.longitude);
        results.push({
          label: formattedAddress,
          latitude: loc.latitude,
          longitude: loc.longitude,
        });
      }
      return results;
    } catch (error) {
      console.error('Expo Geocoding failed:', error);
    }
  }

  return [];
}

/**
 * Geocode a single address string and return coordinates, or null if not found
 */
export async function geocodeAddress(
  address: string
): Promise<{ latitude: number; longitude: number; formattedAddress: string } | null> {
  const results = await searchPlaces(address);
  if (results.length > 0) {
    return {
      latitude: results[0].latitude,
      longitude: results[0].longitude,
      formattedAddress: results[0].label,
    };
  }
  return null;
}
