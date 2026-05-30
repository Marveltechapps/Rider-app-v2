/**
 * Content API – FAQ by key
 */

import { getBaseUrlOrThrow } from './config';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqByKeyResponse {
  title: string;
  faqs: FaqItem[];
}

/** GET /api/v1/content/faq/:key */
export async function getFaqByKey(key: string, locale?: string): Promise<FaqByKeyResponse> {
  const base = getBaseUrlOrThrow();
  const qs = locale ? `?locale=${encodeURIComponent(locale)}` : '';
  const res = await fetch(`${base}/api/v1/content/faq/${encodeURIComponent(key)}${qs}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404) throw new Error('FAQ not found');
    throw new Error(data?.error ?? `Failed to fetch FAQ: ${res.status}`);
  }
  return data;
}

export interface ContentPageResponse {
  title: string;
  body: string;
}

/** GET /api/v1/content/page/:key – for terms, privacy, etc. */
export async function getContentPage(key: string, locale?: string): Promise<ContentPageResponse> {
  const base = getBaseUrlOrThrow();
  const qs = locale ? `?locale=${encodeURIComponent(locale)}` : '';
  const res = await fetch(`${base}/api/v1/content/page/${encodeURIComponent(key)}${qs}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404) throw new Error('Content not found');
    throw new Error(data?.error ?? `Failed to fetch content: ${res.status}`);
  }
  return data;
}
