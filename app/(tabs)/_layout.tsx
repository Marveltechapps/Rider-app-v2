import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUser } from '../../src/contexts';
import { Colors as BrandColors } from '../../src/constants/Colors';
import { Theme } from '../../src/constants/Theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { riderWebSocketService } from '../../src/services/websocket.service';
import { useRiderLocationSync } from '../../src/hooks/useRiderLocationSync';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { authLoaded, isLoggedIn, userData } = useUser();
  const queryClient = useQueryClient();

  useRiderLocationSync(userData?.riderId, isLoggedIn && !!userData?.onboardingComplete);

  // WebSocket: connect once when logged in, stay connected across all tabs, disconnect only on logout
  useEffect(() => {
    if (!userData?.riderId) {
      riderWebSocketService.disconnect();
      return;
    }
    riderWebSocketService.connect(userData.riderId);
    const handler = (payload: unknown) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['rider-home'] });
      const p = payload as { orderId?: string; orderNumber?: string } | null;
      const activeId = p?.orderId || p?.orderNumber;
      if (activeId) {
        void prefetchActiveOrder(queryClient, activeId);
      }
    };
    riderWebSocketService.on('orders:refresh', handler);
    return () => {
      riderWebSocketService.off('orders:refresh', handler);
      riderWebSocketService.disconnect();
    };
  }, [userData?.riderId, queryClient]);

  // Onboarding routing is handled by app/index + AuthGuard — do NOT redirect to Select City here.
  if (!authLoaded || !isLoggedIn) {    return (
      <View style={tabStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  const renderTabIcon = (name: any, color: string, focused: boolean) => (
    <View style={[tabStyles.iconContainer, focused && tabStyles.iconContainerActive]}>
      <IconSymbol size={24} name={name} color={focused ? '#FFFFFF' : color} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BrandColors.primaryMedium,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 8, // Increased space to prevent label from hiding under the icon
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 75 + insets.bottom : 80, // Increased height to accommodate label spacing
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 2 : 8,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => renderTabIcon('house.fill', color, focused),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => renderTabIcon('shippingbox.fill', color, focused),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color, focused }) => renderTabIcon('chart.bar.fill', color, focused),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => renderTabIcon('clock.fill', color, focused),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => renderTabIcon('person.fill', color, focused),
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: BrandColors.primaryMedium,
    borderRadius: 8,
    // Shadow matching BottomTabBar
    shadowColor: BrandColors.primaryMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});
