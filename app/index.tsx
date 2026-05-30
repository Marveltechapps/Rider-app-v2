/**
 * Main Entry Point
 * Redirects to splash screen to start onboarding flow
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/splash" />;
}

