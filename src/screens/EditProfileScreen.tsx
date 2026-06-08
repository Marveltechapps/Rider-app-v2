/**
 * Edit Profile Screen Component
 * Allows users to edit their profile information with photo upload
 * Matches Figma design exactly
 */

import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import LabeledInput from '../components/common/LabeledInput';
import Text from '../components/common/Text';
import CheckmarkSmallIcon from '../components/icons/CheckmarkSmallIcon';
import EmailIcon from '../components/icons/EmailIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import UserIcon from '../components/icons/UserIcon';
import ProfileScreenShell from '../components/layout/ProfileScreenShell';
import { useUser } from '../contexts';
import { isSyntheticRiderPhone } from '@/utils/loginContact';
import { getMe, uploadProfilePhoto } from '../api/auth';
import { updateRider } from '../api/rider';
import editProfileStyles from '../styles/editProfileStyles';
import { Profile } from '../types/profile';
import {
  normalizePhoneDigits,
  parseProfileValidationFromApi,
  ProfileFieldErrors,
  sanitizePhoneDigits,
  validateProfileForm,
  formatPhoneForBackend,
} from '../utils/profileValidation';
import { scale } from '../utils/responsive';

export default function EditProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userData, updateUserData } = useUser();

  const resolveDisplayName = (name: string) => {
    const rawName = name || '';
    const isPlaceholder =
      !rawName ||
      rawName === 'Rider Name' ||
      (rawName.startsWith('Rider ') && /^\d{4}$/.test(rawName.substring(6)));
    return isPlaceholder ? '' : rawName;
  };

  // Initialize profile from userData - this ensures existing data from login flow is shown
  const initialPhone = () => {
    if (userData.loginMethod === 'email' && isSyntheticRiderPhone(userData.phoneNumber)) return '';
    return normalizePhoneDigits(userData.phoneNumber || '');
  };
  const initialEmail = () => {
    if (userData.loginMethod === 'email' && userData.loginContact) return userData.loginContact;
    return userData.email || '';
  };

  const [profile, setProfile] = useState<Profile>(() => ({
    fullName: resolveDisplayName(userData.name || ''),
    phoneNumber: initialPhone(),
    email: initialEmail(),
    avatarUri: userData.profilePhotoUri || null,
  }));
  const [errors, setErrors] = useState<ProfileFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const storedPhoneDigits = normalizePhoneDigits(userData.phoneNumber || '');

  // Update profile when userData changes - ensures existing data from login flow is displayed
  useEffect(() => {
    setProfile({
      fullName: resolveDisplayName(userData.name || ''),
      phoneNumber:
        userData.loginMethod === 'email' && isSyntheticRiderPhone(userData.phoneNumber)
          ? ''
          : normalizePhoneDigits(userData.phoneNumber || ''),
      email:
        userData.loginMethod === 'email' && userData.loginContact
          ? userData.loginContact
          : userData.email || '',
      avatarUri: userData.profilePhotoUri || null,
    });
    setErrors({});
    setSubmitError(null);
  }, [userData.name, userData.phoneNumber, userData.email, userData.profilePhotoUri, userData.loginMethod, userData.loginContact]);

  const handleTakePhoto = useCallback(async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take a photo.');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfile((prev) => ({ ...prev, avatarUri: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  }, []);

  const handleSelectFromGallery = useCallback(async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to change your photo.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfile((prev) => ({ ...prev, avatarUri: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  }, []);

  const handleUploadPhoto = useCallback(() => {
    Alert.alert(
      'Upload Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Gallery', onPress: handleSelectFromGallery },
      ]
    );
  }, [handleTakePhoto, handleSelectFromGallery]);

  const validate = useCallback(() => {
    const newErrors = validateProfileForm({
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      originalPhoneNumber: userData.phoneNumber,
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profile, userData.phoneNumber]);

  const hasChanges = useCallback(() => {
    const rawName = userData.name || '';
    const isPlaceholder =
      !rawName ||
      rawName === 'Rider Name' ||
      (rawName.startsWith('Rider ') && /^\d{4}$/.test(rawName.substring(6)));
    const baselineName = isPlaceholder ? '' : rawName;
    return (
      profile.fullName.trim() !== baselineName ||
      normalizePhoneDigits(profile.phoneNumber) !== storedPhoneDigits ||
      profile.email.trim().toLowerCase() !== (userData.email || '').trim().toLowerCase() ||
      profile.avatarUri !== (userData.profilePhotoUri || null)
    );
  }, [profile, storedPhoneDigits, userData]);

  const handleSave = useCallback(async () => {
    setSubmitError(null);
    if (!hasChanges()) return;
    if (!validate()) return;

    const riderId = userData.riderId;
    if (!riderId) {
      setSubmitError('You must be logged in to save profile changes.');
      return;
    }

    setIsSaving(true);
    const trimmedName = profile.fullName.trim();
    const trimmedEmail = profile.email.trim().toLowerCase();
    const phoneDigits = normalizePhoneDigits(profile.phoneNumber);
    const phoneChanged = phoneDigits !== storedPhoneDigits;

    try {
      let profilePictureUrl = userData.profilePhotoUri;
      const avatarChanged =
        profile.avatarUri !== (userData.profilePhotoUri || null);
      const isLocalPhoto =
        profile.avatarUri &&
        !profile.avatarUri.startsWith('http://') &&
        !profile.avatarUri.startsWith('https://');

      if (avatarChanged && isLocalPhoto && profile.avatarUri) {
        const photoRes = await uploadProfilePhoto(profile.avatarUri);
        profilePictureUrl = photoRes.profilePicture;
      } else if (avatarChanged && profile.avatarUri) {
        profilePictureUrl = profile.avatarUri;
      }

      const payload: {
        name?: string;
        email?: string;
        phoneNumber?: string;
      } = {
        name: trimmedName,
        email: trimmedEmail,
      };
      if (phoneChanged) {
        payload.phoneNumber = formatPhoneForBackend(phoneDigits);
      }

      const res = await updateRider(riderId, payload);
      const rider = res.rider;

      const displayPhone = normalizePhoneDigits(rider.phoneNumber || phoneDigits);
      const savedPhoto = rider.profilePicture ?? profilePictureUrl ?? null;

      updateUserData({
        name: rider.name ?? trimmedName,
        phoneNumber: displayPhone,
        email: rider.email ?? trimmedEmail,
        profilePhotoUri: savedPhoto,
      });

      queryClient.setQueryData(['rider', 'profile', riderId], rider);

      router.push({
        pathname: '/profile-update-success',
        params: {
          fullName: rider.name ?? trimmedName,
          phoneNumber: displayPhone,
          email: rider.email ?? trimmedEmail,
          avatarUri: savedPhoto || '',
        },
      } as any);

      void queryClient.invalidateQueries({ queryKey: ['rider', 'profile', riderId] });
      void getMe()
        .then((me) => {
          if (me.profile) {
            updateUserData({
              name: me.profile.name ?? trimmedName,
              phoneNumber: normalizePhoneDigits(me.profile.phoneNumber || displayPhone),
              email: me.profile.email ?? trimmedEmail,
              profilePhotoUri: me.profile.profilePicture ?? savedPhoto,
            });
          }
        })
        .catch(() => {});
    } catch (e) {
      const apiFields = parseProfileValidationFromApi(
        (e as Error & { apiBody?: unknown })?.apiBody
      );
      if (Object.keys(apiFields).length > 0) {
        setErrors((prev) => ({ ...prev, ...apiFields }));
      }
      setSubmitError(
        apiFields.submit ??
          (e instanceof Error ? e.message : 'Could not save profile. Please try again.')
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    validate,
    hasChanges,
    profile,
    router,
    queryClient,
    storedPhoneDigits,
    updateUserData,
    userData.riderId,
    userData.profilePhotoUri,
  ]);

  const isButtonDisabled = !hasChanges() || isSaving;

  return (
    <ProfileScreenShell
      title="Edit Profile"
      subtitle="Update your profile information"
      onBack={() => router.back()}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={editProfileStyles.keyboardView}
      >
        <ScrollView
          style={editProfileStyles.scrollView}
          contentContainerStyle={editProfileStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Photo Section */}
          <View style={editProfileStyles.photoSection}>
            <View style={editProfileStyles.photoContainer}>
              {profile.avatarUri ? (
                <Image
                  source={{ uri: profile.avatarUri }}
                  style={editProfileStyles.profileImage}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={editProfileStyles.photoPlaceholder}>
                  <UserIcon size={scale(42)} color="#237227" />
                </View>
              )}
            </View>
            <TouchableOpacity
              style={editProfileStyles.uploadButton}
              onPress={handleUploadPhoto}
              activeOpacity={0.8}
            >
              <Text variant="bodySm" style={editProfileStyles.uploadButtonText}>
                Upload Photo
              </Text>
            </TouchableOpacity>
            <Text variant="bodySm" color="#6A7282" style={editProfileStyles.photoLabel}>
              Change Profile Photo
            </Text>
          </View>

          {/* Form Fields */}
          <View style={editProfileStyles.formContainer}>
            {submitError ? (
              <View style={editProfileStyles.submitErrorBanner}>
                <Text variant="bodySm" style={editProfileStyles.submitErrorText}>
                  {submitError}
                </Text>
              </View>
            ) : null}

            <LabeledInput
              label="Full Name"
              value={profile.fullName}
              placeholder="Enter your full name"
              onChangeText={(text) => {
                setProfile((prev) => ({ ...prev, fullName: text }));
                if (errors.fullName) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.fullName;
                    return next;
                  });
                }
                setSubmitError(null);
              }}
              LeftIcon={<UserIcon size={scale(17.5)} color="#6B7280" />}
              error={errors.fullName}
              autoCapitalize="words"
              maxLength={100}
            />

            <LabeledInput
              label="Phone Number"
              value={profile.phoneNumber}
              placeholder="10-digit mobile number"
              onChangeText={(text) => {
                const digits = sanitizePhoneDigits(text);
                setProfile((prev) => ({ ...prev, phoneNumber: digits }));
                if (errors.phoneNumber) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.phoneNumber;
                    return next;
                  });
                }
                setSubmitError(null);
              }}
              LeftIcon={<PhoneIcon size={scale(17.5)} color="#6B7280" />}
              error={errors.phoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <LabeledInput
              label="Email Address"
              value={profile.email}
              placeholder="Enter your email"
              onChangeText={(text) => {
                setProfile((prev) => ({ ...prev, email: text }));
                if (errors.email) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.email;
                    return next;
                  });
                }
                setSubmitError(null);
              }}
              LeftIcon={<EmailIcon size={scale(17.5)} color="#6B7280" />}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={254}
            />

            {/* Save Button */}
            <TouchableOpacity
              style={[
                editProfileStyles.saveButton,
                isButtonDisabled && editProfileStyles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isButtonDisabled}
              activeOpacity={0.8}
            >
              <CheckmarkSmallIcon size={scale(14)} color="#FFFFFF" />
              <Text variant="h3" style={editProfileStyles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ProfileScreenShell>
  );
}

