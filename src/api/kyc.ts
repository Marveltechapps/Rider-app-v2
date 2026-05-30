/**
 * KYC API – document types, status, upload
 */

import { getBaseUrlOrThrow } from './config';
import { asRecord, getApiErrorMessage, unwrapApiPayload } from './parseResponse';
import { getStoredAccessToken } from './storage';

export interface DocumentTypeDto {
  code: string;
  label: string;
  iconKey: string;
  required: boolean;
  sortOrder: number;
}

export interface KycStatusItem {
  documentTypeCode: string;
  label: string;
  iconKey: string;
  required: boolean;
  status: 'not_started' | 'pending' | 'verified' | 'failed';
  rejectedReason?: string;
  uploadedAt?: string;
  verifiedAt?: string;
  /** URL to view the uploaded document (e.g. S3 link). Only present when status is verified and file was uploaded. */
  fileUrl?: string;
  documentNumber?: string;
}

export interface DocumentTypesResponse {
  documentTypes: DocumentTypeDto[];
}

export interface KycStatusResponse {
  documents: KycStatusItem[];
}

export interface UploadKycResponse {
  documentTypeCode: string;
  status: string;
  uploadedLink?: string;
  documentNumber?: string;
  rejectedReason?: string;
  uploadedAt?: string;
  verifiedAt?: string;
}

/** GET /api/v1/kyc/document-types – no auth required if backend allows */
export async function getDocumentTypes(): Promise<DocumentTypesResponse> {
  const base = getBaseUrlOrThrow();
  const res = await fetch(`${base}/api/v1/kyc/document-types`);
  const raw = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(getApiErrorMessage(asRecord(raw), res.status));
  return unwrapApiPayload<DocumentTypesResponse>(raw);
}

/** GET /api/v1/kyc/status – requires auth */
export async function getKycStatus(): Promise<KycStatusResponse> {
  const base = getBaseUrlOrThrow();
  const token = await getStoredAccessToken();
  const res = await fetch(`${base}/api/v1/kyc/status`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error(getApiErrorMessage(asRecord(raw), res.status));
  }
  return unwrapApiPayload<KycStatusResponse>(raw);
}

/** POST /api/v1/kyc/upload – multipart file + documentTypeCode, requires auth */
export async function uploadKycDocument(
  fileUri: string,
  documentTypeCode: string,
  fileName?: string,
  mimeType: string = 'image/jpeg',
  documentNumber?: string
): Promise<UploadKycResponse> {
  const base = getBaseUrlOrThrow();
  const token = await getStoredAccessToken();
  if (!token) throw new Error('Unauthorized');

  const formData = new FormData();
  formData.append('documentTypeCode', documentTypeCode);
  if (documentNumber) {
    formData.append('documentNumber', documentNumber);
  }
  formData.append('file', {
    uri: fileUri,
    name: fileName ?? `document.${mimeType === 'image/jpeg' ? 'jpg' : 'png'}`,
    type: mimeType,
  } as unknown as Blob);

  const url = `${base}/api/v1/kyc/upload`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    data = {};
  }

  if (__DEV__) {
    console.warn('[uploadKycDocument]', {
      url,
      documentTypeCode,
      status: res.status,
      statusText: res.statusText,
      bodyPreview: text.slice(0, 800),
    });
  }

  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    let msg = getApiErrorMessage(data, res.status);
    if (!msg || msg.startsWith('Request failed:')) {
      msg = `Document upload failed (HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ''}).`;
    }
    if (res.status === 413) {
      msg += ' The file may be over the 10MB server limit; try a smaller or more compressed image.';
    } else if (res.status < 100 || res.status > 599) {
      msg +=
        ' Non-standard HTTP status usually means a proxy, tunnel, or client network issue — verify EXPO_PUBLIC_API_BASE_URL in .env matches your backend and try again.';
    } else if (text.length > 0 && text.length < 500 && !msg.includes(text.trim().slice(0, 40))) {
      msg += ` ${text.trim()}`;
    }
    throw new Error(msg.trim());
  }

  return unwrapApiPayload<UploadKycResponse>(data);
}
