/**
 * Vehicle Insurance Upload Screen Component
 * Dedicated screen for Vehicle Insurance document upload
 * 
 * @component
 * @example
 * <VehicleInsuranceUploadScreen />
 */

import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import VehicleIcon from '../components/icons/VehicleIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import { invalidateKycStatusCache, uploadKycDocument } from '../api/kyc';
import { useQueryClient } from '@tanstack/react-query';
import { goBackOrReplace, resolveUploadBackFallback } from '../utils/navigation/safeBack';

export default function VehicleInsuranceUploadScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const queryClient = useQueryClient();
  const [documentUri, setDocumentUri] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleBack = () => {
    goBackOrReplace(router, resolveUploadBackFallback(returnTo));
  };

  const handleScanDocument = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Media library permission is required to upload documents.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDocumentUri(result.assets[0].uri);
        if (error) setError('');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const handleContinue = async () => {
    if (!documentUri) {
      setError('Please upload Vehicle Insurance document');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const result = await uploadKycDocument(documentUri, 'vehicleInsurance', 'vehicle-insurance.jpg');
      await invalidateKycStatusCache(queryClient);
      const uploadedLink = (result && (result.uploadedLink || (result as any).uploadedLink)) ?? undefined;
      if (returnTo === '/my-documents') {
        router.replace('/my-documents' as any);
      } else {
        router.replace({ pathname: '/kyc-upload', params: { updatedDoc: 'vehicleInsurance', uploadedLink } });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const isContinueEnabled = documentUri !== null && !uploading;

  React.useEffect(() => {
    (async () => {
      const { setStoredOnboardingStep } = await import('@/api/storage');
      await setStoredOnboardingStep('/vehicle-insurance-upload');
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        <Header
          title="Vehicle Insurance"
          subtitle="Upload your Vehicle Insurance document"
          onBack={handleBack}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Document Icon/Preview */}
            <View style={styles.documentPreviewCard}>
              {documentUri ? (
                <Image
                  source={{ uri: documentUri }}
                  style={styles.documentImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.documentPlaceholder}>
                  <VehicleIcon size={scale(80)} color="#E5E7EB" />
                  <Text style={styles.placeholderText}>No document uploaded</Text>
                </View>
              )}
            </View>

            {/* Upload Document Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upload Document</Text>
              <Text style={styles.sectionDescription}>
                Upload a clear photo of your Vehicle Insurance document
              </Text>

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScanDocument}
                activeOpacity={0.7}
              >
                <Text style={styles.scanButtonText}>
                  {documentUri ? 'Change Document' : 'Upload Vehicle Insurance'}
                </Text>
              </TouchableOpacity>
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
          </TouchableOpacity>
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
  documentPreviewCard: {
    width: '100%',
    height: scale(200),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentImage: {
    width: '100%',
    height: '100%',
  },
  documentPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(12),
  },
  placeholderText: {
    fontSize: scale(14),
    color: Theme.colors.textLight,
    fontFamily: Theme.typography.body.fontFamily,
  },
  section: {
    width: '100%',
    gap: scale(12),
  },
  sectionTitle: {
    fontSize: scale(14),
    lineHeight: scale(21),
    color: Theme.colors.textDark,
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '700',
  },
  sectionDescription: {
    fontSize: scale(12),
    lineHeight: scale(18),
    color: Theme.colors.textGrey,
    fontFamily: Theme.typography.body.fontFamily,
  },
  errorText: {
    fontSize: scale(12),
    lineHeight: scale(18),
    color: '#FB2C36',
    fontFamily: Theme.typography.body.fontFamily,
  },
  scanButton: {
    width: '100%',
    height: scale(49),
    backgroundColor: Theme.colors.textDark,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: scale(14),
    lineHeight: scale(21),
    color: Theme.colors.white,
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '600',
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

