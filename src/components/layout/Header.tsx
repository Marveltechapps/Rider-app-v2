/**
 * Header Component
 * Reusable header — tab roots use showBackButton={false} for left-aligned titles.
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';
import Text from '../common/Text';
import AppPressable from '../common/AppPressable';
import BackIconSmall from '../icons/BackIconSmall';
import { runBackNavigation } from '../../utils/safeNavigation';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  /** Reserves subtitle row height so title aligns with screens that show a subtitle (e.g. Edit Profile). */
  reserveSubtitleSpace?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

/** Screen title typography — same as Edit Profile / Header bar titles */
export function HeaderTitle({
  children,
  style,
}: {
  children: string;
  style?: TextStyle;
}) {
  return (
    <Text variant="loginTitle" color={Theme.colors.textDark} style={style}>
      {children}
    </Text>
  );
}

export default function Header({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  reserveSubtitleSpace = false,
  style,
  titleStyle,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    runBackNavigation(router, onBack);
  }, [router, onBack]);

  return (
    <View style={[styles.header, style]} pointerEvents="box-none">
      {showBackButton ? (
        <AppPressable
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <BackIconSmall size={scale(28)} color={Theme.colors.textDark} />
        </AppPressable>
      ) : null}
      <View
        style={[styles.headerTextContainer, !showBackButton && styles.headerTextContainerTab]}
        pointerEvents="none"
      >
        <HeaderTitle style={titleStyle}>{title}</HeaderTitle>
        {subtitle ? (
          <Text variant="loginInfo" color={Theme.colors.textGrey} style={styles.headerSubtitle}>
            {subtitle}
          </Text>
        ) : reserveSubtitleSpace ? (
          <Text variant="loginInfo" style={styles.headerSubtitleSpacer} accessibilityElementsHidden>
            {' '}
          </Text>
        ) : null}
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
    width: scale(44),
    height: scale(44),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(4),
    flexShrink: 0,
  },
  headerTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  headerTextContainerTab: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    marginTop: verticalScale(4),
    alignSelf: 'stretch',
  },
  headerSubtitleSpacer: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    marginTop: verticalScale(4),
    opacity: 0,
  },
});
