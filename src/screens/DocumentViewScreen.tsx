/**
 * Document View Screen Component
 * Shows uploaded document image from login flow
 * 
 * @component
 * @example
 * <DocumentViewScreen />
 */

import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import Header from '../components/layout/Header';
import { useUser } from '../contexts';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';

export default function DocumentViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userData } = useUser();
  
  const documentName = (params.documentName as string) || 'Document';
  const documentId = (params.documentId as string) || '';
  const uploadRoute = (params.uploadRoute as string) || '';
  
  // Get document data from params or userData
  let documentUri: string | null = null;
  let documentNumber: string | null = null;
  
  const docName = documentName.toLowerCase();
  if (docName.includes('aadhar')) {
    documentUri = (params.documentUri as string) || userData.aadharUri;
    documentNumber = (params.documentNumber as string) || userData.aadharNumber;
  } else if (docName.includes('pan')) {
    documentUri = (params.documentUri as string) || userData.panUri;
    documentNumber = (params.documentNumber as string) || userData.panNumber;
  } else if (docName.includes('driving license') || docName.includes('license')) {
    documentUri = (params.documentUri as string) || userData.drivingLicenseUri;
    documentNumber = (params.documentNumber as string) || userData.drivingLicenseNumber;
  }
  
  const handleChange = () => {
    if (uploadRoute) {
      router.push(uploadRoute as any);
    } else {
      // Fallback: determine route from document name
      if (docName.includes('aadhar')) {
        router.push('/aadhar-upload' as any);
      } else if (docName.includes('pan')) {
        router.push('/pan-upload' as any);
      } else if (docName.includes('driving license') || docName.includes('license')) {
        router.push('/driving-license-upload' as any);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header
        title={documentName}
        subtitle="View your uploaded document"
        onBack={() => router.back()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {documentNumber && (
            <View style={styles.infoCard}>
              <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.infoLabel}>
                Document Number
              </Text>
              <Text variant="body" color={Theme.colors.textDark} style={styles.infoValue}>
                {documentNumber}
              </Text>
            </View>
          )}
          
          {documentUri ? (
            <View style={styles.documentImageContainer}>
              <Image
                source={{ uri: documentUri }}
                style={styles.documentImage}
                contentFit="contain"
                transition={200}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text variant="body" color={Theme.colors.textGrey} style={styles.emptyText}>
                No document image available
              </Text>
            </View>
          )}
          
          {/* Change Button */}
          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleChange}
            activeOpacity={0.8}
          >
            <Text variant="h3" style={styles.changeButtonText}>
              Change
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: verticalScale(20),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(40),
  },
  content: {
    width: '100%',
    gap: verticalScale(16),
  },
  infoCard: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: Theme.colors.white,
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
  },
  infoLabel: {
    fontSize: scale(12),
    lineHeight: scale(18),
    marginBottom: verticalScale(4),
  },
  infoValue: {
    fontSize: scale(16),
    lineHeight: scale(24),
    fontWeight: '600',
  },
  documentImageContainer: {
    width: '100%',
    minHeight: scale(400),
    backgroundColor: Theme.colors.white,
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    overflow: 'hidden',
  },
  documentImage: {
    width: '100%',
    height: '100%',
    minHeight: scale(400),
  },
  emptyState: {
    paddingVertical: verticalScale(60),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: scale(14),
    lineHeight: scale(21),
  },
  changeButton: {
    width: '100%',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
    shadowColor: Theme.colors.primaryMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  changeButtonText: {
    fontSize: scale(15.75),
    fontWeight: '700',
    lineHeight: scale(24.5),
    color: Theme.colors.white,
    textAlign: 'center',
  },
});

