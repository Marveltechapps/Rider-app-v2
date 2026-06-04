/**
 * User Context
 * Manages user profile and auth state (riderId, tokens stored in SecureStore)
 */

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { clearStoredAuth, getStoredAccessToken, getStoredRiderId, getStoredOnboardingComplete, setStoredOnboardingComplete, clearStoredOnboardingStep } from '@/api/storage';
import { AUTH_REQUIRED_MESSAGE } from '@/api/client';
import { getMe } from '@/api/auth';
import { logStartupNav, tokenPresenceLabel } from '@/utils/startupNavigation';

interface UserData {
  name: string;
  email: string;
  phoneNumber: string;
  profilePhotoUri: string | null;
  vehicleType: string | null;
  vehicleNumber: string | null;
  hubId: string | null;
  hubName: string | null;
  riderId: string | null;
  onboardingComplete: boolean;
  onboardingStep: 'profile' | 'location' | 'vehicle' | 'profile-photo' | 'documents' | 'training' | 'kit' | 'complete' | null;
  // Document data from login flow
  aadharUri: string | null;
  aadharNumber: string | null;
  panUri: string | null;
  panNumber: string | null;
  drivingLicenseUri: string | null;
  drivingLicenseNumber: string | null;
  preferredLocation: {
    latitude: number;
    longitude: number;
    addressLabel?: string;
    cityId?: string;
    cityName?: string;
    hubId?: string;
    hubName?: string;
  } | null;
  // Persisted training and kit data (populated from dashboard)
  trainingVideos?: any[];
  kitConfig?: any | null;
}

interface UserContextType {
  userData: UserData;
  isLoggedIn: boolean;
  authLoaded: boolean;
  updateUserData: (data: Partial<UserData>) => void;
  clearUserData: () => void;
  setAuthFromVerify: (data: {
    riderId?: string;
    name?: string;
    phoneNumber?: string;
    onboardingComplete?: boolean;
    onboardingStep?: UserData['onboardingStep'];
  }) => void;
  logout: () => Promise<void>;
}

const initialUserData: UserData = {
  name: '',
  email: '',
  phoneNumber: '',
  profilePhotoUri: null,
  vehicleType: null,
  vehicleNumber: null,
  hubId: null,
  hubName: null,
  riderId: null,
  onboardingComplete: false,
  onboardingStep: null,
  aadharUri: null,
  aadharNumber: null,
  panUri: null,
  panNumber: null,
  drivingLicenseUri: null,
  drivingLicenseNumber: null,
  preferredLocation: null,
  trainingVideos: [],
  kitConfig: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [authLoaded, setAuthLoaded] = useState(false);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    if (data.onboardingComplete === true) {
      void setStoredOnboardingComplete(true);
    }
    setUserData(prev => ({ ...prev, ...data }));
  }, []);

  const clearUserData = useCallback(() => {
    setUserData(initialUserData);
  }, []);

  const setAuthFromVerify = useCallback(
    (data: {
      riderId?: string;
      name?: string;
      phoneNumber?: string;
      onboardingComplete?: boolean;
      onboardingStep?: UserData['onboardingStep'];
    }) => {
      if (data.onboardingComplete) {
        void setStoredOnboardingComplete(true);
      }
      setUserData(prev => ({
        ...prev,
        ...(data.riderId != null && { riderId: data.riderId }),
        ...(data.name != null && { name: data.name }),
        ...(data.phoneNumber != null && { phoneNumber: data.phoneNumber }),
        ...(data.onboardingComplete != null && { onboardingComplete: data.onboardingComplete }),
        ...(data.onboardingStep !== undefined && { onboardingStep: data.onboardingStep }),
      }));
    },
    []
  );

  const logout = useCallback(async () => {
    const { logout: apiLogout } = await import('@/api/auth');
    await apiLogout();
    clearUserData();
  }, [clearUserData]);

  const isLoggedIn = Boolean(userData.riderId);

  // On mount: read tokens locally first so the app can render immediately (Expo Go on iOS
  // must not block on /me while localhost/LAN is still resolving). Profile sync runs in background.
  useEffect(() => {
    let cancelled = false;

    const hydrateSessionFromBackend = async () => {
      try {
        const me = await getMe();
        if (cancelled) return;
        const p = me.profile;
        if (!p) return;

        const backendComplete = !!p.onboardingComplete;
        let mergedComplete = false;

        setUserData(prev => {
          mergedComplete = prev.onboardingComplete || backendComplete;
          if (mergedComplete && !backendComplete) {
            logStartupNav('hydrate kept local onboardingComplete', {
              reason: 'backend_incomplete_local_complete',
              backendComplete: false,
              localComplete: true,
            });
          }
          if (mergedComplete) {
            void setStoredOnboardingComplete(true);
          }
          return {
            ...prev,
            riderId: p.id ?? prev.riderId,
            name: p.name ?? prev.name,
            phoneNumber: p.phoneNumber ?? prev.phoneNumber,
            email: p.email ?? prev.email,
            onboardingComplete: mergedComplete,
            onboardingStep: mergedComplete ? 'complete' : prev.onboardingStep,
            preferredLocation: p.preferredLocation ?? prev.preferredLocation,
            hubId: p.preferredLocation?.hubId ?? prev.hubId,
            hubName: p.preferredLocation?.hubName ?? prev.hubName,
            vehicleType: p.vehicle?.type ?? prev.vehicleType,
            vehicleNumber: p.vehicle?.registrationNumber ?? prev.vehicleNumber,
            profilePhotoUri: p.profilePicture ?? prev.profilePhotoUri,
          };
        });

        if (!mergedComplete) {
          const { getOnboardingState } = await import('@/api/auth');
          const state = await getOnboardingState();
          if (!cancelled) {
            setUserData(prev => {
              if (prev.onboardingComplete) return prev;
              logStartupNav('hydrate set onboardingStep from backend', {
                step: state.currentStep,
                reason: 'onboarding_not_complete',
              });
              return { ...prev, onboardingStep: state.currentStep };
            });
          }
        } else if (!cancelled) {
          void clearStoredOnboardingStep();
        }

        logStartupNav('session hydrated from backend', {
          backendOnboardingComplete: backendComplete,
          mergedOnboardingComplete: mergedComplete,
          reason: 'backend_hydrated',
        });
      } catch (e) {
        if (cancelled) return;
        const isAuthFailure =
          (e instanceof Error && e.message === AUTH_REQUIRED_MESSAGE) ||
          (typeof e === 'object' && e !== null && (e as { code?: string }).code === 'AUTH_REQUIRED');
        if (isAuthFailure) {
          await clearStoredAuth();
          setUserData(initialUserData);
          console.warn('Session expired — please log in again.');
          return;
        }
        // Backend unreachable: keep cached token so rider stays logged in offline / on slow network
        console.warn('Could not refresh profile; using saved session:', e);
      }
    };

    (async () => {
      try {
        const [riderId, accessToken, storedComplete] = await Promise.all([
          getStoredRiderId(),
          getStoredAccessToken(),
          getStoredOnboardingComplete(),
        ]);
        if (cancelled) return;
        if (!accessToken) {
          logStartupNav('boot read storage', {
            accessToken: tokenPresenceLabel(accessToken),
            riderId: riderId ?? 'missing',
            storedOnboardingComplete: storedComplete,
          });
          setUserData(initialUserData);
          setAuthLoaded(true);
          return;
        }
        logStartupNav('boot read storage', {
          accessToken: tokenPresenceLabel(accessToken),
          riderId: riderId ?? 'missing',
          storedOnboardingComplete: storedComplete,
        });
        setUserData(prev => ({
          ...prev,
          ...(riderId ? { riderId } : {}),
          onboardingComplete: storedComplete,
          ...(storedComplete ? { onboardingStep: 'complete' as const } : {}),
        }));
        setAuthLoaded(true);
        void hydrateSessionFromBackend();
      } catch (err) {
        console.error('Critical error during UserProvider mount:', err);
        if (!cancelled) setAuthLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        isLoggedIn,
        authLoaded,
        updateUserData,
        clearUserData,
        setAuthFromVerify,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}






