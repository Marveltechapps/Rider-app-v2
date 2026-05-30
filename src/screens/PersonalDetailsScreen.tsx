/**
 * Personal Details Screen Component
 * User enters name, email, and verifies phone number
 * 
 * @component
 * @example
 * <PersonalDetailsScreen />
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import Header from '../components/layout/Header';
import ProfilePlaceholderIcon from '../components/icons/ProfilePlaceholderIcon';
import { Theme } from '../constants/Theme';
import { useUser } from '../contexts';
import { goBackOrReplace, resolvePersonalDetailsFallback } from '../utils/navigation/safeBack';
import { scale, verticalScale } from '../utils/responsive';
import { updateRider } from '../api/rider';

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userData, updateUserData } = useUser();
  
  useEffect(() => {
    // Persist current onboarding step so we can resume if user leaves midway
    (async () => {
      const { setStoredOnboardingStep } = await import('@/api/storage');
      await setStoredOnboardingStep('/personal-details');
    })();
    return () => {};
  }, []);
  // Helper to check if name is the default "Rider XXXX"
  const isDefaultName = (name: string) => /^Rider\s+\d{4}$/.test(name);
  
  const [name, setName] = useState(isDefaultName(userData.name) ? '' : (userData.name || ''));
  const [email, setEmail] = useState(userData.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const phoneNumber = userData.phoneNumber;
  const profilePhotoUri = params.selfieUri as string | null;
  const vehicleType = params.vehicleType as string;
  const vehicleNumber = params.vehicleNumber as string | null;
  const returnTo = params.returnTo as string | undefined;
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleBack = () => {
    goBackOrReplace(router, resolvePersonalDetailsFallback(returnTo));
  };

  const validateName = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length < 2) return false;
    // Allow letters, spaces, hyphens, apostrophes, dots (e.g. "Mary-Jane", "O'Brien", "St. John")
    return /^[a-zA-Z\u00C0-\u024F\s\-'.]+$/.test(trimmed);
  };

  const validateEmail = (text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed.length) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed);
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (nameError) setNameError('');
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handleContinue = async () => {
    let hasError = false;

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      hasError = true;
    } else if (!validateName(name)) {
      setNameError('Please enter a valid name (at least 2 characters)');
      hasError = true;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsLoading(true);

      // Call API to update rider profile in MongoDB
      if (userData.riderId) {
        await updateRider(userData.riderId, {
          name: name.trim(),
          email: email.trim().toLowerCase(),
        });
      }

      // Update context state
      updateUserData({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber as string,
        profilePhotoUri: profilePhotoUri,
        vehicleType: vehicleType,
        vehicleNumber: vehicleNumber,
      });

      // Navigate to KYC upload screen
      router.replace('/kyc-upload');
    } catch (error: any) {
      console.error('Error updating personal details:', error);
      Alert.alert(
        'Update Failed',
        error.message || 'Failed to update personal details. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const isContinueEnabled = !isLoading &&
                           trimmedName.length >= 2 &&
                           validateName(name) &&
                           trimmedEmail.length > 0 &&
                           validateEmail(email);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.mainContainer}>
          <Header
            title="Personal Details"
            subtitle="Complete your profile information"
            onBack={handleBack}
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* Profile Photo Display */}
              <View style={styles.profilePhotoSection}>
                <View style={styles.profilePhotoContainer}>
                  {profilePhotoUri ? (
                    <Image
                      source={{ uri: profilePhotoUri as string }}
                      style={styles.profilePhoto}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.profilePhotoPlaceholder}>
                      <ProfilePlaceholderIcon size={scale(24)} color={Theme.colors.textLight} />
                    </View>
                  )}
                </View>
              </View>

              {/* Name Input Section */}
              <View style={styles.section}>
                <View style={styles.labelContainer}>
                  <Text style={styles.sectionTitle}>Full Name</Text>
                  <Text style={styles.requiredStar}>*</Text>
                </View>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, nameError && styles.inputError]}
                    placeholder="Enter your full name"
                    placeholderTextColor="#717182"
                    value={name}
                    onChangeText={handleNameChange}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                </View>
                
                {nameError ? (
                  <Text style={styles.errorText}>{nameError}</Text>
                ) : null}

                <Text style={styles.helperText}>
                  Enter your name as per government ID
                </Text>
              </View>

              {/* Email Input Section */}
              <View style={styles.section}>
                <View style={styles.labelContainer}>
                  <Text style={styles.sectionTitle}>Email Address</Text>
                  <Text style={styles.requiredStar}>*</Text>
                </View>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, emailError && styles.inputError]}
                    placeholder="Enter your email address"
                    placeholderTextColor="#717182"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
                
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}

                <Text style={styles.helperText}>
                  We'll send important updates to this email
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isContinueEnabled && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!isContinueEnabled}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color={Theme.colors.white} />
              ) : (
                <>
                  <Text
                    variant="loginButton"
                    color={!isContinueEnabled ? Theme.colors.textLight : Theme.colors.white}
                    style={styles.continueButtonText}
                  >
                    Continue
                  </Text>
                  <ArrowRightIcon
                    size={scale(14)}
                    color={!isContinueEnabled ? Theme.colors.textLight : Theme.colors.white}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  keyboardAvoid: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: verticalScale(21),
    paddingBottom: verticalScale(21),
  },
  content: {
    width: '100%',
    maxWidth: scale(360),
    alignSelf: 'center',
    gap: verticalScale(28),
  },
  profilePhotoSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  profilePhotoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Theme.colors.primaryMedium,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  profilePhotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    width: '100%',
    gap: scale(12),
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requiredStar: {
    fontSize: scale(14),
    color: '#FB2C36',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: scale(14),
    lineHeight: scale(21),
    color: Theme.colors.textDark,
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '700',
  },
  inputContainer: {
    width: '100%',
    height: scale(56), // Increased from 49 to match 56 in Figma/Design
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    fontSize: 16, // Increased from 14 for better visibility
    color: Theme.colors.textDark,
    fontFamily: Theme.typography.body.fontFamily,
    height: '100%',
    paddingVertical: 0,
    textAlignVertical: 'center',
    alignSelf: 'stretch',
  },
  inputError: {
    borderColor: '#FB2C36',
  },
  errorText: {
    fontSize: scale(12),
    lineHeight: scale(18),
    color: '#FB2C36',
    fontFamily: Theme.typography.body.fontFamily,
  },
  helperText: {
    fontSize: scale(10),
    lineHeight: scale(14),
    color: Theme.colors.textLight,
    fontFamily: Theme.typography.body.fontFamily,
  },
  bottomSection: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.gray100,
    paddingHorizontal: 16,
    paddingTop: verticalScale(22),
    paddingBottom: verticalScale(21),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  continueButton: {
    height: scale(44),
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(8),
    ...Theme.shadows.buttonPrimary,
  },
  continueButtonDisabled: {
    backgroundColor: Theme.colors.gray200,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
    textAlign: 'center',
  },
});

