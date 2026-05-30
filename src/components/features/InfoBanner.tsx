/**
 * Info Banner Component
 * Light green banner showing verification success message
 * 
 * @component
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';
import Text from '../common/Text';

interface InfoBannerProps {
  message: string;
  style?: ViewStyle;
}

export default function InfoBanner({ message, style }: InfoBannerProps) {
  return (
    <View style={[styles.container, style]}>
      <Text variant="loginInfo" color={Theme.colors.primaryMedium} style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(50, 201, 106, 0.1)', // Exact Figma color
    borderRadius: scale(8),
    padding: scale(10.5), // Figma: padding: 10.5px
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: scale(10),
    lineHeight: scale(14),
    fontWeight: '700',
    color: Theme.colors.primaryMedium, // #32C96A
    textAlign: 'center',
  },
});

