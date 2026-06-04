/**
 * KYC document status — map backend values to UI labels and counts (no hardcoded totals).
 */

import { KYC_STATUS_QUERY_KEY, type DocumentTypeDto, type KycStatusItem } from '../api/kyc';
import type { DocumentStatus, RiderDocument } from '../types/documents';

export { KYC_STATUS_QUERY_KEY };
export const KYC_QUERY_KEY = KYC_STATUS_QUERY_KEY;

const STATUS_PRIORITY: Record<KycStatusItem['status'], number> = {
  not_started: 0,
  pending: 2,
  failed: 3,
  verified: 4,
};

export function pickHigherKycStatus(a: KycStatusItem, b: KycStatusItem): KycStatusItem {
  const pa = STATUS_PRIORITY[a.status] ?? 0;
  const pb = STATUS_PRIORITY[b.status] ?? 0;
  const winner = pb > pa ? b : pa > pb ? a : b;
  const loser = winner === b ? a : b;
  return {
    ...winner,
    fileUrl: winner.fileUrl ?? loser.fileUrl,
    rejectedReason: winner.rejectedReason ?? loser.rejectedReason,
    documentNumber: winner.documentNumber ?? loser.documentNumber,
    verifiedAt: winner.verifiedAt ?? loser.verifiedAt,
    uploadedAt: winner.uploadedAt ?? loser.uploadedAt,
  };
}

/** Map API status → card badge status */
export function mapKycStatusToUiStatus(apiStatus: KycStatusItem['status']): DocumentStatus {
  switch (apiStatus) {
    case 'verified':
      return 'verified';
    case 'failed':
      return 'rejected';
    case 'pending':
      return 'under_review';
    case 'not_started':
    default:
      return 'pending';
  }
}

export function getStatusLabel(status: DocumentStatus): string {
  switch (status) {
    case 'verified':
      return 'Verified';
    case 'under_review':
      return 'Under Review';
    case 'rejected':
      return 'Rejected';
    case 'pending':
    default:
      return 'Pending';
  }
}

export function kycItemToRiderDocument(item: KycStatusItem): RiderDocument {
  const date = item.verifiedAt || item.uploadedAt;
  const updatedOn = date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';
  const ext = item.fileUrl?.split('?')[0]?.split('.').pop()?.toLowerCase();
  const fileName =
    ext && ['jpg', 'jpeg', 'png', 'pdf', 'webp'].includes(ext)
      ? `${item.documentTypeCode}.${ext}`
      : `${item.documentTypeCode}.pdf`;

  return {
    id: item.documentTypeCode,
    name: item.label,
    status: mapKycStatusToUiStatus(item.status),
    apiStatus: item.status,
    updatedOn,
    fileName,
    rejectedReason: item.rejectedReason,
  };
}

export function typesToPlaceholderItems(types: DocumentTypeDto[]): KycStatusItem[] {
  return types.map((t) => ({
    documentTypeCode: t.code,
    label: t.label,
    iconKey: t.iconKey,
    required: t.required,
    status: 'not_started' as const,
  }));
}

/** Merge document types with KYC status; never downgrade verified → pending on partial fetch. */
export function buildKycDocumentList(
  kycDocuments: KycStatusItem[] | undefined,
  documentTypes: DocumentTypeDto[] | undefined
): KycStatusItem[] {
  const typeList = documentTypes?.length ? documentTypes : [];
  const incoming = kycDocuments ?? [];
  const byCode = new Map<string, KycStatusItem>();

  for (const d of incoming) {
    byCode.set(d.documentTypeCode, d);
  }

  if (typeList.length === 0) {
    return [...byCode.values()].sort((a, b) => a.label.localeCompare(b.label));
  }

  return typeList.map((t) => {
    const existing = byCode.get(t.code);
    if (existing) {
      return {
        ...existing,
        label: existing.label || t.label,
        iconKey: existing.iconKey || t.iconKey,
        required: existing.required ?? t.required,
      };
    }
    return {
      documentTypeCode: t.code,
      label: t.label,
      iconKey: t.iconKey,
      required: t.required,
      status: 'not_started',
    };
  });
}

export function mergeKycDocumentLists(
  previous: KycStatusItem[],
  incoming: KycStatusItem[]
): KycStatusItem[] {
  const byCode = new Map<string, KycStatusItem>();
  for (const d of previous) byCode.set(d.documentTypeCode, d);
  for (const d of incoming) {
    const prev = byCode.get(d.documentTypeCode);
    byCode.set(d.documentTypeCode, prev ? pickHigherKycStatus(prev, d) : d);
  }
  const order = incoming.length
    ? incoming.map((d) => d.documentTypeCode)
    : previous.map((d) => d.documentTypeCode);
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

export interface DocumentStatusCounts {
  total: number;
  verified: number;
  pending: number;
  underReview: number;
  rejected: number;
}

export function getDocumentCountsFromList(documents: RiderDocument[]): DocumentStatusCounts {
  return {
    total: documents.length,
    verified: documents.filter((d) => d.status === 'verified').length,
    pending: documents.filter((d) => d.status === 'pending').length,
    underReview: documents.filter((d) => d.status === 'under_review').length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
  };
}

export function getCompletionPercent(counts: DocumentStatusCounts): number {
  if (counts.total <= 0) return 0;
  return Math.min(100, Math.round((counts.verified / counts.total) * 100));
}

/** Pending + under review (matches My Documents summary). */
export function getPendingDocumentTotal(counts: DocumentStatusCounts): number {
  return counts.pending + counts.underReview;
}

export interface DocumentVerificationDisplay {
  /** Single-line status with count, e.g. "Verified (5)" or "Pending (4)". */
  statusBadge: string;
  /** Row breakdown — same numbers as My Documents (Verified / Pending / Rejected). */
  summaryRows: Array<{ label: string; count: number }>;
  isFullyVerified: boolean;
}

/** Labels for Bank Details / profile badges — derived from live counts, not hardcoded. */
export function getDocumentVerificationDisplay(
  counts: DocumentStatusCounts
): DocumentVerificationDisplay {
  const pendingTotal = getPendingDocumentTotal(counts);
  const isFullyVerified = counts.total > 0 && counts.verified === counts.total;

  const summaryRows: Array<{ label: string; count: number }> = [];
  if (counts.verified > 0) summaryRows.push({ label: 'Verified', count: counts.verified });
  if (pendingTotal > 0) summaryRows.push({ label: 'Pending', count: pendingTotal });
  if (counts.rejected > 0) summaryRows.push({ label: 'Rejected', count: counts.rejected });

  let statusBadge: string;
  if (counts.total === 0) {
    statusBadge = pendingTotal > 0 ? `Pending (${pendingTotal})` : 'Pending';
  } else if (isFullyVerified) {
    statusBadge = `Verified (${counts.verified})`;
  } else if (counts.verified === 0 && pendingTotal > 0) {
    statusBadge = `Pending (${pendingTotal})`;
  } else if (counts.verified > 0 && pendingTotal > 0) {
    statusBadge = `${counts.verified} Verified · ${pendingTotal} Pending`;
  } else if (counts.verified > 0) {
    statusBadge = `Verified (${counts.verified})`;
  } else {
    statusBadge = `Pending (${pendingTotal})`;
  }

  return { statusBadge, summaryRows, isFullyVerified };
}

export type ProfileDocumentsBadgeVariant = 'verified' | 'pending' | 'mixed';

/** Compact label for Profile → My Documents row (right-side badge). */
export function getProfileDocumentsStatusLabel(counts: DocumentStatusCounts): {
  label: string;
  variant: ProfileDocumentsBadgeVariant;
} {
  const pendingTotal = getPendingDocumentTotal(counts);
  const display = getDocumentVerificationDisplay(counts);

  if (display.isFullyVerified) {
    return { label: `Verified (${counts.verified})`, variant: 'verified' };
  }
  if (counts.verified > 0 && pendingTotal > 0) {
    return {
      label: `Verified: ${counts.verified} | Pending: ${pendingTotal}`,
      variant: 'mixed',
    };
  }
  if (counts.verified > 0) {
    return { label: `Verified (${counts.verified})`, variant: 'verified' };
  }
  if (pendingTotal > 0) {
    return { label: `Pending (${pendingTotal})`, variant: 'pending' };
  }
  return { label: display.statusBadge, variant: 'pending' };
}
