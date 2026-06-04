/**
 * Shared KYC document summary — same query/cache as My Documents for synchronized counts.
 */

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDocumentTypes, getKycStatus } from '../api/kyc';
import {
  buildKycDocumentList,
  getCompletionPercent,
  getDocumentCountsFromList,
  getDocumentVerificationDisplay,
  getPendingDocumentTotal,
  kycItemToRiderDocument,
  KYC_QUERY_KEY,
} from '../utils/kycDocumentStatus';

export function useKycDocumentSummary() {
  const { data: kycRes, isLoading, isRefetching, refetch } = useQuery({
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

  const kycItems = useMemo(
    () => buildKycDocumentList(kycRes?.documents, typesRes?.documentTypes),
    [kycRes?.documents, typesRes?.documentTypes]
  );

  const documents = useMemo(() => kycItems.map(kycItemToRiderDocument), [kycItems]);

  const counts = useMemo(() => getDocumentCountsFromList(documents), [documents]);
  const pendingTotal = useMemo(() => getPendingDocumentTotal(counts), [counts]);
  const completionPercentage = useMemo(() => getCompletionPercent(counts), [counts]);
  const verificationDisplay = useMemo(() => getDocumentVerificationDisplay(counts), [counts]);

  return {
    kycItems,
    documents,
    counts,
    pendingTotal,
    completionPercentage,
    verificationDisplay,
    isLoading: isLoading && documents.length === 0,
    isRefetching,
    refetch,
  };
}
