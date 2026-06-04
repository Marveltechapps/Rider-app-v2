/**
 * PAN Card Upload Screen Component
 * Dedicated screen for PAN card upload and verification
 * 
 * @component
 * @example
 * <PANUploadScreen />
 */

import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import DocumentPanIcon from '../components/icons/DocumentPanIcon';
import Header from '../components/layout/Header';
import { useUser } from '../contexts';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import { invalidateKycStatusCache, uploadKycDocument } from '../api/kyc';
import { useQueryClient } from '@tanstack/react-query';
import { goBackOrReplace, resolveUploadBackFallback } from '../utils/navigation/safeBack';

export default function PANUploadScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const queryClient = useQueryClient();
  const { userData, updateUserData } = useUser();
  const [panNumber, setPanNumber] = useState(userData.panNumber || '');
  const [documentUri, setDocumentUri] = useState<string | null>(userData.panUri);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const validatePAN = (id: string): boolean => {
    // PAN: 10 characters, format: AAAAA9999A (5 letters, 4 digits, 1 letter)
    return /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(id.toUpperCase());
  };

  const handleBack = () => {
    goBackOrReplace(router, resolveUploadBackFallback(returnTo));
  };

  const handlePanNumberChange = (text: string) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPanNumber(cleaned);
    if (error) setError('');
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
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const handleContinue = async () => {
    if (!panNumber && !documentUri) {
      setError('Please enter PAN number or scan the document');
      return;
    }
    if (panNumber && !validatePAN(panNumber)) {
      setError('PAN must be 10 characters (e.g., ABCDE1234F)');
      return;
    }

    updateUserData({
      panUri: documentUri,
      panNumber: panNumber || null,
    });

    if (documentUri) {
      setUploading(true);
      setError('');
      try {
        const result = await uploadKycDocument(documentUri, 'pan', 'pan.jpg', 'image/jpeg', panNumber);
        await invalidateKycStatusCache(queryClient);
        const uploadedLink = (result && (result.uploadedLink || (result as any).uploadedLink)) ?? undefined;
        if (returnTo === '/my-documents') {
          router.replace('/my-documents' as any);
        } else {
          router.replace({ pathname: '/kyc-upload', params: { updatedDoc: 'pan', uploadedLink } });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
      return;
    }

    router.replace({ pathname: '/kyc-upload', params: { panStatus: 'pending' } });
  };

  const isContinueEnabled = !uploading && ((panNumber.length === 10 && validatePAN(panNumber)) || documentUri !== null);

  React.useEffect(() => {
    (async () => {
      const { setStoredOnboardingStep } = await import('@/api/storage');
      await setStoredOnboardingStep('/pan-upload');
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        <Header
          title="PAN Card"
          subtitle="Enter your PAN details or scan the card"
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
                  <DocumentPanIcon size={scale(80)} color="#E5E7EB" />
                  <Text style={styles.placeholderText}>No document uploaded</Text>
                </View>
              )}
            </View>

            {/* PAN Number Input Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PAN Number</Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Enter PAN number (e.g., ABCDE1234F)"
                  placeholderTextColor="#717182"
                  value={panNumber}
                  onChangeText={handlePanNumberChange}
                  autoCapitalize="characters"
                  maxLength={10}
                />
              </View>
              
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              <Text style={styles.helperText}>
                Enter your 10-character PAN number as printed on the card
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Scan Document Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scan Document</Text>
              <Text style={styles.sectionDescription}>
                Upload a clear photo of your PAN card
              </Text>

              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScanDocument}
                activeOpacity={0.7}
              >
                <Text style={styles.scanButtonText}>
                  {documentUri ? 'Change Document' : 'Scan PAN Card'}
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
  inputContainer: {
    width: '100%',
    height: scale(56),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    fontSize: 16,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.borderGrey,
  },
  dividerText: {
    fontSize: scale(12),
    color: Theme.colors.textGrey,
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

