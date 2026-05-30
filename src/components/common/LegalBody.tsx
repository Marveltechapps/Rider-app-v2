/**
 * Renders legal document body (plain, markdown-lite, or stripped HTML)
 */

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from './Text';
import type { LegalDocument } from '../../api/legal';

interface LegalBodyProps {
  doc: LegalDocument;
  paragraphStyle?: object;
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function toParagraphs(content: string, format: LegalDocument['contentFormat']): string[] {
  let text = content.trim();
  if (!text) return [];
  if (format === 'html') text = stripHtml(text);
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function LegalBody({ doc, paragraphStyle }: LegalBodyProps) {
  const paragraphs = useMemo(
    () => toParagraphs(doc.content, doc.contentFormat),
    [doc.content, doc.contentFormat]
  );

  if (paragraphs.length === 0) {
    return (
      <Text variant="body" color="#364153" style={[styles.paragraph, paragraphStyle]}>
        {doc.content || 'Content is not available.'}
      </Text>
    );
  }

  return (
    <View>
      {paragraphs.map((paragraph, idx) => (
        <Text
          key={`legal-p-${idx}`}
          variant="body"
          color="#364153"
          style={[styles.paragraph, paragraphStyle]}
        >
          {paragraph}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 12,
    lineHeight: 24,
  },
});
