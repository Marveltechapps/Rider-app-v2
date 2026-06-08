/**
 * KYC Upload Screen Component
 * Document upload overview screen with status cards (backend-driven document types and status)
 */

import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import CircleInfoIcon from '../components/icons/CircleInfoIcon';
import DocumentAadharIcon from '../components/icons/DocumentAadharIcon';
import DocumentDrivingIcon from '../components/icons/DocumentDrivingIcon';
import DocumentPanIcon from '../components/icons/DocumentPanIcon';
import VehicleIcon from '../components/icons/VehicleIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { scale, verticalScale } from '../utils/responsive';
import { getDocumentTypes, getKycStatus, type KycStatusItem } from '../api/kyc';
import { goBackOrReplace } from '../utils/navigation/safeBack';

type DocumentStatus = 'not_started' | 'pending' | 'verified' | 'failed';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  aadhar: DocumentAadharIcon,
  pan: DocumentPanIcon,
  drivingLicense: DocumentDrivingIcon,
  vehicleRC: VehicleIcon,
  vehicleInsurance: VehicleIcon,
};

const FALLBACK_DOCUMENTS: KycStatusItem[] = [
  { documentTypeCode: 'aadhar', label: 'Aadhar Card', iconKey: 'aadhar', required: true, status: 'not_started' },
  { documentTypeCode: 'pan', label: 'PAN Card', iconKey: 'pan', required: true, status: 'not_started' },
  { documentTypeCode: 'drivingLicense', label: 'Driving License', iconKey: 'drivingLicense', required: true, status: 'not_started' },
  { documentTypeCode: 'vehicleRC', label: 'Vehicle RC', iconKey: 'vehicleRC', required: false, status: 'not_started' },
  { documentTypeCode: 'vehicleInsurance', label: 'Vehicle Insurance', iconKey: 'vehicleInsurance', required: false, status: 'not_started' },
];

const ROUTES: Record<string, string> = {
  aadhar: '/aadhar-upload',
  pan: '/pan-upload',
  drivingLicense: '/driving-license-upload',
  vehicleRC: '/vehicle-rc-upload',
  vehicleInsurance: '/vehicle-insurance-upload',
};

const STATUS_PRIORITY: Record<DocumentStatus, number> = {
  not_started: 0,
  pending: 2,
  failed: 2,
  verified: 4,
};

function pickHigherStatusDoc(a: KycStatusItem, b: KycStatusItem): KycStatusItem {
  const pa = STATUS_PRIORITY[a.status as DocumentStatus] ?? 0;
  const pb = STATUS_PRIORITY[b.status as DocumentStatus] ?? 0;
  const winner = pb > pa ? b : pa > pb ? a : b;
  const loser = winner === b ? a : b;
  return {
    ...winner,
    fileUrl: winner.fileUrl ?? loser.fileUrl,
    rejectedReason: winner.rejectedReason ?? loser.rejectedReason,
    documentNumber: winner.documentNumber ?? loser.documentNumber,
  };
}

/** Keep pending/verified from prior screen state when refetch returns stale or partial data. */
function mergeKycDocuments(existing: KycStatusItem[], incoming: KycStatusItem[]): KycStatusItem[] {
  const byCode = new Map<string, KycStatusItem>();
  for (const d of existing) byCode.set(d.documentTypeCode, d);
  for (const d of incoming) {
    const prev = byCode.get(d.documentTypeCode);
    byCode.set(d.documentTypeCode, prev ? pickHigherStatusDoc(prev, d) : d);
  }
  const order = incoming.length
    ? incoming.map((d) => d.documentTypeCode)
    : existing.map((d) => d.documentTypeCode);
  const seen = new Set<string>();
  const result: KycStatusItem[] = [];
  for (const code of order) {
    const doc = byCode.get(code);
    if (doc) {
      result.push(doc);
      seen.add(code);
    }
  }
  for (const [code, doc] of byCode) {
    if (!seen.has(code)) result.push(doc);
  }
  return result;
}

function applyOptimisticPending(list: KycStatusItem[], documentTypeCode: string, uploadedLink?: string): KycStatusItem[] {
  return list.map((d) =>
    d.documentTypeCode === documentTypeCode
      ? { ...d, status: 'pending' as const, fileUrl: uploadedLink ?? d.fileUrl }
      : d
  );
}

function finalizeDocumentList(
  prev: KycStatusItem[],
  incoming: KycStatusItem[] | null,
  optimisticDoc?: string,
  uploadedLink?: string
): KycStatusItem[] {
  const baseline = prev.length ? prev : FALLBACK_DOCUMENTS;
  let list = incoming?.length ? mergeKycDocuments(baseline, incoming) : baseline;
  if (optimisticDoc) list = applyOptimisticPending(list, optimisticDoc, uploadedLink);
  return list;
}

export default function KYCUploadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ updatedDoc?: string; uploadedLink?: string }>();
  const [documents, setDocuments] = useState<KycStatusItem[]>(FALLBACK_DOCUMENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKycData = useCallback(async (optimisticDoc?: string, uploadedLink?: string) => {
    setError(null);
    try {
      const typesRes = await getDocumentTypes().catch(() => null);
      const statusRes = await getKycStatus().catch(() => null);

      let incoming: KycStatusItem[] | null = null;
      if (statusRes?.documents?.length) {
        incoming = statusRes.documents;
      } else if (typesRes?.documentTypes?.length) {
        incoming = typesRes.documentTypes.map((t) => ({
          documentTypeCode: t.code,
          label: t.label,
          iconKey: t.iconKey,
          required: t.required,
          status:
            (statusRes?.documents?.find((d) => d.documentTypeCode === t.code)?.status as DocumentStatus) ??
            'not_started',
          rejectedReason: statusRes?.documents?.find((d) => d.documentTypeCode === t.code)?.rejectedReason,
        }));
      }

      setDocuments((prev) => finalizeDocumentList(prev, incoming, optimisticDoc, uploadedLink));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setDocuments((prev) => finalizeDocumentList(prev, null, optimisticDoc, uploadedLink));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchKycData(params.updatedDoc, params.uploadedLink);
    }, [fetchKycData, params.updatedDoc, params.uploadedLink])
  );

  // Persist current onboarding step so we can resume here if user leaves
  React.useEffect(() => {
    (async () => {
      const { setStoredOnboardingStep } = await import('@/api/storage');
      await setStoredOnboardingStep('/kyc-upload');
    })();
  }, []);

  const handleBack = () => {
    goBackOrReplace(router, '/personal-details');
  };

  const handleDocumentPress = (documentTypeCode: string) => {
    const route = ROUTES[documentTypeCode] ?? '/kyc-upload';
    router.push({ pathname: route as any, params: { returnTo: '/kyc-upload' } } as any);
  };

  const handleUploadAgain = (documentTypeCode: string) => {
    handleDocumentPress(documentTypeCode);
  };

  const handleContinue = () => {
    const allRequiredUploaded = documents.every((doc) => !doc.required || ['verified', 'pending'].includes(doc.status));
    if (!allRequiredUploaded) return;
    router.push('/verification');
  };

  // Skip removed — user must upload required documents before continuing.

  const isContinueEnabled = documents.length > 0 && documents.every((doc) => !doc.required || ['verified', 'pending'].includes(doc.status));

  const getStatusColor = (status: DocumentStatus): string => {
    switch (status) {
      case 'verified':
        return 'rgba(35, 114, 39, 0.1)'; // Light green
      case 'failed':
        return 'rgba(251, 44, 54, 0.1)'; // Light red
      case 'pending':
        return '#F3F4F6'; // Light grey
      case 'not_started':
      default:
        return '#FFFFFF'; // White
    }
  };

  const getStatusBorderColor = (status: DocumentStatus): string => {
    switch (status) {
      case 'verified':
        return Theme.colors.primaryMedium;
      case 'failed':
        return '#FB2C36';
      case 'pending':
        return Theme.colors.borderGrey;
      case 'not_started':
      default:
        return Theme.colors.borderGrey;
    }
  };

  const renderDocumentCard = (doc: KycStatusItem) => {
    const IconComponent = ICON_MAP[doc.iconKey] ?? DocumentAadharIcon;
    const backgroundColor = getStatusColor(doc.status as DocumentStatus);
    const borderColor = getStatusBorderColor(doc.status as DocumentStatus);

    return (
      <TouchableOpacity
        key={doc.documentTypeCode}
        style={[styles.documentCard, { backgroundColor, borderColor }]}
        onPress={() => handleDocumentPress(doc.documentTypeCode)}
        activeOpacity={0.7}
      >
        <View style={styles.documentCardContent}>
          <View style={styles.documentIconContainer}>
            <IconComponent size={scale(42)} color={Theme.colors.textLight} />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentLabel}>{doc.label}</Text>
            {doc.required ? (
              <Text style={styles.requiredText}>* Required</Text>
            ) : (
              <Text style={styles.optionalText}>Optional</Text>
            )}
          </View>
          <View style={styles.statusContainer}>
            {doc.status === 'verified' && (
              <>
                <CheckCircleIcon size={scale(24)} color={Theme.colors.primaryMedium} />
                {doc.fileUrl ? (
                  <TouchableOpacity
                    style={styles.viewDocButton}
                    onPress={() => Linking.openURL(doc.fileUrl!)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewDocText}>View document</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}
            {doc.status === 'pending' && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            )}
            {doc.status === 'failed' && (
              <View style={styles.failedBadge}>
                <Text style={styles.failedText}>Failed</Text>
              </View>
            )}
            {doc.status === 'not_started' && (
              <View style={styles.startBadge}>
                <Text style={styles.startText}>Start</Text>
              </View>
            )}
          </View>
        </View>
        {doc.status === 'failed' && (
          <View style={styles.failedSection}>
            {doc.rejectedReason && (
              <Text style={styles.failedMessage}>{doc.rejectedReason}</Text>
            )}
            <TouchableOpacity
              style={styles.uploadAgainButton}
              onPress={() => handleUploadAgain(doc.documentTypeCode)}
              activeOpacity={0.7}
            >
              <Text style={styles.uploadAgainText}>Upload Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        <Header
          title="KYC Documents"
          subtitle="Upload your documents to verify identity"
          onBack={handleBack}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="large" color={Theme.colors.primaryMedium} />
              </View>
            ) : error ? (
              <View style={styles.loadingRow}>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.fallbackHint}>Showing default document list.</Text>
              </View>
            ) : null}
            {documents.map((doc) => renderDocumentCard(doc))}

            {/* Info Box */}
            <View style={styles.infoBox}>
              <CircleInfoIcon size={scale(20)} color="#155DFC" />
              <Text style={styles.infoText}>
                Your documents are encrypted and stored securely. Verification typically takes 24-48 hours.
              </Text>
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

          {/* Skip removed */}
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
    gap: scale(16),
  },
  loadingRow: {
    paddingVertical: scale(24),
    alignItems: 'center',
  },
  errorText: {
    fontSize: scale(14),
    color: '#FB2C36',
    fontFamily: Theme.typography.body.fontFamily,
  },
  fallbackHint: {
    fontSize: scale(12),
    color: Theme.colors.textLight,
    marginTop: scale(8),
    fontFamily: Theme.typography.body.fontFamily,
  },
  documentCard: {
    width: '100%',
    backgroundColor: Theme.colors.white,
    borderWidth: 2,
    borderColor: Theme.colors.borderGrey,
    borderRadius: 12,
    padding: 16,
    gap: scale(12),
  },
  documentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  documentIconContainer: {
    width: scale(42),
    height: scale(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
    gap: scale(4),
  },
  documentLabel: {
    fontSize: scale(14),
    lineHeight: scale(21),
    color: Theme.colors.textDark,
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '700',
  },
  requiredText: {
    fontSize: scale(12),
    lineHeight: scale(14),
    color: '#FB2C36',
    fontFamily: Theme.typography.body.fontFamily,
  },
  optionalText: {
    fontSize: scale(12),
    lineHeight: scale(14),
    color: Theme.colors.textGrey,
    fontFamily: Theme.typography.body.fontFamily,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(6),
  },
  viewDocButton: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    backgroundColor: 'rgba(35, 114, 39, 0.15)',
    borderRadius: 8,
  },
  viewDocText: {
    fontSize: scale(11),
    color: Theme.colors.primaryMedium,
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '600',
  },
  pendingBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  pendingText: {
    fontSize: scale(12),
    color: '#6B7280',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '600',
  },
  failedBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    backgroundColor: 'rgba(251, 44, 54, 0.1)',
    borderRadius: 12,
  },
  failedText: {
    fontSize: scale(12),
    color: '#FB2C36',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '600',
  },
  startBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: 12,
  },
  startText: {
    fontSize: scale(12),
    color: Theme.colors.white,
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '600',
  },
  failedSection: {
    width: '100%',
    gap: scale(8),
    paddingTop: scale(8),
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderGrey,
  },
  failedMessage: {
    fontSize: scale(12),
    lineHeight: scale(18),
    color: '#FB2C36',
    fontFamily: Theme.typography.body.fontFamily,
  },
  uploadAgainButton: {
    width: '100%',
    height: scale(36),
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#FB2C36',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadAgainText: {
    fontSize: scale(14),
    lineHeight: scale(21),
    color: '#FB2C36',
    fontFamily: Theme.typography.body.fontFamily,
    fontWeight: '600',
  },
  infoBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(12),
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    fontSize: scale(12),
    lineHeight: scale(18),
    color: '#1447E6',
    fontFamily: Theme.typography.body.fontFamily,
  },
  bottomSection: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.gray100,
    paddingHorizontal: 16,
    paddingTop: verticalScale(22),
    paddingBottom: verticalScale(21),
    gap: scale(12),
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
  skipButton: {
    height: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  skipButtonText: {
    fontSize: 12,
    lineHeight: 18,
    color: Theme.colors.textLight,
    fontFamily: Theme.typography.body.fontFamily,
    opacity: 0.7,
  },
});
