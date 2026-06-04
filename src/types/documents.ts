/**
 * Document Types
 */

import type { KycStatusItem } from '../api/kyc';

export type DocumentStatus = 'verified' | 'pending' | 'under_review' | 'rejected';

export interface RiderDocument {
  id: string;
  name: string;
  status: DocumentStatus;
  /** Raw backend status for navigation / API */
  apiStatus?: KycStatusItem['status'];
  updatedOn: string;
  fileName: string;
  rejectedReason?: string;
}

export interface DocumentStatusCounts {
  total: number;
  verified: number;
  pending: number;
  underReview: number;
  rejected: number;
}

export function getDocumentCounts(documents: RiderDocument[]): DocumentStatusCounts {
  return {
    total: documents.length,
    verified: documents.filter((d) => d.status === 'verified').length,
    pending: documents.filter((d) => d.status === 'pending').length,
    underReview: documents.filter((d) => d.status === 'under_review').length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
  };
}

export function getDocumentsByStatus(documents: RiderDocument[], status: DocumentStatus) {
  return documents.filter((d) => d.status === status);
}
