/**
 * Native camera barcode pane (iOS/Android only — Metro resolves .native.tsx).
 */

import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useCallback, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Text from '../common/Text';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';

export interface BagCameraPaneProps {
  active: boolean;
  scanLocked: boolean;
  onBarcode: (data: string) => void;
}

export default function BagCameraPane({ active, scanLocked, onBarcode }: BagCameraPaneProps) {
  const [permission, requestPermission] = useCameraPermissions();

  const ensurePermission = useCallback(async () => {
    if (permission?.granted) return true;
    const res = await requestPermission();
    if (!res.granted) {
      Alert.alert('Camera required', 'Allow camera access to scan the bag barcode.');
    }
    return res.granted;
  }, [permission?.granted, requestPermission]);

  useEffect(() => {
    if (active) ensurePermission();
  }, [active, ensurePermission]);

  if (!active) return null;

  if (!permission?.granted) {
    return (
      <View style={styles.fallback}>
        <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.fallbackText}>
          Camera permission is required to scan. Allow access in Settings, or enter the barcode below.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.cameraWrap}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'code39', 'ean13', 'ean8'],
        }}
        onBarcodeScanned={
          scanLocked
            ? undefined
            : ({ data }) => {
                if (data) onBarcode(data);
              }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cameraWrap: {
    flex: 1,
    minHeight: verticalScale(280),
    borderRadius: scale(12),
    overflow: 'hidden',
    backgroundColor: Theme.colors.gray200,
    marginBottom: scale(16),
  },
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
