/**
 * Customer delivery OTP — rider taps Send OTP, enters customer code, taps Verify OTP.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import OtpPinInput, { type OtpPinInputRef } from '../components/OtpPinInput';
import Text from '../components/common/Text';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { resendDeliveryOtp, sendDeliveryOtp, verifyDeliveryOtp } from '../api/orders';
import { useActiveOrder, invalidateActiveOrder } from '../hooks/useActiveOrder';
import handoverOrderStyles from '../styles/handoverOrderStyles';
import { formatCustomerPhone, getCustomerPhoneDigits } from '../utils/fleetMapCoords';
import { formatIndianMobileDisplay, toTenDigitMobile } from '../utils/phoneNumber';
import { scale } from '../utils/responsive';

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

function mapVerifyErrorMessage(message?: string): string {
  if (!message) return 'Invalid OTP';
  const lower = message.toLowerCase();
  if (lower.includes('expired')) return 'OTP expired. Please resend OTP.';
  if (lower.includes('not sent') || lower.includes('no otp')) {
    return 'OTP not sent. Please send OTP first.';
  }
  if (lower.includes('incorrect') || lower.includes('invalid') || lower.includes('wrong')) {
    return 'Invalid OTP';
  }
  if (lower.includes('enter otp') || lower.includes('4 digit')) return 'Enter OTP';
  return message;
}

function SendOtpButton({
  onPress,
  disabled,
  loading,
}: {
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        handoverOrderStyles.otpPrimaryActionButton,
        { opacity: disabled ? 0.5 : 1 },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Send OTP"
      testID="customer-otp-send-button"
    >
      {loading ? (
        <ActivityIndicator color={Theme.colors.white} />
      ) : (
        <Text variant="body" color={Theme.colors.white} style={{ fontWeight: '700' }}>
          Send OTP
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function CustomerOtpVerificationScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    orderId?: string;
    phoneNumber?: string;
  }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? '';
  const phoneParam = Array.isArray(params.phoneNumber) ? params.phoneNumber[0] : params.phoneNumber;

  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  /** Only true after rider taps Send OTP and API succeeds — never from order metadata. */
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const otpInputRef = useRef<OtpPinInputRef>(null);
  const verifyInFlightRef = useRef(false);

  const { order, isLoading } = useActiveOrder(orderId);
  const phoneDigits = getCustomerPhoneDigits(order) || toTenDigitMobile(phoneParam ?? '');
  const phoneDisplay =
    formatCustomerPhone(order) ||
    formatIndianMobileDisplay(phoneParam ?? '') ||
    (phoneDigits ? `+91 ${phoneDigits}` : '');
  const customerLabel = phoneDisplay || order?.orderNumber || orderId;

  useEffect(() => {
    if (order?.metadata?.deliveryOtpVerifiedAt && orderId) {
      router.replace({ pathname: '/delivery-photo', params: { orderId } });
    }
  }, [order?.metadata?.deliveryOtpVerifiedAt, orderId, router]);

  useEffect(() => {
    if (timer <= 0 || canResend) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const startResendTimer = useCallback((seconds: number = RESEND_SECONDS) => {
    setCanResend(false);
    setTimer(seconds);
  }, []);

  const dispatchSendOtp = useCallback(
    async (isResend: boolean) => {
      if (!orderId || !phoneDigits) return false;
      setSendingOtp(true);
      setOtpError(null);
      try {
        const res = isResend
          ? await resendDeliveryOtp(orderId, { mobileNumber: phoneDigits })
          : await sendDeliveryOtp(orderId, { mobileNumber: phoneDigits });
        if (!res.success && !res.otpSent) {
          throw new Error(res.message || 'Failed to send OTP');
        }
        setOtpSent(true);
        startResendTimer(res.expiresInSec ?? RESEND_SECONDS);
        setOtpValue('');
        requestAnimationFrame(() => otpInputRef.current?.focus());
        // Do not refetch order here — avoids stale cache; verify uses server-stored OTP.
        return true;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Please try again.';
        setOtpError(message);
        Alert.alert(isResend ? 'Unable to resend OTP' : 'Unable to send OTP', message);
        return false;
      } finally {
        setSendingOtp(false);
      }
    },
    [orderId, phoneDigits, queryClient, startResendTimer]
  );

  const handleSendOtp = useCallback(() => {
    if (!phoneDigits) {
      Alert.alert(
        'Customer phone missing',
        'This order has no valid customer mobile number on file.'
      );
      return;
    }
    dispatchSendOtp(false);
  }, [phoneDigits, dispatchSendOtp]);

  const handleResendOtp = useCallback(() => {
    if (!canResend || sendingOtp || !phoneDigits) return;
    setOtpValue('');
    dispatchSendOtp(true);
  }, [canResend, sendingOtp, phoneDigits, dispatchSendOtp]);

  const handleVerifyOtp = useCallback(async () => {
    if (!orderId || verifying || verifyInFlightRef.current) return;
    if (!otpSent) {
      setOtpError('OTP not sent. Please send OTP first.');
      return;
    }
    const code = otpValue.replace(/\D/g, '').trim();
    if (code.length !== OTP_LENGTH) {
      setOtpError('Enter OTP');
      return;
    }
    otpInputRef.current?.blur();
    Keyboard.dismiss();
    await new Promise((resolve) => setTimeout(resolve, Platform.OS === 'android' ? 120 : 60));

    verifyInFlightRef.current = true;
    setOtpError(null);
    setVerifying(true);
    try {
      const res = await verifyDeliveryOtp(orderId, code);
      if (res.verified && res.success !== false) {
        await invalidateActiveOrder(queryClient, orderId);
        router.replace({ pathname: '/delivery-photo', params: { orderId } });
        return;
      }
      setOtpError(mapVerifyErrorMessage(res.message));
      setOtpValue('');
      otpInputRef.current?.focus();
    } catch (e: unknown) {
      setOtpError(e instanceof Error ? e.message : 'Unable to verify OTP');
      setOtpValue('');
      otpInputRef.current?.focus();
    } finally {
      setVerifying(false);
      verifyInFlightRef.current = false;
    }
  }, [orderId, verifying, otpSent, otpValue, queryClient, router]);

  const handleOtpChange = useCallback(
    (next: string) => {
      if (verifying || !otpSent) return;
      setOtpError(null);
      setOtpValue(next);
    },
    [verifying, otpSent]
  );

  const otpInputDisabled = !otpSent || verifying || sendingOtp;
  const otpComplete = otpValue.length === OTP_LENGTH;
  const canVerify = otpSent && !verifying && !sendingOtp && otpComplete;
  const showResend = otpSent && (canResend || timer > 0);

  return (
    <SafeAreaView style={handoverOrderStyles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? scale(64) : 0}
      >
        <Header title="OTP Verification" subtitle="Verify customer identity" onBack={() => router.back()} />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={handoverOrderStyles.customerCard}>
            <View style={handoverOrderStyles.customerInfo}>
              <Text variant="h3" color="#101828">{customerLabel}</Text>
              <Text variant="bodySm" color="#6A7282">Order {order?.orderNumber || orderId}</Text>
            </View>
          </View>

          <View style={handoverOrderStyles.otpSection}>
            <Text variant="h3" color="#101828">Customer OTP</Text>

            {!otpSent ? (
              <Text variant="bodySm" color="#6A7282">
                Send a 4-digit OTP to the customer&apos;s mobile
                {phoneDisplay ? ` (${phoneDisplay})` : ''}, then enter the code they share with you.
              </Text>
            ) : (
              <Text variant="bodySm" color="#32C96A">
                OTP sent to customer mobile number
              </Text>
            )}

            {sendingOtp ? (
              <View style={styles.statusRow}>
                <ActivityIndicator size="small" color={Theme.colors.primaryMedium} />
                <Text variant="bodySm" color="#6A7282">Sending OTP…</Text>
              </View>
            ) : null}

            {verifying ? (
              <View style={styles.statusRow}>
                <ActivityIndicator size="small" color={Theme.colors.primaryMedium} />
                <Text variant="bodySm" color="#32C96A">Verifying OTP…</Text>
              </View>
            ) : null}

            <OtpPinInput
              ref={otpInputRef}
              length={OTP_LENGTH}
              value={otpValue}
              onChange={handleOtpChange}
              disabled={otpInputDisabled}
              autoFocus={false}
              dismissKeyboardOnComplete
              testID="customer-delivery-otp"
            />

            {!otpSent ? (
              <Text variant="bodySm" color="#6A7282" style={{ textAlign: 'center' }}>
                OTP entry is disabled until you send OTP
              </Text>
            ) : null}

            {otpError ? (
              <View style={handoverOrderStyles.otpErrorBanner}>
                <View style={handoverOrderStyles.otpErrorIcon}>
                  <Text style={handoverOrderStyles.otpErrorIconText}>!</Text>
                </View>
                <Text style={handoverOrderStyles.otpErrorText}>{otpError}</Text>
              </View>
            ) : null}

            {showResend ? (
              <View style={{ alignItems: 'center' }}>
                {!canResend ? (
                  <Text variant="bodySm" color="#6A7282">
                    Resend OTP in{' '}
                    <Text variant="bodySm" color={Theme.colors.primaryMedium}>
                      {timer}s
                    </Text>
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={sendingOtp}
                    activeOpacity={0.7}
                    testID="customer-otp-resend-button"
                  >
                    <Text variant="bodySm" color={Theme.colors.primaryMedium} style={{ fontWeight: '700' }}>
                      {sendingOtp ? 'Sending…' : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}

            {isLoading ? <ActivityIndicator color={Theme.colors.primaryMedium} /> : null}
          </View>
        </ScrollView>

        <View
          style={[
            handoverOrderStyles.otpScreenFooter,
            { paddingBottom: Math.max(insets.bottom, scale(12)) },
          ]}
        >
          {!otpSent ? (
            <SendOtpButton
              onPress={handleSendOtp}
              disabled={!phoneDigits || isLoading}
              loading={sendingOtp}
            />
          ) : (
            <TouchableOpacity
              style={[
                handoverOrderStyles.otpPrimaryActionButton,
                { opacity: canVerify ? 1 : 0.5 },
              ]}
              onPress={handleVerifyOtp}
              disabled={!canVerify}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Verify OTP"
              testID="customer-otp-verify-button"
            >
              {verifying ? (
                <ActivityIndicator color={Theme.colors.white} />
              ) : (
                <Text variant="body" color={Theme.colors.white} style={{ fontWeight: '700' }}>
                  Verify OTP
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    padding: scale(16),
    gap: scale(20),
    paddingBottom: scale(24),
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
});
