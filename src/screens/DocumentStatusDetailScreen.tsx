/**
 * Document Status Detail — filter documents by status from KYC API
 */

import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentCard from '../components/DocumentCard';
import Text from '../components/common/Text';
import AppPressable from '../components/common/AppPressable';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import { runBackNavigation } from '../utils/safeNavigation';
import documentsStyles from '../styles/documentsStyles';
import { DocumentStatus } from '../types/documents';
import { scale } from '../utils/responsive';
import { getDocumentTypes, getKycStatus } from '../api/kyc';
import {
  buildKycDocumentList,
  kycItemToRiderDocument,
  KYC_QUERY_KEY,
} from '../utils/kycDocumentStatus';

export default function DocumentStatusDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialStatus = (params.status as DocumentStatus) || 'verified';
  const [activeStatus, setActiveStatus] = useState<DocumentStatus>(initialStatus);

  const { data: kycRes, isLoading, refetch } = useQuery({
    queryKey: KYC_QUERY_KEY,
    queryFn: getKycStatus,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { data: typesRes } = useQuery({
    queryKey: ['kyc', 'document-types'],
    queryFn: getDocumentTypes,
    staleTime: 5 * 60 * 1000,
  });

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  const allDocuments = useMemo(() => {
    const items = buildKycDocumentList(kycRes?.documents, typesRes?.documentTypes);
    return items.map(kycItemToRiderDocument);
  }, [kycRes?.documents, typesRes?.documentTypes]);

  const filteredDocuments = useMemo(
    () => allDocuments.filter((d) => d.status === activeStatus),
    [allDocuments, activeStatus]
  );

  const handleBack = useCallback(() => {
    runBackNavigation(router);
  }, [router]);

  const statusTabs: DocumentStatus[] = ['verified', 'under_review', 'pending', 'rejected'];

  const tabLabel = (s: DocumentStatus) => {
    if (s === 'under_review') return 'Under Review';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <SafeAreaView style={documentsStyles.container} edges={['top', 'bottom']}>
      <View style={documentsStyles.header}>
        <AppPressable style={documentsStyles.backButton} onPress={handleBack} accessibilityLabel="Go back">
          <BackArrowIcon size={scale(16)} color="#101828" />
        </AppPressable>
        <Text variant="h3" style={documentsStyles.headerTitle}>
          Documents
        </Text>
      </View>

      <View style={documentsStyles.tabsContainer}>
        {statusTabs.map((status) => (
          <AppPressable
            key={status}
            style={[
              documentsStyles.tab,
              activeStatus === status && documentsStyles.tabActive,
            ]}
            onPress={() => setActiveStatus(status)}
          >
            <Text
              variant="bodySm"
              style={activeStatus === status ? documentsStyles.tabTextActive : documentsStyles.tabText}
            >
              {tabLabel(status)}
            </Text>
          </AppPressable>
        ))}
      </View>

      <ScrollView
        style={documentsStyles.scrollView}
        contentContainerStyle={documentsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#155DFC" style={{ marginTop: scale(24) }} />
        ) : filteredDocuments.length === 0 ? (
          <Text variant="body" color="#6B7280" style={{ textAlign: 'center', marginTop: scale(24) }}>
            No {tabLabel(activeStatus).toLowerCase()} documents
          </Text>
        ) : (
          filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onPress={() => router.push('/my-documents' as any)} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
