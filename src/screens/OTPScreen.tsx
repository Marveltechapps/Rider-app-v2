/**
 * OTP Verification Screen Component
 * Mobile OTP verification screen matching Figma design
 * 
 * @component
 * @example
 * <OTPScreen phoneNumber="+91 98765 43210" />
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import AppLogo from '../components/common/AppLogo';
import Text from '../components/common/Text';
import Button from '../components/common/Button';
import BackIcon from '../components/icons/BackIcon';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import { useUser } from '../contexts';
import { requestOtp, verifyOtp, type OnboardingStateResponse } from '../api/auth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OTPScreenProps {
  phoneNumber?: string;
}

export default function OTPScreen({ phoneNumber = '+91 98765 43210' }: OTPScreenProps) {
  const router = useRouter();
  const { updateUserData, setAuthFromVerify } = useUser();
  const OTP_LENGTH = 4; // Signin API sends 4-digit OTP via SMS
  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Add small delay to verifyOtp to ensure state updates and storage settle
  const verifyWithStateSync = async (otpValue: string) => {
    try {
      await handleVerifyOtp(otpValue);
    } catch (err) {
      // Error handled in handleVerifyOtp
    }
  };

  // Auto-focus first input on mount
  useEffect(() => {
    const t = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !canResend) {
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
    }
  }, [timer, canResend]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const pastedOtp = value.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedOtp.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      const joined = newOtp.join('');
      if (joined.length === OTP_LENGTH) verifyWithStateSync(joined);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '') && newOtp.join('').length === OTP_LENGTH) {
      verifyWithStateSync(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpValue: string) => {
    setOtpError(null);
    setVerifying(true);
    try {
      const res = await verifyOtp(phoneNumber as string, otpValue);
      const tokens = res.tokens;
      const riderId = res.riderId;
      if (tokens?.accessToken && tokens?.refreshToken && riderId) {
        const { setStoredTokens, getStoredAccessToken } = await import('../api/storage');
        await setStoredTokens(tokens.accessToken, tokens.refreshToken, riderId);
        // Ensure token is readable from storage before navigating (avoids home API firing with no token and redirecting to login). iOS SecureStore can be slow.
        for (let i = 0; i < 20; i++) {
          const stored = await getStoredAccessToken();
          if (stored) break;
          await new Promise((r) => setTimeout(r, 50));
        }
      }
      console.log('[OTPScreen] OTP verified successfully:', {
        riderId: res.riderId,
        onboardingComplete: res.onboardingComplete,
      });

      // First-time users have placeholder name and incomplete KYC → backend sets onboardingComplete false; keep onboarding flow.
      const onboardingComplete = res.onboardingComplete === true;

      let onboardingStep: OnboardingStateResponse['currentStep'] | undefined;
      try {
        const { getOnboardingState } = await import('../api/auth');
        const state = await getOnboardingState();
        onboardingStep = state.currentStep;
      } catch (e) {
        console.warn('[OTPScreen] getOnboardingState after verify failed:', e);
      }

      setAuthFromVerify({
        riderId: res.riderId ?? undefined,
        name: res.name ?? undefined,
        phoneNumber: res.phoneNumber ?? (phoneNumber as string),
        onboardingComplete,
        ...(onboardingStep !== undefined && { onboardingStep }),
      });
      
      // We no longer call router.replace here. AuthGuard in _layout.tsx will
      // automatically detect the new auth state and perform the correct redirect.
      // This avoids race conditions and double-navigation.
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP';
      setOtpError(message);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || sendingOtp) return;
    setOtpError(null);
    setTimer(30);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    setSendingOtp(true);
    try {
      await requestOtp(phoneNumber as string);
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '') && otp.join('').length === OTP_LENGTH;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.content}>
              {/* Header Section */}
              <View style={styles.header}>
                {/* Back Button */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                  activeOpacity={0.7}
                >
                  <BackIcon size={scale(42)} />
                </TouchableOpacity>

                {/* App Icon */}
                <View style={styles.iconContainer}>
                  <AppLogo size={scale(72)} />
                </View>

                {/* Title */}
                <Text variant="loginTitle" color={Theme.colors.textDark} style={styles.title}>
                  Enter OTP
                </Text>

                {/* Subtitle */}
                <View style={styles.subtitleContainer}>
                  <Text variant="loginSubtitle" color={Theme.colors.textGrey} style={styles.subtitle}>
                    We've sent a 4-digit code to
                  </Text>
                  <Text variant="loginLabel" color={Theme.colors.textDark} style={styles.phoneNumber}>
                    {phoneNumber}
                  </Text>
                </View>
              </View>

              {sendingOtp && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={Theme.colors.primaryMedium} />
                  <Text variant="loginSubtitle" color={Theme.colors.textGrey} style={styles.loadingText}>
                    Sending OTP…
                  </Text>
                </View>
              )}
              {otpError ? (
                <Text variant="loginInfo" style={[styles.errorText, { color: '#C53030' }]}>
                  {otpError}
                </Text>
              ) : null}
              {/* OTP Input Section */}
              <View style={styles.otpSection}>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <View
                      key={index}
                      style={[
                        styles.otpInputBox,
                        focusedIndex === index && styles.otpInputBoxActive,
                      ]}
                    >
                      <TextInput
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                        keyboardType="number-pad"
                        maxLength={1}
                        editable={!verifying}
                        selectTextOnFocus
                        textAlign="center"
                      />
                    </View>
                  ))}
                </View>
              </View>

              {/* Resend OTP Section */}
              <View style={styles.resendSection}>
                {!canResend ? (
                  <Text variant="loginSubtitle" color={Theme.colors.textLight} style={styles.resendText}>
                    Resend OTP in{' '}
                    <Text variant="loginLabel" color={Theme.colors.primaryMedium} style={styles.timerText}>
                      {timer}s
                    </Text>
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    activeOpacity={0.7}
                    style={styles.resendButton}
                  >
                    <Text variant="loginLabel" color={Theme.colors.primaryMedium} style={styles.resendButtonText}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Info Box */}
          <View style={styles.infoBoxContainer}>
            <View style={styles.infoBox}>
              <View style={styles.infoTextContainer}>
                {verifying ? (
                  <View style={styles.verifyingRow}>
                    <ActivityIndicator size="small" color="#32C96A" />
                    <Text variant="loginInfo" color="#32C96A" style={styles.infoText}>
                      Verifying OTP…
                    </Text>
                  </View>
                ) : (
                  <Text variant="loginInfo" color="#32C96A" style={styles.infoText}>
                    ✨ OTP will auto-verify when entered
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(21),
  },
  content: {
    width: '100%',
    maxWidth: scale(360),
    alignSelf: 'center',
  },
  header: {
    marginBottom: verticalScale(21),
  },
  backButton: {
    width: scale(42),
    height: scale(42),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: Theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(28),
    // Figma shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(42),
  },
  title: {
    marginBottom: verticalScale(10.5),
    textAlign: 'left',
  },
  subtitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  subtitle: {
    marginRight: scale(4),
  },
  phoneNumber: {
    // Phone number styles
  },
  otpSection: {
    width: '100%',
    marginBottom: verticalScale(21),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(10.5),
    width: '100%',
  },
  otpInputBox: {
    width: scale(56),
    height: scale(56),
    backgroundColor: Theme.colors.white,
    borderWidth: 2,
    borderColor: Theme.colors.borderGrey,
    borderRadius: Theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  otpInputBoxActive: {
    borderColor: '#CEE3D7',
  },
  otpInputBoxFilled: {
    borderColor: Theme.colors.borderGrey,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    fontSize: Theme.typography.loginTitle.fontSize,
    fontFamily: Theme.typography.loginTitle.fontFamily,
    fontWeight: Theme.typography.loginTitle.fontWeight,
    color: Theme.colors.textDark,
    textAlign: 'center',
  },
  resendSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(21),
  },
  resendText: {
    textAlign: 'center',
  },
  timerText: {
    textAlign: 'center',
  },
  resendButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
  },
  resendButtonText: {
    textAlign: 'center',
    color: Theme.colors.primaryMedium,
  },
  bottomSection: {
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(28),
    paddingBottom: verticalScale(21),
    backgroundColor: Theme.colors.backgroundLight,
  },
  infoBoxContainer: {
    width: '100%',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(50, 201, 106, 0.2)',
    borderRadius: scale(14),
    paddingHorizontal: scale(15),
    paddingTop: scale(1),
    paddingBottom: scale(1),
    height: scale(47.5),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  infoTextContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    textAlign: 'center',
    width: '100%',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    marginBottom: verticalScale(8),
  },
  loadingText: {
    marginLeft: scale(4),
  },
  verifyingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
  },
  errorText: {
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
});

