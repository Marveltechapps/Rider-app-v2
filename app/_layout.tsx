import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { Theme } from '../src/constants/Theme';
import { PaymentProvider } from '../src/contexts/PaymentContext';
import { ConfigProvider, UserProvider, useUser } from '../src/contexts';
import { useFonts } from '../src/hooks/useFonts';

export const unstable_settings = {
  initialRouteName: 'splash',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 1000, // 15s for rider data (Home, History, Profile, Earnings)
      gcTime: 5 * 60 * 1000, // 5 min cache keep
    },
  },
});

// List of routes that don't require authentication
const PUBLIC_ROUTES = ['login', 'otp', 'splash', 'index', ''];
const ONBOARDING_ROUTES = [
  'search-location',
  'select-hub',
  'vehicle-details',
  'profile-photo',
  'personal-details',
  'kyc-upload',
  'aadhar-upload',
  'pan-upload',
  'driving-license-upload',
  'vehicle-rc-upload',
  'vehicle-insurance-upload',
  'document-view',
  'verification',
  'verification-success',
  'training-kit'
];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { authLoaded, isLoggedIn, userData } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Brief delay so segment/router state is stable after navigation
    const t = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authLoaded || !isReady) return;
    // ... rest of initialization logic

    const currentSegment = segments[0] || '';
    const isPublicRoute = PUBLIC_ROUTES.includes(currentSegment);
    const isOnboardingRoute = ONBOARDING_ROUTES.includes(currentSegment);

    // Persist current onboarding step
    if (isLoggedIn && isOnboardingRoute) {
      import('../src/api/storage').then(({ setStoredOnboardingStep }) => {
        setStoredOnboardingStep('/' + currentSegment);
      });
    }

    // Clear onboarding step when complete
    if (isLoggedIn && userData.onboardingComplete) {
      import('../src/api/storage').then(({ clearStoredOnboardingStep }) => {
        clearStoredOnboardingStep();
      });
    }

    if (!isLoggedIn) {
      if (!isPublicRoute) {
        console.log('[AuthGuard] Not logged in, redirecting to login');
        router.replace('/login');
      }
    } else {
      // IS LOGGED IN
      if (isPublicRoute) {
        // If logged in and on a public screen, redirect based on onboarding status
        if (userData.onboardingComplete) {
          if (currentSegment === '(tabs)') return;
          console.log('[AuthGuard] User complete, redirecting to dashboard');
          router.replace('/(tabs)');
        } else if (userData.onboardingStep) {
          // Map backend step to frontend route
          const stepMap: Record<string, string> = {
            'profile': '/personal-details',
            'location': '/search-location',
            'vehicle': '/vehicle-details',
            'profile-photo': '/profile-photo',
            'documents': '/kyc-upload',
            'training': '/training-kit',
            'kit': '/training-kit',
            'complete': '/(tabs)'
          };
          const targetRoute = stepMap[userData.onboardingStep];
          if (targetRoute && '/' + currentSegment !== targetRoute) {
            console.log('[AuthGuard] Redirecting to backend-defined onboarding step:', userData.onboardingStep);
            router.replace(targetRoute as any);
          }
        } else {
          // If onboarding is NOT complete and no step defined, we should go to the onboarding flow.
          (async () => {
            try {
              const { getStoredOnboardingStep } = await import('../src/api/storage');
              const step = await getStoredOnboardingStep();
              const stepSegment = step?.replace(/^\//, '');
              if (step && !PUBLIC_ROUTES.includes(stepSegment || '')) {
                if ('/' + currentSegment === step) return;
                console.log('[AuthGuard] Resuming onboarding from stored step (fallback):', step);
                router.replace(step as any);
              } else {
                if (currentSegment === 'search-location') return;
                console.log('[AuthGuard] No stored step, starting onboarding from /search-location');
                router.replace('/search-location');
              }
            } catch {
              if (currentSegment === 'search-location') return;
              router.replace('/search-location');
            }
          })();
        }
      } else if (!userData.onboardingComplete && !isOnboardingRoute && currentSegment !== '(tabs)') {
        // If logged in but onboarding not complete, and not on an onboarding route or tabs, redirect to onboarding
        if (userData.onboardingStep) {
          const stepMap: Record<string, string> = {
            'profile': '/personal-details',
            'location': '/search-location',
            'vehicle': '/vehicle-details',
            'profile-photo': '/profile-photo',
            'documents': '/kyc-upload',
            'training': '/training-kit',
            'kit': '/training-kit',
            'complete': '/(tabs)'
          };
          const targetRoute = stepMap[userData.onboardingStep];
          if (targetRoute) {
            console.log('[AuthGuard] Redirecting to backend-defined step:', targetRoute);
            router.replace(targetRoute as any);
            return;
          }
        }
        (async () => {
          try {
            const { getStoredOnboardingStep } = await import('../src/api/storage');
            const step = await getStoredOnboardingStep();
            const stepSegment = step?.replace(/^\//, '');
            if (step && !PUBLIC_ROUTES.includes(stepSegment || '')) {
              console.log('[AuthGuard] Redirecting to onboarding step (fallback):', step);
              router.replace(step as any);
            } else {
              console.log('[AuthGuard] Redirecting to onboarding start');
              router.replace('/search-location');
            }
          } catch {
            router.replace('/search-location');
          }
        })();
      }
    }
  }, [isLoggedIn, authLoaded, segments, userData.onboardingComplete, userData.onboardingStep, isReady]);

  if (!authLoaded || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  // Prevent flicker/incorrect render while redirecting
  const currentSegment = segments[0] || '';
  const isPublicRoute = PUBLIC_ROUTES.includes(currentSegment);
  const isOnboardingRoute = ONBOARDING_ROUTES.includes(currentSegment);

  let shouldShowLoadingOverlay = false;

  if (isLoggedIn) {
    // If complete, don't show public routes (except splash which has its own timer)
    if (userData.onboardingComplete && isPublicRoute && currentSegment !== 'splash') {
      shouldShowLoadingOverlay = true;
    }
    // If incomplete, don't show tabs or other main app routes
    if (!userData.onboardingComplete && !isPublicRoute && !isOnboardingRoute) {
      shouldShowLoadingOverlay = true;
    }
  } else {
    // If not logged in, don't show any non-public route
    if (!isPublicRoute) {
      shouldShowLoadingOverlay = true;
    }
  }

  if (shouldShowLoadingOverlay) {
    return (
      <View style={{ flex: 1 }}>
        {children}
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer, { backgroundColor: Theme.colors.background }]}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useFonts();

  // Handle unhandled promise rejections (e.g., keep-awake errors)
  useEffect(() => {
    // Suppress console errors for keep-awake issues (non-critical)
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ');
      if (
        errorMessage.includes('keep awake') ||
        errorMessage.includes('keep-awake') ||
        errorMessage.includes('Unable to activate keep awake')
      ) {
        // Silently ignore keep-awake errors - they're not critical
        return;
      }
      // Call original console.error for other errors
      originalError.apply(console, args);
    };

    // Also handle global error handler if available
    try {
      const ErrorUtils = require('react-native')?.ErrorUtils;
      if (ErrorUtils && typeof ErrorUtils.getGlobalHandler === 'function') {
        const originalHandler = ErrorUtils.getGlobalHandler();

        const handleError = (error: Error, isFatal?: boolean) => {
          // Suppress keep-awake errors as they're not critical
          if (
            error?.message?.includes('keep awake') ||
            error?.message?.includes('keep-awake') ||
            error?.message?.includes('Unable to activate keep awake')
          ) {
            // Silently ignore - this is a non-critical development warning
            return;
          }
          // Call original handler for other errors
          if (originalHandler) {
            originalHandler(error, isFatal);
          }
        };

        ErrorUtils.setGlobalHandler(handleError);

        return () => {
          console.error = originalError;
          if (ErrorUtils && typeof ErrorUtils.setGlobalHandler === 'function') {
            ErrorUtils.setGlobalHandler(originalHandler);
          }
        };
      }
    } catch (e) {
      // ErrorUtils not available, just restore console.error
    }

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ConfigProvider>
              <UserProvider>
                <AuthGuard>
                  <PaymentProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                      <Stack>
                        {/* Entry point */}
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        
                        {/* Onboarding Flow */}
                        <Stack.Screen name="splash" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="otp" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="search-location" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="select-hub" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="vehicle-details" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="profile-photo" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="personal-details" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="kyc-upload" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="aadhar-upload" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="pan-upload" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="driving-license-upload" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="vehicle-rc-upload" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="vehicle-insurance-upload" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="document-view" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="verification" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="verification-success" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        <Stack.Screen name="training-kit" options={{ headerShown: false, animation: 'slide_from_right' }} />
                        
                        {/* Main App */}
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="slot-change" options={{ headerShown: false }} />
                        <Stack.Screen name="floating-cash" options={{ headerShown: false }} />
                        <Stack.Screen name="deposit-cash" options={{ headerShown: false }} />
                        <Stack.Screen 
                          name="accepted-order" 
                          options={{ 
                            headerShown: false,
                            animation: 'none',
                          }} 
                        />
                        <Stack.Screen 
                          name="order-details" 
                          options={{ 
                            headerShown: false,
                          }} 
                        />
                        <Stack.Screen 
                          name="verify-hub-items" 
                          options={{ 
                            headerShown: false,
                          }} 
                        />
                        <Stack.Screen 
                          name="delivery" 
                          options={{ 
                            headerShown: false,
                          }} 
                        />
                        <Stack.Screen 
                          name="handover-order" 
                          options={{ 
                            headerShown: false,
                          }} 
                        />
                        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
                        <Stack.Screen name="my-documents" options={{ headerShown: false }} />
                        <Stack.Screen name="payment-details" options={{ headerShown: false }} />
                        <Stack.Screen name="update-payment-details" options={{ headerShown: false }} />
                        <Stack.Screen name="help-support" options={{ headerShown: false }} />
                        <Stack.Screen name="contact-support" options={{ headerShown: false }} />
                        <Stack.Screen name="chat" options={{ headerShown: false }} />
                        <Stack.Screen name="payment-issues" options={{ headerShown: false }} />
                        <Stack.Screen name="payment-faq-not-received" options={{ headerShown: false }} />
                        <Stack.Screen name="payment-faq-wrong-amount" options={{ headerShown: false }} />
                        <Stack.Screen name="payment-faq-delays" options={{ headerShown: false }} />
                        <Stack.Screen name="delivery-issues" options={{ headerShown: false }} />
                        <Stack.Screen name="delivery-faq-customer-not-available" options={{ headerShown: false }} />
                        <Stack.Screen name="delivery-faq-wrong-address" options={{ headerShown: false }} />
                        <Stack.Screen name="delivery-faq-cancellation" options={{ headerShown: false }} />
                        <Stack.Screen name="delivery-faq-delays" options={{ headerShown: false }} />
                        <Stack.Screen name="delivery-faq-damaged-items" options={{ headerShown: false }} />
                        <Stack.Screen name="account-documents" options={{ headerShown: false }} />
                        <Stack.Screen name="account-faq-profile-verification" options={{ headerShown: false }} />
                        <Stack.Screen name="account-faq-kyc-documents" options={{ headerShown: false }} />
                        <Stack.Screen name="account-faq-suspension" options={{ headerShown: false }} />
                        <Stack.Screen name="account-faq-update-profile" options={{ headerShown: false }} />
                        <Stack.Screen name="app-issues" options={{ headerShown: false }} />
                        <Stack.Screen name="app-faq-login" options={{ headerShown: false }} />
                        <Stack.Screen name="app-faq-crashes" options={{ headerShown: false }} />
                        <Stack.Screen name="terms-conditions" options={{ headerShown: false }} />
                        <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
                        <Stack.Screen name="my-shifts" options={{ headerShown: false }} />
                        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                      </Stack>
                      <StatusBar style="dark" />
                    </ThemeProvider>
                  </PaymentProvider>
                </AuthGuard>
              </UserProvider>
            </ConfigProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
});
