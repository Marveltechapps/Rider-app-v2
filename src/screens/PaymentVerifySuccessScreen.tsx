/**
 * Payment Verify Success Screen Component
 * Shows confirmation after successful payment details update
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import CheckmarkLargeWhiteIcon from '../components/icons/CheckmarkLargeWhiteIcon';
import paymentSuccessStyles from '../styles/paymentSuccessStyles';
import { scale } from '../utils/responsive';

export default function PaymentVerifySuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const method = params.method as 'bank' | 'upi';
  const accountHolder = params.accountHolder as string;
  const detail = params.detail as string;

  const handleBackToPaymentDetails = useCallback(() => {
    router.push('/payment-details' as any);
  }, [router]);

  const handleChangeAgain = useCallback(() => {
    router.push({
      pathname: '/update-payment-details',
      params: { initialTab: method },
    } as any);
  }, [router, method]);

  const getSubtitle = () => {
    if (method === 'bank') {
      return 'Your bank account has been verified and set as your primary payout method.';
    }
    return 'Your UPI ID has been verified and set as your primary payout method.';
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (method === 'upi') return accountNumber;
    const last4 = accountNumber.slice(-4);
    return `•••• •••• ${last4}`;
  };

  return (
    <SafeAreaView style={paymentSuccessStyles.container} edges={['top', 'bottom']}>
      <View style={paymentSuccessStyles.content}>
        {/* Success Icon */}
        <View style={paymentSuccessStyles.successIconContainer}>
          <CheckmarkLargeWhiteIcon size={scale(60)} color="#FFFFFF" />
        </View>

        {/* Title and Subtitle */}
        <View style={paymentSuccessStyles.textContainer}>
          <Text variant="h1" color="#101828" style={paymentSuccessStyles.title}>
            Payment Details Updated
          </Text>
          <Text variant="body" color="#6A7282" style={paymentSuccessStyles.subtitle}>
            {getSubtitle()}
          </Text>
        </View>

        {/* Summary Card */}
        <View style={paymentSuccessStyles.summaryCard}>
          <View style={paymentSuccessStyles.summaryBadge}>
            <Text variant="caption" color="#32C96A" style={paymentSuccessStyles.summaryBadgeText}>
              Primary Method
            </Text>
          </View>

          <View style={paymentSuccessStyles.summaryInfo}>
            <Text variant="h3" color="#101828" style={paymentSuccessStyles.summaryLabel}>
              {method === 'bank' ? 'Account Number' : 'UPI ID'}
            </Text>
            <Text variant="body" color="#6A7282" style={paymentSuccessStyles.summaryValue}>
              {maskAccountNumber(detail)}
            </Text>
          </View>

          <View style={paymentSuccessStyles.summaryInfo}>
            <Text variant="bodySm" color="#6B7280" style={paymentSuccessStyles.summaryAccountLabel}>
              Account Holder
            </Text>
            <Text variant="body" color="#101828" style={paymentSuccessStyles.summaryAccountValue}>
              {accountHolder}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={paymentSuccessStyles.buttonContainer}>
          {/* Primary Button */}
          <TouchableOpacity
            style={paymentSuccessStyles.primaryButton}
            onPress={handleBackToPaymentDetails}
            activeOpacity={0.8}
          >
            <Text variant="h3" style={paymentSuccessStyles.primaryButtonText}>
              Back to Payment Details
            </Text>
          </TouchableOpacity>

          {/* Secondary Button */}
          <TouchableOpacity
            style={paymentSuccessStyles.secondaryButton}
            onPress={handleChangeAgain}
            activeOpacity={0.7}
          >
            <Text variant="body" style={paymentSuccessStyles.secondaryButtonText}>
              Change Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

