/**
 * Payment Details Screen Component
 * Shows current primary payout method with option to change
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import CheckmarkSmallGreenIcon from '../components/icons/CheckmarkSmallGreenIcon';
import InfoIcon from '../components/icons/InfoIcon';
import ShieldCheckIcon from '../components/icons/ShieldCheckIcon';
import Header from '../components/layout/Header';
import { usePayment } from '../contexts/PaymentContext';
import paymentDetailsStyles from '../styles/paymentDetailsStyles';
import { scale } from '../utils/responsive';

export default function PaymentDetailsScreen() {
  const router = useRouter();
  const { paymentMethod } = usePayment();

  const handleChangePayment = useCallback(() => {
    router.push('/update-payment-details' as any);
  }, [router]);

  const maskAccountNumber = (accountNumber: string) => {
    const last4 = accountNumber.slice(-4);
    return `•••• •••• ${last4}`;
  };

  const hasConfigured = paymentMethod.type !== 'none';

  return (
    <SafeAreaView style={paymentDetailsStyles.container} edges={['top', 'bottom']}>
      <Header title="Bank Details" onBack={() => router.back()} />
      <ScrollView
        style={paymentDetailsStyles.scrollView}
        contentContainerStyle={paymentDetailsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasConfigured ? (
          <View style={[paymentDetailsStyles.primaryMethodCard, { backgroundColor: '#6B7280', justifyContent: 'center' }]}>
            <View style={{ paddingHorizontal: scale(20), gap: scale(12) }}>
              <Text variant="h3" style={{ color: '#FFFFFF' }}>
                No payment method yet
              </Text>
              <Text variant="bodySm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Add your own bank account or UPI ID to receive payouts. Your details are never shared with other riders.
              </Text>
              <TouchableOpacity
                onPress={handleChangePayment}
                style={{
                  marginTop: scale(8),
                  backgroundColor: '#FFFFFF',
                  paddingVertical: scale(12),
                  borderRadius: scale(12),
                  alignItems: 'center',
                }}
                activeOpacity={0.85}
              >
                <Text variant="bodySm" style={{ color: '#364153', fontWeight: '600' }}>
                  Add payment details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={[
              paymentDetailsStyles.primaryMethodCard,
              paymentMethod.type === 'upi' && paymentDetailsStyles.primaryMethodCardUpi,
            ]}
          >
            <View style={paymentDetailsStyles.decorativeCircle1} />
            <View style={paymentDetailsStyles.decorativeCircle2} />

            <View style={paymentDetailsStyles.primaryMethodTop}>
              <View style={paymentDetailsStyles.primaryMethodLeft}>
                <Text variant="bodySm" style={paymentDetailsStyles.primaryMethodLabel} numberOfLines={1}>
                  Primary Method
                </Text>
                <Text variant="h3" style={paymentDetailsStyles.primaryMethodTitle} numberOfLines={1}>
                  {paymentMethod.type === 'bank'
                    ? paymentMethod.bankDetails.bankName?.trim() || 'Bank transfer'
                    : 'UPI Transfer'}
                </Text>
              </View>
              <View style={paymentDetailsStyles.primaryMethodIcon} />
            </View>

            <View style={paymentDetailsStyles.primaryMethodMiddle}>
              <Text variant="caption" style={paymentDetailsStyles.primaryMethodFieldLabel} numberOfLines={1}>
                {paymentMethod.type === 'bank' ? 'ACCOUNT NUMBER' : 'UPI ID'}
              </Text>
              <Text variant="h3" style={paymentDetailsStyles.primaryMethodFieldValue} numberOfLines={1}>
                {paymentMethod.type === 'bank'
                  ? maskAccountNumber(paymentMethod.bankDetails.accountNumber || '')
                  : paymentMethod.upiDetails.upiId}
              </Text>
            </View>

            <View style={paymentDetailsStyles.primaryMethodBottom}>
              <View style={paymentDetailsStyles.accountHolderSection}>
                <Text variant="caption" style={paymentDetailsStyles.primaryMethodFieldLabel} numberOfLines={1}>
                  ACCOUNT HOLDER
                </Text>
                <Text variant="body" style={paymentDetailsStyles.accountHolderName} numberOfLines={1}>
                  {paymentMethod.type === 'bank'
                    ? paymentMethod.bankDetails.accountHolderName
                    : paymentMethod.upiDetails.accountHolderName}
                </Text>
              </View>
              {paymentMethod.isVerified && (
                <View style={paymentDetailsStyles.verifiedBadge}>
                  <CheckmarkSmallGreenIcon size={scale(10.5)} />
                  <Text variant="caption" style={paymentDetailsStyles.verifiedText}>
                    Verified
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={paymentDetailsStyles.infoRow}>
          <InfoIcon size={scale(17.5)} color="#32C96A" />
          <Text variant="bodySm" color="#364153" style={paymentDetailsStyles.infoText}>
            You can cash out only 2 times a day
          </Text>
        </View>

        <View style={paymentDetailsStyles.buttonSection}>
          <TouchableOpacity
            style={paymentDetailsStyles.changeButton}
            onPress={handleChangePayment}
            activeOpacity={0.8}
          >
            <Text variant="bodySm" color="#364153" style={paymentDetailsStyles.changeButtonText}>
              {hasConfigured ? 'Change Payment Details' : 'Add Payment Details'}
            </Text>
          </TouchableOpacity>

          <View style={paymentDetailsStyles.securityNote}>
            <ShieldCheckIcon size={scale(10.5)} color="#6B7280" />
            <Text variant="caption" color="#6B7280" style={paymentDetailsStyles.securityText}>
              Your payment details are encrypted and secure
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
