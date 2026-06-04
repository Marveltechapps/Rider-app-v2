/**
 * Profile Update Success Screen
 */

import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Text from '../components/common/Text';
import CheckmarkLargeWhiteIcon from '../components/icons/CheckmarkLargeWhiteIcon';
import ProfileScreenShell from '../components/layout/ProfileScreenShell';
import profileSuccessStyles from '../styles/profileSuccessStyles';
import { scale } from '../utils/responsive';

export default function ProfileUpdateSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const profile = {
    fullName: (params.fullName as string) || '',
    phoneNumber: (params.phoneNumber as string) || '',
    email: (params.email as string) || '',
    avatarUri: (params.avatarUri as string) || '',
  };

  const handleBackToProfile = useCallback(() => {
    router.replace('/(tabs)/profile' as any);
  }, [router]);

  const handleEditAgain = useCallback(() => {
    router.replace('/edit-profile' as any);
  }, [router]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ProfileScreenShell
      title="Profile Update Success"
      onBack={handleBackToProfile}
      reserveSubtitleSpace
    >
      <ScrollView
        style={profileSuccessStyles.scrollView}
        contentContainerStyle={profileSuccessStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={profileSuccessStyles.successIconContainer}>
          <CheckmarkLargeWhiteIcon size={scale(56)} color="#FFFFFF" />
        </View>

        <View style={profileSuccessStyles.textContainer}>
          <Text variant="bodySm" color="#6A7282" style={profileSuccessStyles.subtitle}>
            Your profile details have been saved successfully.
          </Text>
        </View>

        <View style={profileSuccessStyles.summaryCard}>
          {profile.avatarUri ? (
            <Image
              source={{ uri: profile.avatarUri }}
              style={profileSuccessStyles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={profileSuccessStyles.avatarPlaceholder}>
              <Text variant="h2" style={profileSuccessStyles.initials}>
                {getInitials(profile.fullName) || 'R'}
              </Text>
            </View>
          )}

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

        <View style={profileSuccessStyles.buttonContainer}>
          <TouchableOpacity
            style={profileSuccessStyles.primaryButton}
            onPress={handleBackToProfile}
            activeOpacity={0.8}
          >
            <Text variant="h3" style={profileSuccessStyles.primaryButtonText}>
              Back to Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={profileSuccessStyles.secondaryButton}
            onPress={handleEditAgain}
            activeOpacity={0.7}
          >
            <Text variant="bodySm" style={profileSuccessStyles.secondaryButtonText}>
              Edit Again
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ProfileScreenShell>
  );
}
