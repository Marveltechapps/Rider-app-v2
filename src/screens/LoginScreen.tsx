/**
 * Login Screen Component
 * Mobile login screen matching Figma design
 * 
 * @component
 * @example
 * <LoginScreen />
 */

import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Linking,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestOtp, existingUserLogin } from '../api/auth';
import { getLegalConfig, type LoginLegalConfig } from '../api/legal';
import { sanitizePhoneDigits } from '../utils/profileValidation';
import AppLogo from '../components/common/AppLogo';
import Button from '../components/common/Button';
import Text from '../components/common/Text';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import BackIcon from '../components/icons/BackIcon';
import { useUser } from '../contexts';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { authLoaded, isLoggedIn, setAuthFromVerify, updateUserData, userData } = useUser();
  const phoneInputRef = useRef<TextInput>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode] = useState('+91');
  const [checkingExisting, setCheckingExisting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [loginLegal, setLoginLegal] = useState<LoginLegalConfig | null>(null);

  useEffect(() => {
    let active = true;
    getLegalConfig()
      .then((config) => {
        if (active) setLoginLegal(config);
      })
      .catch(() => {
        if (active) setLoginLegal(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleTermsPress = () => {
    const terms = loginLegal?.terms;
    if (terms?.type === 'url' && terms.url) {
      Linking.openURL(terms.url).catch(() => {});
      return;
    }
    router.push({ pathname: '/terms-conditions', params: { returnTo: '/login' } });
  };

  const handlePrivacyPress = () => {
    const privacy = loginLegal?.privacy;
    if (privacy?.type === 'url' && privacy.url) {
      Linking.openURL(privacy.url).catch(() => {});
      return;
    }
    router.push({ pathname: '/privacy-policy', params: { returnTo: '/login' } });
  };

  // Redirection is handled by AuthGuard in app/_layout.tsx

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(sanitizePhoneDigits(text));
    if (otpError) setOtpError(null);
  };

  const handleContinue = async () => {
    if (!isPhoneValid) return;
    const fullPhoneNumber = `${countryCode} ${phoneNumber}`;
    setOtpError(null);
    setSendingOtp(true);
    try {
      const existing = await existingUserLogin(fullPhoneNumber);
      if (existing.canSkipOtp && existing.token && existing.riderId) {
        const { setStoredTokens, getStoredAccessToken } = await import('../api/storage');
        await setStoredTokens(existing.token, existing.token, existing.riderId);
        for (let i = 0; i < 20; i++) {
          const stored = await getStoredAccessToken();
          if (stored) break;
          await new Promise((r) => setTimeout(r, 50));
        }
        setAuthFromVerify({
          riderId: existing.riderId,
          name: existing.name ?? undefined,
          phoneNumber: existing.phoneNumber ?? fullPhoneNumber,
          onboardingComplete: !!existing.onboardingComplete,
        });
        if (existing.onboardingComplete) {
          router.replace('/(tabs)');
        } else {
          router.replace('/search-location');
        }
        return;
      }
      await requestOtp(fullPhoneNumber);
      router.push({
        pathname: '/otp',
        params: { phoneNumber: fullPhoneNumber },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      setOtpError(message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const isPhoneValid = /^[6-9]\d{9}$/.test(phoneNumber);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
                  Welcome to QuickRider
                </Text>

                {/* Subtitle */}
                <Text variant="loginSubtitle" color={Theme.colors.textGrey} style={styles.subtitle}>
                  Enter your mobile number to get started
                </Text>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                {/* Mobile Number Input */}
                <View style={styles.inputGroup}>
                  <Text variant="loginLabel" color={Theme.colors.textLabel} style={styles.label}>
                    Mobile Number
                  </Text>

                  <View style={styles.phoneInputContainer} pointerEvents="box-none">
                    {/* Country Code */}
                    <View style={styles.countryCodeContainer}>
                      <Text style={styles.countryCodeText}>
                        {countryCode}
                      </Text>
                    </View>

                    {/* Tap wrapper focuses input so keyboard opens on native (Expo Go) */}
                    <TouchableWithoutFeedback
                      onPress={() => {
                        phoneInputRef.current?.focus();
                      }}
                      accessible={false}
                    >
                      <View style={styles.phoneInputWrapper} collapsable={false}>
                        <TextInput
                          ref={phoneInputRef}
                          style={styles.phoneInputText}
                          value={phoneNumber}
                          onChangeText={handlePhoneChange}
                          placeholder="98765 43210"
                          placeholderTextColor={Theme.colors.textLight}
                          keyboardType="phone-pad"
                          maxLength={10}
                          editable={true}
                          caretHidden={false}
                          importantForAutofill="no"
                          blurOnSubmit={false}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                  {/* Info Box */}
                  <View style={styles.infoBoxContainer}>
                    <View style={styles.infoBox}>
                      <View style={styles.infoTextContainer}>
                        <Text
                          variant="loginInfo"
                          color="#32C96A"
                          style={styles.infoText}
                        >
                          🔒 We'll send you an OTP to verify your number
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          {otpError ? (
            <Text variant="loginSubtitle" style={[styles.otpErrorText, { color: '#C53030' }]}>
              {otpError}
            </Text>
          ) : null}
          {/* Continue Button */}
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="medium"
            disabled={!isPhoneValid || checkingExisting || sendingOtp}
            loading={checkingExisting || sendingOtp}
            icon={<ArrowRightIcon size={scale(14)} color="#FFFFFF" />}
            iconPosition="right"
            style={styles.continueButton}
          />

          {/* Terms Text */}
          <Text variant="loginTerms" color={Theme.colors.textLight} style={styles.termsText}>
            {loginLegal?.preamble ?? 'By continuing, you agree to our '}
            <Text variant="loginTerms" style={styles.termsLink} onPress={handleTermsPress}>
              {loginLegal?.terms?.label ?? 'Terms & Conditions'}
            </Text>
            {loginLegal?.connector ?? ' and '}
            <Text variant="loginTerms" style={styles.termsLink} onPress={handlePrivacyPress}>
              {loginLegal?.privacy?.label ?? 'Privacy Policy'}
            </Text>
          </Text>
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
    marginBottom: verticalScale(28),
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
  },
  subtitle: {
    // Subtitle styles
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: verticalScale(21),
  },
  label: {
    marginBottom: verticalScale(10.5),
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10.5),
    marginBottom: verticalScale(10.5),
  },
  countryCodeContainer: {
    width: scale(60),
    height: scale(44),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: Theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  countryCodeText: {
    fontSize: 14,
    fontFamily: Theme.typography.loginInput.fontFamily,
    lineHeight: 14 * 1.5,
    color: Theme.colors.textDark,
  },
  phoneInputWrapper: {
    flex: 1,
    height: scale(44),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    justifyContent: 'center',
    ...Theme.shadows.small,
  },
  phoneInputText: {
    height: scale(44),
    paddingVertical: 0,
    fontSize: 14,
    fontFamily: Theme.typography.loginInput.fontFamily,
    lineHeight: 14 * 1.5,
    color: Theme.colors.textDark,
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
  bottomSection: {
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(28),
    paddingBottom: verticalScale(21),
    backgroundColor: Theme.colors.backgroundLight,
    gap: verticalScale(21),
  },
  otpErrorText: {
    marginBottom: verticalScale(4),
    textAlign: 'center',
  },
  continueButton: {
    ...Theme.shadows.buttonPrimary,
  },
  termsText: {
    textAlign: 'center',
  },
  termsLink: {
    color: Theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

