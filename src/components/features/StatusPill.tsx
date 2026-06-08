/**
 * Status Pill Component
 * Green pill showing "Completed" status with checkmark icon
 * 
 * @component
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale } from '../../utils/responsive';
import Text from '../common/Text';
import CheckmarkSmallGreenIcon from '../icons/CheckmarkSmallGreenIcon';

interface StatusPillProps {
  style?: ViewStyle;
}

export default function StatusPill({ style }: StatusPillProps) {
  return (
    <View style={[styles.container, style]}>
      <CheckmarkSmallGreenIcon size={scale(10.5)} />
      <Text variant="loginInfo" color={Theme.colors.primaryMedium} style={styles.text}>
        Completed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(7), // Figma: gap between icon and text
    paddingHorizontal: scale(7),
    paddingVertical: scale(5.25),
    backgroundColor: 'rgba(35, 114, 39, 0.1)', // Exact Figma color
    borderRadius: scale(8.75), // Figma: 8.75px
    width: scale(82), // Figma: width: 82
    height: scale(21), // Figma: height: 21
  },
  text: {
    fontSize: scale(10.5),
    lineHeight: scale(14), // 10.5 * 1.3333333333333333
    fontWeight: '700',
    color: Theme.colors.primaryMedium, // #237227
  },
});

