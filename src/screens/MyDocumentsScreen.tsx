/**
 * My Documents — KYC status from backend (dynamic counts, no hardcoded totals)
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentCard from '../components/DocumentCard';
import Text from '../components/common/Text';
import Header from '../components/layout/Header';
import { useUser } from '../contexts';
import { useKycDocumentSummary } from '../hooks/useKycDocumentSummary';
import documentsStyles from '../styles/documentsStyles';
import { scale, verticalScale } from '../utils/responsive';

const DOC_TYPE_TO_ROUTE: Record<string, string> = {
  aadhar: '/aadhar-upload',
  pan: '/pan-upload',
  drivingLicense: '/driving-license-upload',
  driving_license: '/driving-license-upload',
  vehicleRC: '/vehicle-rc-upload',
  vehicle_rc: '/vehicle-rc-upload',
  vehicleInsurance: '/vehicle-insurance-upload',
  vehicle_insurance: '/vehicle-insurance-upload',
};

export default function MyDocumentsScreen() {
  const router = useRouter();
  const { userData } = useUser();

  const {
    kycItems,
    documents,
    counts,
    pendingTotal,
    completionPercentage,
    isLoading,
    isRefetching,
  } = useKycDocumentSummary();

  const handleDocumentPress = useCallback(
    (documentId: string, status: string, documentName: string) => {
      const code = documentId.toLowerCase();
      const route = DOC_TYPE_TO_ROUTE[documentId] ?? DOC_TYPE_TO_ROUTE[code];
      if (route && status !== 'verified') {
        router.push({ pathname: route as any, params: { returnTo: '/my-documents' } } as any);
        return;
      }
      const docName = documentName.toLowerCase();
      if (docName.includes('vehicle rc') || (docName.includes('vehicle') && docName.includes('rc'))) {
        router.push({ pathname: '/vehicle-rc-upload' as any, params: { returnTo: '/my-documents' } } as any);
        return;
      }
      if (docName.includes('insurance')) {
        router.push({ pathname: '/vehicle-insurance-upload' as any, params: { returnTo: '/my-documents' } } as any);
        return;
      }
      if (status === 'verified') {
        const item = kycItems.find((d) => d.documentTypeCode === documentId);
        router.push({
          pathname: '/document-view',
          params: {
            documentName: documentName,
            documentId: documentId,
            documentUri: item?.fileUrl ?? userData.aadharUri ?? '',
            documentNumber: item?.documentNumber ?? '',
            uploadRoute: DOC_TYPE_TO_ROUTE[documentId] ?? '/kyc-upload',
          },
        } as any);
        return;
      }
      router.push(`/document-status?status=${status}&documentId=${documentId}` as any);
    },
    [router, kycItems, userData]
  );

  const showLoading = isLoading && documents.length === 0;

  if (showLoading) {
    return (
      <SafeAreaView style={documentsStyles.container} edges={['top', 'bottom']}>
        <Header title="My Documents" subtitle="Manage your verification documents" onBack={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#155DFC" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={documentsStyles.container} edges={['top', 'bottom']}>
      <Header title="My Documents" subtitle="Manage your verification documents" onBack={() => router.back()} />
      <ScrollView
        style={documentsStyles.scrollView}
        contentContainerStyle={documentsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[documentsStyles.statusCard, { marginHorizontal: scale(16), marginTop: verticalScale(20) }]}>
          <Text variant="bodySm" style={documentsStyles.statusCardHeadline}>
            {counts.verified} / {counts.total} documents verified
          </Text>

          <View style={documentsStyles.statusSummaryGrid}>
            <View style={documentsStyles.statusSummaryRow}>
              <Text variant="caption" style={documentsStyles.statusSummaryLabel}>
                Total documents
              </Text>
              <Text variant="bodySm" style={documentsStyles.statusSummaryValue}>
                {counts.total}
              </Text>
            </View>
            <View style={documentsStyles.statusSummaryRow}>
              <Text variant="caption" style={documentsStyles.statusSummaryLabel}>
                Verified
              </Text>
              <Text variant="bodySm" style={documentsStyles.statusSummaryValue}>
                {counts.verified}
              </Text>
            </View>
            <View style={documentsStyles.statusSummaryRow}>
              <Text variant="caption" style={documentsStyles.statusSummaryLabel}>
                Pending
              </Text>
              <Text variant="bodySm" style={documentsStyles.statusSummaryValue}>
                {pendingTotal}
              </Text>
            </View>
            {counts.rejected > 0 ? (
              <View style={documentsStyles.statusSummaryRow}>
                <Text variant="caption" style={documentsStyles.statusSummaryLabel}>
                  Rejected
                </Text>
                <Text variant="bodySm" style={documentsStyles.statusSummaryValue}>
                  {counts.rejected}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={documentsStyles.progressBarContainer}>
            <View
              style={[
                documentsStyles.progressBarFill,
                { width: `${completionPercentage}%` },
              ]}
            />
          </View>
          <Text variant="caption" style={documentsStyles.progressPercentLabel}>
            {completionPercentage}% complete
          </Text>
        </View>

        {isRefetching ? (
          <ActivityIndicator size="small" color="#237227" style={{ marginVertical: verticalScale(8) }} />
        ) : null}

        <View style={documentsStyles.documentsSection}>
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onPress={() => handleDocumentPress(doc.id, doc.status, doc.name)}
              showStatus
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
