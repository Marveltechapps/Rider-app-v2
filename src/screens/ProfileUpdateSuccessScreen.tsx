/**
 * Profile Update Success Screen Component
 * Shows confirmation after successful profile update
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import CheckmarkLargeWhiteIcon from '../components/icons/CheckmarkLargeWhiteIcon';
import UserIcon from '../components/icons/UserIcon';
import profileSuccessStyles from '../styles/profileSuccessStyles';
import { scale } from '../utils/responsive';

export default function ProfileUpdateSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const profile = {
    fullName: params.fullName as string,
    phoneNumber: params.phoneNumber as string,
    email: params.email as string,
    avatarUri: params.avatarUri as string,
  };

  const handleBackToProfile = useCallback(() => {
    router.push('/profile' as any);
  }, [router]);

  const handleEditAgain = useCallback(() => {
    router.back();
  }, [router]);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={profileSuccessStyles.container} edges={['top', 'bottom']}>
      <View style={profileSuccessStyles.content}>
        {/* Success Icon */}
        <View style={profileSuccessStyles.successIconContainer}>
          <CheckmarkLargeWhiteIcon size={scale(60)} color="#FFFFFF" />
        </View>

        {/* Title and Subtitle */}
        <View style={profileSuccessStyles.textContainer}>
          <Text variant="h1" color="#101828" style={profileSuccessStyles.title}>
            Profile Updated
          </Text>
          <Text variant="body" color="#6A7282" style={profileSuccessStyles.subtitle}>
            Your profile details have been saved successfully.
          </Text>
        </View>

        {/* Profile Summary Card */}
        <View style={profileSuccessStyles.summaryCard}>
          {/* Avatar */}
          {profile.avatarUri ? (
            <Image
              source={{ uri: profile.avatarUri }}
              style={profileSuccessStyles.avatar}
            />
          ) : (
            <View style={profileSuccessStyles.avatarPlaceholder}>
              <Text variant="h2" style={profileSuccessStyles.initials}>
                {getInitials(profile.fullName)}
              </Text>
            </View>
          )}

          {/* Profile Info */}
          <View style={profileSuccessStyles.profileInfo}>
            <Text variant="h3" color="#101828" style={profileSuccessStyles.name}>
              {profile.fullName}
            </Text>
            <Text variant="bodySm" color="#6A7282" style={profileSuccessStyles.email}>
              {profile.email}
            </Text>
            <Text variant="bodySm" color="#6A7282" style={profileSuccessStyles.phone}>
              {profile.phoneNumber}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={profileSuccessStyles.buttonContainer}>
          {/* Primary Button */}
          <TouchableOpacity
            style={profileSuccessStyles.primaryButton}
            onPress={handleBackToProfile}
            activeOpacity={0.8}
          >
            <Text variant="h3" style={profileSuccessStyles.primaryButtonText}>
              Back to Profile
            </Text>
          </TouchableOpacity>

          {/* Secondary Button */}
          <TouchableOpacity
            style={profileSuccessStyles.secondaryButton}
            onPress={handleEditAgain}
            activeOpacity={0.7}
          >
            <Text variant="body" style={profileSuccessStyles.secondaryButtonText}>
              Edit Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

