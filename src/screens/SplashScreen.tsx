/**
 * Splash Screen Component
 * Mobile splash screen matching Figma design
 * 
 * @component
 * @example
 * <SplashScreen />
 */

import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppLogo from '../components/common/AppLogo';
import Text from '../components/common/Text';
import { Theme } from '../constants/Theme';
import { useUser } from '../contexts';
import { scale, verticalScale } from '../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { authLoaded, isLoggedIn, userData } = useUser();

  useEffect(() => {
    if (!authLoaded) return;

    // Once auth is loaded, decide where to go next.
    // This avoids getting stuck on the splash screen if segment-based routing misbehaves.
    const stepMap: Record<string, string> = {
      profile: '/personal-details',
      location: '/search-location',
      vehicle: '/vehicle-details',
      'profile-photo': '/profile-photo',
      documents: '/kyc-upload',
      training: '/training-kit',
      kit: '/training-kit',
      complete: '/(tabs)',
    };

    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }

    if (userData.onboardingComplete) {
      router.replace('/(tabs)');
      return;
    }

    if (userData.onboardingStep) {
      const target = stepMap[userData.onboardingStep];
      if (target) {
        router.replace(target as any);
        return;
      }
    }

    // Fallback: start onboarding flow
    router.replace('/search-location');
  }, [authLoaded, isLoggedIn, userData.onboardingComplete, userData.onboardingStep, router]);

  const handlePress = () => {
    // If the user taps the splash screen, we can potentially force a re-check
    // but AuthGuard should already be handling it.
  };

  return (
    <TouchableOpacity
      style={styles.touchableContainer}
      activeOpacity={1}
      onPress={handlePress}
    >
      <View style={styles.container}>
      {/* Background decorative circles */}
      <View style={styles.circleContainer}>
        {/* Top-left circle */}
        <View style={[styles.decorativeCircle, styles.circleTopLeft]} />
        {/* Bottom-right circle */}
        <View style={[styles.decorativeCircle, styles.circleBottomRight]} />
      </View>

      {/* Center content */}
      <View style={styles.centerContent}>
        {/* Glow effect container */}
        <View style={styles.glowContainer}>
          {/* Radial glow background */}
          <View style={styles.glowBackground} />
          
          {/* App icon container */}
          <View style={styles.iconContainer}>
            <AppLogo size={scale(110)} />
          </View>
        </View>

        {/* App name */}
        <Text variant="splashTitle" style={styles.appName}>QuickRider</Text>

        {/* Subtitle */}
        <Text variant="splashSubtitle" color={Theme.colors.primaryDark} style={styles.subtitle}>DELIVERY PARTNER</Text>
      </View>

      {/* Bottom caption */}
      <View style={styles.captionContainer}>
        {authLoaded ? (
          <Text variant="splashCaption" color={Theme.colors.textTertiary} style={styles.caption}>Earn on every delivery</Text>
        ) : (
          <View style={styles.restoreRow}>
            <ActivityIndicator size="small" color={Theme.colors.primaryMedium} />
            <Text variant="splashCaption" color={Theme.colors.textTertiary} style={styles.caption}>
              Restoring your session...
            </Text>
          </View>
        )}
      </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchableContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  circleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  decorativeCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Theme.colors.primaryMedium,
    opacity: 0.1,
    borderRadius: 9999,
  },
  circleTopLeft: {
    width: scale(112),
    height: scale(112),
    left: scale(35),
    top: scale(70),
  },
  circleBottomRight: {
    width: scale(168),
    height: scale(168),
    right: scale(35),
    bottom: scale(112),
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
  },
  glowContainer: {
    width: scale(118),
    height: scale(118),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  glowBackground: {
    position: 'absolute',
    width: scale(118),
    height: scale(118),
    borderRadius: scale(59),
    backgroundColor: Theme.colors.primaryLight,
    opacity: 0.6,
  },
  iconContainer: {
    width: scale(110),
    height: scale(110),
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  captionContainer: {
    position: 'absolute',
    bottom: verticalScale(40),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  caption: {
    textAlign: 'center',
  },
  restoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
});

