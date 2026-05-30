/**
 * My Documents Screen Component
 * Shows all rider documents with status overview (from KYC API)
 */

import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentCard from '../components/DocumentCard';
import Text from '../components/common/Text';
import Header from '../components/layout/Header';
import { useUser } from '../contexts';
import documentsStyles from '../styles/documentsStyles';
import { getDocumentCounts, RiderDocument } from '../types/documents';
import { scale, verticalScale } from '../utils/responsive';
import { getDocumentTypes, getKycStatus, type KycStatusItem } from '../api/kyc';

const DOC_TYPE_TO_ROUTE: Record<string, string> = {
  aadhar: '/aadhar-upload',
  pan: '/pan-upload',
  drivingLicense: '/driving-license-upload',
  driving_license: '/driving-license-upload',
  vehicleRc: '/vehicle-rc-upload',
  vehicle_rc: '/vehicle-rc-upload',
  vehicleInsurance: '/vehicle-insurance-upload',
  vehicle_insurance: '/vehicle-insurance-upload',
};

function mapKycStatusToRiderStatus(s: KycStatusItem['status']): RiderDocument['status'] {
  if (s === 'verified') return 'verified';
  if (s === 'failed') return 'expired';
  return 'pending';
}

function kycItemToRiderDocument(item: KycStatusItem): RiderDocument {
  const date = item.verifiedAt || item.uploadedAt;
  const updatedOn = date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';
  return {
    id: item.documentTypeCode,
    name: item.label,
    status: mapKycStatusToRiderStatus(item.status),
    updatedOn,
    fileName: `${item.documentTypeCode}.pdf`,
  };
}

export default function MyDocumentsScreen() {
  const router = useRouter();
  const { userData } = useUser();

  const { data: kycRes, isLoading } = useQuery({
    queryKey: ['kyc', 'status'],
    queryFn: getKycStatus,
    staleTime: 30 * 1000,
  });

  const { data: typesRes } = useQuery({
    queryKey: ['kyc', 'document-types'],
    queryFn: getDocumentTypes,
    staleTime: 5 * 60 * 1000,
  });

  const documents = useMemo(() => {
    if (kycRes?.documents?.length) {
      return kycRes.documents.map(kycItemToRiderDocument);
    }
    if (typesRes?.documentTypes?.length) {
      return typesRes.documentTypes.map((t) => ({
        id: t.code,
        name: t.label,
        status: 'pending' as const,
        updatedOn: '—',
        fileName: `${t.code}.pdf`,
      }));
    }
    return [];
  }, [kycRes?.documents, typesRes?.documentTypes]);

  const counts = useMemo(() => getDocumentCounts(documents), [documents]);
  const totalDocs = documents.length || 1;
  const completionPercentage = (counts.verified / totalDocs) * 100;

  const handleDocumentPress = useCallback(
    (documentId: string, status: string, documentName: string) => {
      const code = documentId.toLowerCase();
      const route = DOC_TYPE_TO_ROUTE[documentId] ?? DOC_TYPE_TO_ROUTE[code];
      if (route) {
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
        const item = kycRes?.documents?.find((d) => d.documentTypeCode === documentId);
        router.push({
          pathname: '/document-view',
          params: {
            documentName: documentName,
            documentId: documentId,
            documentUri: item?.fileUrl ?? userData.aadharUri ?? '',
            documentNumber: '',
            uploadRoute: DOC_TYPE_TO_ROUTE[documentId] ?? '/kyc-upload',
          },
        } as any);
        return;
      }
      router.push(`/document-status?status=${status}&documentId=${documentId}` as any);
    },
    [router, kycRes?.documents, userData]
  );

  if (isLoading && documents.length === 0) {
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
          <View style={documentsStyles.statusCounts}>
            <View style={documentsStyles.statusCountItem}>
              <Text variant="body" style={documentsStyles.statusCountText}>
                {counts.verified} Verified
              </Text>
            </View>
            <View style={documentsStyles.statusCountItem}>
              <Text variant="body" style={documentsStyles.statusCountText}>
                {counts.pending} Pending
              </Text>
            </View>
            <View style={documentsStyles.statusCountItem}>
              <Text variant="body" style={documentsStyles.statusCountText}>
                {counts.expired} Expired
              </Text>
            </View>
          </View>
          <View style={documentsStyles.progressBarContainer}>
            <View style={[documentsStyles.progressBarFill, { width: `${completionPercentage}%` }]} />
          </View>
        </View>
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
