/**
 * Bottom Tab Bar Component
 * Custom bottom navigation bar matching Figma design
 * 
 * @component
 */

import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';
import Text from '../common/Text';
import EarningsIcon from '../icons/EarningsIcon';
import HistoryIcon from '../icons/HistoryIcon';
import HomeIcon from '../icons/HomeIcon';
import ProfileIcon from '../icons/ProfileIcon';

interface TabItem {
  name: string;
  label: string;
  route: string;
  icon: React.ComponentType<{ size?: number; color?: string; active?: boolean; style?: any }>;
}

const tabs: TabItem[] = [
  {
    name: 'home',
    label: 'Home',
    route: '/home',
    icon: HomeIcon,
  },
  {
    name: 'earnings',
    label: 'Earnings',
    route: '/earnings',
    icon: EarningsIcon,
  },
  {
    name: 'history',
    label: 'History',
    route: '/history',
    icon: HistoryIcon,
  },
  {
    name: 'profile',
    label: 'Profile',
    route: '/profile',
    icon: ProfileIcon,
  },
];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (pathname === '/home' || pathname === '/' || pathname === '/index' || pathname === '/slot-change' || pathname === '/floating-cash' || pathname === '/deposit-cash') return 'home';
    if (pathname === '/earnings') return 'earnings';
    if (pathname === '/history') return 'history';
    if (pathname === '/profile') return 'profile';
    return 'home'; // Default to home
  };

  const activeTab = getActiveTab();

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          const IconComponent = tab.icon;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <IconComponent
                  size={scale(46.2 * 0.75)} // 75% of container size (46.2px) = 34.65px
                  active={isActive}
                />
              </View>
              <Text
                variant="caption"
                color={isActive ? Theme.colors.primaryMedium : Theme.colors.textLight}
                style={styles.tabLabel}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderGrey,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    // Shadow: 0px -5px 20px 0px rgba(0, 0, 0, 0.02)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.02,
    shadowRadius: 20,
    elevation: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: scale(30),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: scale(1.4),
    paddingTop: scale(-2.1),
  },
  iconContainer: {
    width: scale(36),
    height: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(8),
    // Shadow: 0px 4px 6px -4px rgba(50, 201, 106, 0.2), 0px 10px 15px -3px rgba(50, 201, 106, 0.2)
    shadowColor: Theme.colors.primaryMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  tabLabel: {
    fontSize: scale(12),
    lineHeight: scale(14),
    fontWeight: '400',
  },
});

