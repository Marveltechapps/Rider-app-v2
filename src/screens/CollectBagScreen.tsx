/**
 * Step 3 — Collect bag from darkstore (scan assigned bag, then collect).
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import BagBarcodeScanner from '../components/features/BagBarcodeScanner';
import Text from '../components/common/Text';
import CheckIcon from '../components/icons/CheckIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { pickOrder } from '../api/orders';
import { useActiveOrder, invalidateActiveOrder } from '../hooks/useActiveOrder';
import verifyHubItemsStyles from '../styles/verifyHubItemsStyles';
import { formatCustomerPhone, formatDeliveryAddress, getPickupLabel } from '../utils/fleetMapCoords';
import { getAssignedBagId, getDarkstoreCode } from '../utils/orderBag';
import { scale, verticalScale } from '../utils/responsive';

type VerifyStep = 'bagAssigned' | 'bagScanned' | 'bagVerified';

const VERIFY_STEPS: { key: VerifyStep; label: string }[] = [
  { key: 'bagAssigned', label: 'Bag assigned to order' },
  { key: 'bagScanned', label: 'Bag barcode scanned' },
  { key: 'bagVerified', label: 'Bag verified correctly' },
];

export default function CollectBagScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? '';
  const [bagScanned, setBagScanned] = useState(false);
  const [bagVerified, setBagVerified] = useState(false);
  const [scannedBagId, setScannedBagId] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { order, isLoading, isError, error } = useActiveOrder(orderId);

  const assignedBagId = useMemo(() => getAssignedBagId(order), [order]);
  const darkstoreCode = getDarkstoreCode(order);
  const darkstoreLabel = darkstoreCode ? `Darkstore ${darkstoreCode}` : getPickupLabel(order) || 'Darkstore';

  const itemCount = useMemo(
    () => order?.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0,
    [order?.items]
  );

  const stepDone: Record<VerifyStep, boolean> = {
    bagAssigned: !!assignedBagId,
    bagScanned: bagScanned,
    bagVerified: bagVerified,
  };

  const canCollect = bagVerified && !!assignedBagId;

  const handleScanVerified = useCallback((code: string) => {
    setScannedBagId(code);
    setBagScanned(true);
    setBagVerified(true);
  }, []);

  const handleCollect = useCallback(async () => {
    if (!orderId || !canCollect || submitting) return;
    setSubmitting(true);
    try {
      await pickOrder(orderId);
      invalidateActiveOrder(queryClient, orderId);
      router.replace({ pathname: '/customer-navigation', params: { orderId } });
    } catch (e) {
      console.error('Collect order failed:', e);
    } finally {
      setSubmitting(false);
    }
  }, [orderId, canCollect, submitting, router, queryClient]);

  return (
    <SafeAreaView style={verifyHubItemsStyles.container} edges={['top']}>
      <Header title="Collect Bag" subtitle={darkstoreLabel} onBack={() => router.back()} />

      <ScrollView
        style={verifyHubItemsStyles.content}
        contentContainerStyle={{ gap: scale(16), padding: scale(16), paddingBottom: verticalScale(120) }}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={Theme.colors.primaryMedium} />
        ) : isError ? (
          <Text variant="bodySm" color={Theme.colors.textGrey}>
            {error instanceof Error ? error.message : 'Failed to load order'}
          </Text>
        ) : (
          <>
            <View
              style={{
                backgroundColor: Theme.colors.white,
                borderRadius: scale(12),
                padding: scale(16),
                gap: scale(8),
              }}
            >
              <Text variant="caption" color={Theme.colors.textGrey}>
                ORDER
              </Text>
              <Text variant="h3" color={Theme.colors.textDark}>
                {order?.orderNumber}
              </Text>
              <Text variant="bodySm" color={Theme.colors.textGrey}>
                Customer: {formatCustomerPhone(order) || '—'}
              </Text>
              <Text variant="bodySm" color={Theme.colors.textGrey}>
                Store: {darkstoreLabel}
              </Text>
              <Text variant="bodySm" color={Theme.colors.textGrey}>
                Items: {itemCount}
              </Text>
              <Text variant="bodySm" color={Theme.colors.textDark} numberOfLines={2}>
                Deliver to: {formatDeliveryAddress(order)}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: Theme.colors.white,
                borderRadius: scale(12),
                padding: scale(16),
                gap: scale(8),
                borderWidth: 1,
                borderColor: Theme.colors.primaryMedium,
              }}
            >
              <Text variant="caption" color={Theme.colors.textGrey}>
                ASSIGNED BAG
              </Text>
              <Text variant="h3" color={Theme.colors.textDark} style={{ fontFamily: 'monospace' }}>
                {assignedBagId || '—'}
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: scale(8),
                  backgroundColor: Theme.colors.primaryMedium,
                  borderRadius: scale(12),
                  paddingVertical: scale(14),
                  alignItems: 'center',
                }}
                onPress={() => setScannerOpen(true)}
                activeOpacity={0.85}
                disabled={!assignedBagId}
              >
                <Text variant="body" color={Theme.colors.white} style={{ fontWeight: '700' }}>
                  Scan bag barcode
                </Text>
              </TouchableOpacity>
              {scannedBagId ? (
                <Text variant="caption" color={Theme.colors.primaryMedium}>
                  Last scan: {scannedBagId}
                </Text>
              ) : null}
            </View>

            <Text variant="h3" color={Theme.colors.textDark}>
              Verification checklist
            </Text>
            {VERIFY_STEPS.map((step) => (
              <View key={step.key} style={verifyHubItemsStyles.itemCard}>
                <View
                  style={[
                    verifyHubItemsStyles.checkbox,
                    stepDone[step.key] && verifyHubItemsStyles.checkboxChecked,
                  ]}
                >
                  {stepDone[step.key] ? <CheckIcon size={scale(24)} color={Theme.colors.white} /> : null}
                </View>
                <Text variant="bodySm" color="#364153" style={verifyHubItemsStyles.itemName}>
                  {step.label}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <View
        style={[
          verifyHubItemsStyles.bottomButtonContainer,
          { marginBottom: Math.max(verticalScale(16), insets.bottom) },
        ]}
      >
        {!canCollect && !isLoading ? (
          <Text
            variant="caption"
            color={Theme.colors.textGrey}
            style={{ textAlign: 'center', marginBottom: scale(8) }}
          >
            Scan and verify the assigned bag to enable collection
          </Text>
        ) : null}
        <TouchableOpacity
          style={[
            verifyHubItemsStyles.bottomButton,
            (!canCollect || submitting) && verifyHubItemsStyles.bottomButtonDisabled,
          ]}
          onPress={handleCollect}
          disabled={!canCollect || submitting || isLoading}
        >
          <Text variant="body" color={Theme.colors.white} style={verifyHubItemsStyles.bottomButtonText}>
            {submitting ? 'Collecting…' : 'Collect Order'}
          </Text>
        </TouchableOpacity>
      </View>

      {scannerOpen ? (
        <BagBarcodeScanner
          visible
          expectedBagId={assignedBagId}
          onClose={() => setScannerOpen(false)}
          onVerified={handleScanVerified}
        />
      ) : null}
    </SafeAreaView>
  );
}
