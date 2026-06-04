/**
 * Cold-start router — returning onboarded riders go straight to Home.
 */

import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useUser } from '../src/contexts';
import { Theme } from '../src/constants/Theme';
import { logStartupNav } from '../src/utils/startupNavigation';

const ONBOARDING_STEP_ROUTES: Record<string, string> = {
  profile: '/personal-details',
  location: '/search-location',
  vehicle: '/vehicle-details',
  'profile-photo': '/profile-photo',
  documents: '/kyc-upload',
  training: '/training-kit',
  kit: '/training-kit',
  complete: '/(tabs)',
};

export default function Index() {
  const { authLoaded, isLoggedIn, userData } = useUser();

  useEffect(() => {
    if (!authLoaded) return;

    if (!isLoggedIn) {
      logStartupNav('index route selected', {
        route: '/login',
        reason: 'no_token_or_rider_id',
        onboardingComplete: userData.onboardingComplete,
      });
      return;
    }

    if (userData.onboardingComplete) {
      logStartupNav('index route selected', {
        route: '/(tabs)',
        reason: 'token_and_onboarding_complete',
        onboardingComplete: true,
        riderId: userData.riderId ?? 'unknown',
      });
      return;
    }

    const stepRoute = userData.onboardingStep
      ? ONBOARDING_STEP_ROUTES[userData.onboardingStep]
      : null;

    logStartupNav('index route selected', {
      route: stepRoute ?? '/search-location',
      reason: stepRoute ? 'onboarding_incomplete_resume_step' : 'onboarding_incomplete_start',
      onboardingComplete: false,
      onboardingStep: userData.onboardingStep ?? 'none',
      riderId: userData.riderId ?? 'unknown',
    });
  }, [authLoaded, isLoggedIn, userData.onboardingComplete, userData.onboardingStep, userData.riderId]);

  if (!authLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  if (userData.onboardingComplete) {
    return <Redirect href="/(tabs)" />;
  }

  if (userData.onboardingStep) {
    const target = ONBOARDING_STEP_ROUTES[userData.onboardingStep];
    if (target) {
      return <Redirect href={target as any} />;
    }
  }

  return <Redirect href="/search-location" />;
}
