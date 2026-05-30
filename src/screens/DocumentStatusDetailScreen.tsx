/**
 * Document Status Detail Screen Component
 * Shows documents grouped by status with segmented control
 * Matches Figma design exactly
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentCard from '../components/DocumentCard';
import Text from '../components/common/Text';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import FileIcon from '../components/icons/FileIcon';
import documentsStyles from '../styles/documentsStyles';
import { DOCUMENTS, DocumentStatus, getDocumentsByStatus } from '../types/documents';
import { scale } from '../utils/responsive';

export default function DocumentStatusDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const initialStatus = (params.status as DocumentStatus) || 'verified';
  const [activeStatus, setActiveStatus] = useState<DocumentStatus>(initialStatus);

  // Filter documents by active status
  const filteredDocuments = useMemo(
    () => getDocumentsByStatus(DOCUMENTS, activeStatus),
    [activeStatus]
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleDocumentPress = useCallback((documentId: string) => {
    console.log('Document detail:', documentId);
    // TODO: Navigate to document detail/upload screen
  }, []);

  const handleSegmentPress = useCallback((status: DocumentStatus) => {
    setActiveStatus(status);
  }, []);

  // Get info text based on status
  const getInfoText = () => {
    switch (activeStatus) {
      case 'verified':
        return {
          title: 'Verified Documents',
          description: 'These documents have been checked and approved. You can start taking orders with verified documents.',
        };
      case 'pending':
        return {
          title: 'Pending Documents',
          description: 'These documents are submitted and waiting for review. Verification usually takes 24-48 hours.',
        };
      case 'expired':
        return {
          title: 'Expired Documents',
          description: 'These documents have expired. Please upload new documents to continue taking orders.',
        };
    }
  };

  const infoContent = getInfoText();

  return (
    <SafeAreaView style={documentsStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={documentsStyles.header}>
        <TouchableOpacity
          style={documentsStyles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <BackArrowIcon size={scale(17.5)} color="#101828" />
        </TouchableOpacity>
        <Text variant="h2" color="#101828" style={documentsStyles.headerTitle}>
          Document Details
        </Text>
        <View style={{ width: scale(42) }} />
      </View>

      {/* Segmented Control */}
      <View style={documentsStyles.segmentedControl}>
        <TouchableOpacity
          style={[
            documentsStyles.segment,
            activeStatus === 'verified' ? documentsStyles.segmentActive : documentsStyles.segmentInactive,
          ]}
          onPress={() => handleSegmentPress('verified')}
          activeOpacity={0.7}
        >
          <Text
            variant="bodySm"
            style={[
              documentsStyles.segmentText,
              activeStatus === 'verified' ? documentsStyles.segmentTextActive : documentsStyles.segmentTextInactive,
            ]}
          >
            Verified
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            documentsStyles.segment,
            activeStatus === 'pending' ? documentsStyles.segmentActive : documentsStyles.segmentInactive,
          ]}
          onPress={() => handleSegmentPress('pending')}
          activeOpacity={0.7}
        >
          <Text
            variant="bodySm"
            style={[
              documentsStyles.segmentText,
              activeStatus === 'pending' ? documentsStyles.segmentTextActive : documentsStyles.segmentTextInactive,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            documentsStyles.segment,
            activeStatus === 'expired' ? documentsStyles.segmentActive : documentsStyles.segmentInactive,
          ]}
          onPress={() => handleSegmentPress('expired')}
          activeOpacity={0.7}
        >
          <Text
            variant="bodySm"
            style={[
              documentsStyles.segmentText,
              activeStatus === 'expired' ? documentsStyles.segmentTextActive : documentsStyles.segmentTextInactive,
            ]}
          >
            Expired
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={documentsStyles.scrollView}
        contentContainerStyle={documentsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Section */}
        <View style={documentsStyles.infoSection}>
          <Text variant="body" style={documentsStyles.infoTitle}>
            {infoContent.title}
          </Text>
          <Text variant="bodySm" style={documentsStyles.infoText}>
            {infoContent.description}
          </Text>
        </View>

        {/* Documents List */}
        <View style={documentsStyles.documentsSection}>
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onPress={() => handleDocumentPress(doc.id)}
                showStatus={false}
              />
            ))
          ) : (
            <View style={documentsStyles.emptyState}>
              <FileIcon size={scale(48)} color="#D1D5DB" />
              <Text variant="body" style={documentsStyles.emptyStateText}>
                No {activeStatus} documents
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
    </SafeAreaView>
  );
}

