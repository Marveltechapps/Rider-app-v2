/**
 * Profile Photo Screen Component
 * Selfie capture screen matching Figma design
 * 
 * @component
 * @example
 * <ProfilePhotoScreen />
 */

import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import CameraShutterIcon from '../components/icons/CameraShutterIcon';
import ProfilePlaceholderIcon from '../components/icons/ProfilePlaceholderIcon';
import RetakePhotoIcon from '../components/icons/RetakePhotoIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import { uploadProfilePhoto } from '../api/auth';
import { useUser } from '../contexts/UserContext';

export default function ProfilePhotoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateUserData } = useUser();
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    (async () => {
      const { setStoredOnboardingStep } = await import('@/api/storage');
      await setStoredOnboardingStep('/profile-photo');
    })();
  }, []);

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleTakeSelfie = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        if (isMountedRef.current) {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to take a selfie.',
            [{ text: 'OK' }]
          );
        }
        return;
      }

      // Check if component is still mounted before launching camera
      if (!isMountedRef.current) {
        return;
      }

      // Launch camera with error handling
      // Note: This opens the native camera app
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4], // Portrait aspect ratio for selfie
        quality: 0.8,
      });

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) {
        return;
      }

      // Update state with the captured photo
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        // Set the photo URI - this will trigger the UI to show "Great Photo!" state
        setSelfieUri(photoUri);
        console.log('Photo captured successfully:', photoUri);
      } else {
        console.log('Camera was canceled or no photo selected');
      }
    } catch (error: any) {
      // Handle specific error cases silently
      const errorMessage = error?.message || String(error) || '';
      const errorString = typeof error === 'string' ? error : '';
      const fullErrorText = `${errorMessage} ${errorString}`.toLowerCase();
      
      const isActivityUnavailable = 
        fullErrorText.includes('activity is no longer available') ||
        fullErrorText.includes('rejected') ||
        fullErrorText.includes('no longer available');
      
      if (isActivityUnavailable) {
        // Activity was destroyed - this can happen if user navigates away
        // Fail silently, don't automatically fallback
        return;
      }
      
      const isSimulator = fullErrorText.includes('camera not available on simulator') || 
                         fullErrorText.includes('simulator');

      // Only show alert if component is still mounted and it's not an activity error
      if (isMountedRef.current) {
        if (isSimulator) {
          // On simulator, automatically fallback to gallery after a brief delay
          // to ensure the camera activity closure doesn't interfere
          setTimeout(() => {
            handleSelectFromGallery();
          }, 500);
          return;
        }
        
        // Log other unexpected errors for debugging
        console.error('Error taking selfie:', error);

        Alert.alert(
          'Camera Error', 
          'Failed to open camera. Would you like to select from gallery instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Select from Gallery', onPress: handleSelectFromGallery },
          ]
        );
      }
    }
  };

  const handleRetakePhoto = () => {
    setSelfieUri(null);
    handleTakeSelfie();
  };

  const handleSelectFromGallery = async () => {
    // Early return if component is not mounted
    if (!isMountedRef.current) {
      return;
    }

    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        if (isMountedRef.current) {
          Alert.alert(
            'Permission Required',
            'Media library permission is required to select a photo.',
            [{ text: 'OK' }]
          );
        }
        return;
      }

      // Check if component is still mounted after permission request
      if (!isMountedRef.current) {
        return;
      }

      // Launch image picker - no delay needed, just ensure we're mounted
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) {
        return;
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelfieUri(result.assets[0].uri);
      }
    } catch (error: any) {
      // Handle specific error cases silently
      const errorMessage = error?.message || String(error) || '';
      const errorString = typeof error === 'string' ? error : '';
      const fullErrorText = `${errorMessage} ${errorString}`.toLowerCase();
      
      const isUninitialized = 
        fullErrorText.includes('uninitialized') ||
        fullErrorText.includes('has not been initialized') ||
        fullErrorText.includes('imageLibraryLauncher') ||
        fullErrorText.includes('rejected');
      
      if (isUninitialized) {
        // Native module not ready or component unmounting - fail silently
        // Don't log or show error for this common scenario
        return;
      }
      
      // Log other errors for debugging only if component is still mounted
      if (isMountedRef.current) {
        console.error('Error selecting from gallery:', error);
        Alert.alert('Error', 'Failed to select photo. Please try again.');
      }
    }
  };

  const handleSavePhoto = async () => {
    if (!selfieUri) return;

    setIsSaving(true);
    
    try {
      // Upload selfie to backend (S3 + MongoDB)
      const uploadResult = await uploadProfilePhoto(selfieUri);
      
      if (uploadResult.success) {
        // Update local context
        updateUserData({
          profilePhotoUri: uploadResult.profilePicture,
        });

        // Navigate to Personal Details screen
        const vehicleType = (params.vehicleType as string) || '';
        const vehicleNumber = (params.vehicleNumber as string | null) || null;
        
        // Check if still mounted before navigating
        if (!isMountedRef.current) {
          return;
        }
        
        // Use replace to prevent going back to this screen
        router.replace({
          pathname: '/personal-details',
          params: {
            ...(vehicleType && { vehicleType }),
            ...(vehicleNumber && { vehicleNumber }),
            selfieUri: uploadResult.profilePicture,
          },
        } as any);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('[ProfilePhotoScreen] Error saving photo:', error);
      if (isMountedRef.current) {
        Alert.alert('Error', 'Failed to save photo. Please try again.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  };

  const isSaveEnabled = selfieUri !== null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <Header
          title="Profile Photo"
          subtitle="Take a clear selfie for your profile"
          onBack={handleBack}
        />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Selfie Card */}
            <View
              testID="selfie-card"
              style={[
                styles.selfieCard,
                selfieUri && styles.selfieCardWithPhoto,
              ]}
            >
              {selfieUri ? (
                <Image
                  source={{ uri: selfieUri }}
                  style={styles.selfieImage}
                  resizeMode="cover"
                />
              ) : (
                <TouchableOpacity
                  style={styles.selfieCardTouchable}
                  onPress={handleTakeSelfie}
                  onLongPress={handleSelectFromGallery}
                  activeOpacity={0.9}
                >
                  <View style={styles.selfiePlaceholder}>
                  <ProfilePlaceholderIcon
                    size={scale(112)}
                    color={Theme.colors.white}
                  />
                  </View>
                  
                  {/* Oval Frame - Only show when no photo */}
                  <View style={styles.ovalFrame} />
                  
                  {/* Shutter Button - Only show when no photo */}
                  <TouchableOpacity
                    testID="shutter-button"
                    accessibilityLabel="Camera shutter button"
                    style={styles.shutterButton}
                    onPress={handleTakeSelfie}
                    activeOpacity={0.8}
                  >
                    <CameraShutterIcon size={scale(56)} />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            </View>

            {/* Instructions Text - Changes based on photo state */}
            {selfieUri ? (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>Great Photo!</Text>
                <Text style={styles.instructionsDescription}>
                  Your photo looks clear and good to go.
                </Text>
                <TouchableOpacity
                  testID="retake-photo-button"
                  accessibilityLabel="Retake photo button"
                  style={styles.retakeButton}
                  onPress={handleRetakePhoto}
                  activeOpacity={0.7}
                >
                  <RetakePhotoIcon size={scale(14)} color={Theme.colors.primaryMedium} />
                  <Text style={styles.retakeButtonText}>Retake Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>Take a Selfie</Text>
                <Text style={styles.instructionsDescription}>
                  Make sure your face is clearly visible and you are not wearing sunglasses or a hat.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            testID="save-photo-button"
            accessibilityLabel="Save photo button"
            style={[
              styles.saveButton,
              !isSaveEnabled && styles.saveButtonDisabled,
            ]}
            onPress={handleSavePhoto}
            disabled={!isSaveEnabled || isSaving}
            activeOpacity={0.7}
          >
            <Text
              variant="loginButton"
              color={!isSaveEnabled ? Theme.colors.textLight : Theme.colors.white}
              style={styles.saveButtonText}
            >
              {isSaving ? <ActivityIndicator color={Theme.colors.white} /> : 'Save Photo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight, // Exact Figma background
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(21),
    paddingBottom: verticalScale(21),
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: scale(23.58), // Position card at y: 112.08 - 88.5 (header) = 23.58
  },
  selfieCard: {
    width: scale(280), // Exact Figma width
    height: scale(373.33), // Exact Figma height
    backgroundColor: Theme.colors.textDark, // Exact Figma dark navy
    borderRadius: scale(21), // Exact Figma border radius
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    // Shadow: 0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  selfieCardWithPhoto: {
    backgroundColor: Theme.colors.gray200, // Exact Figma grey background when photo is present
  },
  selfieCardTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selfiePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  selfieImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(21),
  },
  ovalFrame: {
    position: 'absolute',
    width: scale(224), // Exact Figma frame width
    height: scale(317.33), // Exact Figma frame height
    borderRadius: scale(112), // Make it oval
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)', // slightly higher contrast for visibility
    top: scale(28), // Positioned at y: 28
    left: scale(28), // Positioned at x: 28
  },
  shutterButton: {
    position: 'absolute',
    bottom: scale(21), // Positioned at bottom: 373.33 - 56 - 21 = 296.33
    alignSelf: 'center',
    width: scale(56), // Exact Figma size
    height: scale(56), // Exact Figma size
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    width: scale(211.88), // Exact Figma width
    marginTop: scale(28), // Gap from card bottom: card ends at 23.58 + 373.33 = 396.91, instructions start at 424.91, gap = 28
    gap: scale(14), // Exact Figma gap between title and description
    alignItems: 'center',
    alignSelf: 'center', // Center the instructions container
  },
  instructionsTitle: {
    fontSize: scale(15.75), // Exact Figma fontSize
    lineHeight: scale(24.5), // 15.75 * 1.5555555555555556
    color: Theme.colors.textDark, // Exact Figma color
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
  },
  instructionsDescription: {
    fontSize: scale(12.25), // Exact Figma fontSize
    lineHeight: scale(17.5), // 12.25 * 1.4285714285714286
    color: Theme.colors.textGrey, // Exact Figma color
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '400',
    textAlign: 'center',
    width: '100%',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6), // Gap between icon and text (20 - 14 = 6px for icon to text)
    marginTop: scale(14), // Exact Figma gap: 70 - 38.5 - 17.5 = 14px
    width: scale(108.95), // Exact Figma width
    height: scale(35), // Exact Figma height
    alignSelf: 'center', // Center the button within container
  },
  retakeButtonText: {
    fontSize: scale(14), // Exact Figma fontSize
    lineHeight: scale(21), // 14 * 1.5
    color: Theme.colors.primaryMedium, // Exact Figma green
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomSection: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.gray100,
    paddingHorizontal: scale(21),
    paddingTop: verticalScale(22),
    paddingBottom: verticalScale(21),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  saveButton: {
    height: scale(42),
    backgroundColor: Theme.colors.primaryMedium, // Exact Figma green when enabled
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.buttonPrimary,
  },
  saveButtonDisabled: {
    backgroundColor: Theme.colors.gray200, // Exact Figma disabled color
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5), // 15.75 * 1.5555555555555556
    fontWeight: '700',
    textAlign: 'center',
  },
});

