/**
 * Privacy Policy Screen – loads current rider legal document from API
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import LegalBody from '../components/common/LegalBody';
import Header from '../components/layout/Header';
import termsStyles from '../styles/termsStyles';
import { getPrivacy } from '../api/legal';
import { useConfigWithDefaults, useUser } from '../contexts';
import { goBackOrReplace, resolveLegalBackFallback } from '../utils/navigation/safeBack';

const FALLBACK_PRIVACY = {
  version: 'fallback',
  title: 'Privacy Policy',
  effectiveDate: '',
  lastUpdated: '',
  contentFormat: 'plain' as const,
  content: `At SelOrg, we are committed to protecting your privacy and personal information.

1. Information We Collect
We collect personal details, identity documents, vehicle information, location data during deliveries, payment information, and usage data.

2. How We Use Your Information
Your information is used to verify identity, assign orders, process payments, provide support, and comply with legal requirements.

3. Data Security
We implement industry-standard security measures for sensitive documents and payment details.

4. Location Data
We collect real-time location only when you are online and accepting deliveries.

5. Information Sharing
We do not sell your personal information. Limited data may be shared with customers, merchants, and authorities when required.

6. Your Rights
You may request access, updates, or deletion of your personal information through support.

7. Data Retention
We retain information while your account is active or as required for compliance.

8. Changes to This Policy
We may update this policy and notify you through the app or email.`,
};

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { isLoggedIn } = useUser();
  const config = useConfigWithDefaults();
  const handleBack = useCallback(() => {
    goBackOrReplace(router, resolveLegalBackFallback(returnTo, isLoggedIn));
  }, [router, returnTo, isLoggedIn]);
  const { data, isLoading } = useQuery({
    queryKey: ['legal', 'privacy'],
    queryFn: getPrivacy,
    staleTime: 60 * 60 * 1000,
  });
  const doc = data ?? FALLBACK_PRIVACY;

  if (isLoading && !data) {
    return (
      <SafeAreaView style={termsStyles.container} edges={['top', 'bottom']}>
        <Header title="Privacy Policy" onBack={handleBack} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#155DFC" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={termsStyles.container} edges={['top', 'bottom']}>
      <Header title={doc.title || 'Privacy Policy'} onBack={handleBack} />
      <ScrollView
        style={termsStyles.scrollView}
        contentContainerStyle={termsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {doc.lastUpdated ? (
          <Text variant="caption" color="#6B7280" style={termsStyles.paragraph}>
            Last updated: {doc.lastUpdated}
          </Text>
        ) : null}
        <View style={termsStyles.section}>
          <LegalBody doc={doc} paragraphStyle={termsStyles.paragraph} />
        </View>
        <View style={termsStyles.contactSection}>
          <Text variant="h3" color="#101828" style={termsStyles.sectionTitle}>
            Contact Us
          </Text>
          <Text variant="body" color="#364153" style={termsStyles.paragraph}>
            For privacy-related questions: {config.privacyEmail} or {config.supportPhone}
          </Text>
        </View>
        <View style={termsStyles.footer}>
          <Text variant="caption" color="#6B7280" style={termsStyles.footerText}>
            © {new Date().getFullYear()} SelOrg. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
