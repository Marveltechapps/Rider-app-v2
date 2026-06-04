/**
 * Web — manual bag entry only (no expo-camera on web bundle).
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../common/Text';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';

export interface BagCameraPaneProps {
  active: boolean;
  scanLocked: boolean;
  onBarcode: (data: string) => void;
}

export default function BagCameraPane({ active }: BagCameraPaneProps) {
  if (!active) return null;
  return (
    <View style={styles.fallback}>
      <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.fallbackText}>
        Enter the bag barcode below (camera scan works on the mobile app).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    minHeight: verticalScale(120),
    justifyContent: 'center',
    padding: scale(16),
    backgroundColor: Theme.colors.gray200,
    borderRadius: scale(12),
    marginBottom: scale(16),
  },
  fallbackText: {
    textAlign: 'center',
  },
});
