/**
 * Header Component
 * Reusable header component matching Figma design
 * Used across all screens for consistency
 * 
 * @component
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';
import Text from '../common/Text';
import BackIconSmall from '../icons/BackIconSmall';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  style?: ViewStyle;
}

export default function Header({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  style,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      try {
        onBack();
      } catch (err) {
        console.warn('[Header] Error in onBack handler:', err);
        if (router.canGoBack()) {
          router.back();
        }
      }
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        // If we can't go back, we're likely at the root of onboarding or app.
        // For onboarding screens, it's better to show a logout option or go to login
        // but for now we just log a warning to avoid the "GO_BACK" crash.
        console.warn('[Header] Cannot go back, no history in navigator');
      }
    }
  };

  return (
    <View style={[styles.header, style]}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <BackIconSmall size={scale(28)} color={Theme.colors.textDark} />
          </TouchableOpacity>
        )}
      <View style={styles.headerTextContainer}>
        <Text variant="loginTitle" color={Theme.colors.textDark} style={styles.headerTitle}>
          {title}
        </Text>
      {subtitle && (
          <Text variant="loginInfo" color={Theme.colors.textGrey} style={styles.headerSubtitle}>
            {subtitle}
          </Text>
        )}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: verticalScale(64),
  },
  backButton: {
    width: scale(28),
    height: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
  },
  headerSubtitle: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    marginTop: verticalScale(4),
  },
});

