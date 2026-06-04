/**
 * Bank Details — view bank account and UPI payout methods
 */

import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import AppPressable from '../components/common/AppPressable';
import PaymentPayoutCard from '../components/payment/PaymentPayoutCard';
import Header from '../components/layout/Header';
import { usePayment } from '../contexts/PaymentContext';
import paymentDetailsStyles from '../styles/paymentDetailsStyles';

export default function PaymentDetailsScreen() {
  const router = useRouter();
  const { bankDetails, upiDetails, profileUpdatedAt, refreshPaymentFromServer } = usePayment();

  useFocusEffect(
    useCallback(() => {
      void refreshPaymentFromServer();
    }, [refreshPaymentFromServer])
  );

  const handleChangePayment = useCallback(
    (initialTab: 'bank' | 'upi') => {
      router.push({
        pathname: '/update-payment-details',
        params: { initialTab },
      } as any);
    },
    [router]
  );

  const hasBank = bankDetails != null;
  const hasUpi = upiDetails != null;
  const hasConfigured = hasBank || hasUpi;

  const lastUpdatedLabel = profileUpdatedAt
    ? new Date(profileUpdatedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <SafeAreaView style={paymentDetailsStyles.container} edges={['top', 'bottom']}>
      <Header title="Bank Details" onBack={() => router.back()} />
      <ScrollView
        style={paymentDetailsStyles.scrollView}
        contentContainerStyle={paymentDetailsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!hasConfigured ? (
          <View
            style={[
              paymentDetailsStyles.primaryMethodCard,
              paymentDetailsStyles.primaryMethodCardEmpty,
            ]}
          >
            <View style={paymentDetailsStyles.emptyCardContent}>
              <Text variant="h3" style={paymentDetailsStyles.emptyCardTitle}>
                No payment method yet
              </Text>
              <Text variant="bodySm" style={paymentDetailsStyles.emptyCardBody}>
                Add your bank account or UPI ID to receive payouts. Only you can view and update
                your payment details.
              </Text>
            </View>
          </View>
        ) : (
          <View style={paymentDetailsStyles.cardsStack}>
            {hasBank ? <PaymentPayoutCard variant="bank" details={bankDetails} /> : null}
            {hasUpi ? <PaymentPayoutCard variant="upi" details={upiDetails} /> : null}
            {lastUpdatedLabel ? (
              <Text variant="caption" style={paymentDetailsStyles.pageMetaText}>
                Last updated: {lastUpdatedLabel}
              </Text>
            ) : null}
          </View>
        )}

        <View style={paymentDetailsStyles.actionRow}>
          {!hasConfigured ? (
            <AppPressable
              style={paymentDetailsStyles.primaryActionButton}
              onPress={() => handleChangePayment('bank')}
              minTouchSize={48}
            >
              <Text variant="bodySm" style={paymentDetailsStyles.primaryActionButtonText}>
                Add payment details
              </Text>
            </AppPressable>
          ) : (
            <>
              <AppPressable
                style={paymentDetailsStyles.secondaryActionButton}
                onPress={() => handleChangePayment('bank')}
                minTouchSize={48}
              >
                <Text variant="bodySm" style={paymentDetailsStyles.secondaryActionButtonText}>
                  {hasBank ? 'Edit bank' : 'Add bank'}
                </Text>
              </AppPressable>
              <AppPressable
                style={paymentDetailsStyles.secondaryActionButton}
                onPress={() => handleChangePayment('upi')}
                minTouchSize={48}
              >
                <Text variant="bodySm" style={paymentDetailsStyles.secondaryActionButtonText}>
                  {hasUpi ? 'Edit UPI' : 'Add UPI'}
                </Text>
              </AppPressable>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
