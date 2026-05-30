/**
 * Info Banner Component
 * Information banner with icon and text
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { scale, verticalScale } from '../../utils/responsive';
import Text from './Text';

interface InfoBannerProps {
  icon: React.ReactNode;
  message: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

export default function InfoBanner({
  icon,
  message,
  backgroundColor = '#EFF6FF',
  textColor = '#1447E6',
  borderColor = '#DBEAFE',
}: InfoBannerProps) {
  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      {icon}
      <View style={styles.textContainer}>
        <Text variant="caption" color={textColor} style={styles.text}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: scale(10.5),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
    borderWidth: 1,
    borderRadius: scale(12.75),
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: scale(10),
    fontWeight: '400',
    lineHeight: scale(14),
  },
});

