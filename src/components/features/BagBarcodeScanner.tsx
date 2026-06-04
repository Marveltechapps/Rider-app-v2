/**
 * Modal barcode scanner to verify assigned delivery bag.
 */

import React, { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../common/Text';
import { Theme } from '../../constants/Theme';
import { bagCodesMatch, normalizeBagCode } from '../../utils/orderBag';
import { scale, verticalScale } from '../../utils/responsive';
import BagCameraPane from './BagCameraPane';

export interface BagBarcodeScannerProps {
  visible: boolean;
  expectedBagId: string;
  onClose: () => void;
  onVerified: (scannedCode: string) => void;
}

export default function BagBarcodeScanner({
  visible,
  expectedBagId,
  onClose,
  onVerified,
}: BagBarcodeScannerProps) {
  const [scanLocked, setScanLocked] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const verifyCode = useCallback(
    (raw: string) => {
      const scanned = normalizeBagCode(raw);
      if (!scanned) {
        Alert.alert('Invalid code', 'Scan or enter a valid bag barcode.');
        return;
      }
      if (!expectedBagId) {
        Alert.alert('No bag assigned', 'This order has no bag ID on record.');
        return;
      }
      if (bagCodesMatch(scanned, expectedBagId)) {
        onVerified(scanned);
        onClose();
        setManualCode('');
        return;
      }
      Alert.alert(
        'Bag mismatch',
        `This bag does not match the order.\n\nExpected: ${expectedBagId}\nScanned: ${scanned}`
      );
    },
    [expectedBagId, onClose, onVerified]
  );

  const handleBarcode = useCallback(
    (data: string) => {
      if (scanLocked || !data) return;
      setScanLocked(true);
      verifyCode(data);
      setTimeout(() => setScanLocked(false), 1500);
    },
    [scanLocked, verifyCode]
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h3" color={Theme.colors.textDark}>
            Scan bag
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Text variant="body" color={Theme.colors.primaryMedium} style={{ fontWeight: '700' }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>

        <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.hint}>
          Scan the barcode on the bag assigned to this order
        </Text>
        <Text variant="caption" color={Theme.colors.textDark} style={styles.expected}>
          Expected: {expectedBagId || '—'}
        </Text>

        <BagCameraPane active={visible} scanLocked={scanLocked} onBarcode={handleBarcode} />

        <View style={styles.manualRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter bag barcode"
            placeholderTextColor={Theme.colors.textGrey}
            value={manualCode}
            onChangeText={setManualCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={() => verifyCode(manualCode)}
            activeOpacity={0.85}
          >
            <Text variant="bodySm" color={Theme.colors.white} style={{ fontWeight: '700' }}>
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
    paddingTop: verticalScale(48),
    paddingHorizontal: scale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  hint: {
    marginBottom: scale(4),
  },
  expected: {
    fontWeight: '700',
    marginBottom: scale(12),
  },
  manualRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(24),
  },
  input: {
    flex: 1,
    height: scale(48),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
    backgroundColor: Theme.colors.white,
    color: Theme.colors.textDark,
    fontSize: scale(14),
  },
  verifyBtn: {
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(10),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
