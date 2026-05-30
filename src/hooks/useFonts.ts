/**
 * Font Loading Hook
 * Loads Inter font family for the app using @expo-google-fonts/inter
 */

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useExpoFonts,
} from '@expo-google-fonts/inter';

export function useFonts() {
  const [fontsLoaded, error] = useExpoFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (error) {
    console.warn('Error loading fonts:', error);
    // Return true to allow app to continue even if fonts fail to load
    // The app will fall back to system fonts
    return true;
  }

  return fontsLoaded ?? false;
}

