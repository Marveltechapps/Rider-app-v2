/**
 * Legal API – login footer config, terms, and privacy (public, no auth)
 */

import { apiRequest } from './client';

export interface LoginLegalConfig {
  preamble: string;
  terms: { label: string; type: 'in_app' | 'url'; url: string | null };
  privacy: { label: string; type: 'in_app' | 'url'; url: string | null };
  connector: string;
}

export interface LegalDocument {
  id?: string;
  version: string;
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  contentFormat: 'plain' | 'html' | 'markdown';
  content: string;
}

const LEGAL_BASE = '/api/v1/rider/legal';

const DEFAULT_LOGIN_LEGAL: LoginLegalConfig = {
  preamble: 'By continuing, you agree to our ',
  terms: { label: 'Terms & Conditions', type: 'in_app', url: null },
  privacy: { label: 'Privacy Policy', type: 'in_app', url: null },
  connector: ' and ',
};

export async function getLegalConfig(): Promise<LoginLegalConfig> {
  try {
    const data = await apiRequest<{ loginLegal: LoginLegalConfig }>(
      'GET',
      `${LEGAL_BASE}/config`,
      undefined,
      true
    );
    return data?.loginLegal ?? DEFAULT_LOGIN_LEGAL;
  } catch {
    return DEFAULT_LOGIN_LEGAL;
  }
}

export async function getTerms(version?: string): Promise<LegalDocument | null> {
  const qs = version ? `?version=${encodeURIComponent(version)}` : '';
  try {
    return await apiRequest<LegalDocument>('GET', `${LEGAL_BASE}/terms${qs}`, undefined, true);
  } catch {
    return null;
  }
}

export async function getPrivacy(version?: string): Promise<LegalDocument | null> {
  const qs = version ? `?version=${encodeURIComponent(version)}` : '';
  try {
    return await apiRequest<LegalDocument>('GET', `${LEGAL_BASE}/privacy${qs}`, undefined, true);
  } catch {
    return null;
  }
}
