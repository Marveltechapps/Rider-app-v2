/**
 * Terms and Conditions Screen – loads current rider legal document from API
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
import { getTerms } from '../api/legal';
import { useConfigWithDefaults, useUser } from '../contexts';
import { goBackOrReplace, resolveLegalBackFallback } from '../utils/navigation/safeBack';

const FALLBACK_TERMS = {
  version: 'fallback',
  title: 'Terms & Conditions',
  effectiveDate: '',
  lastUpdated: '',
  contentFormat: 'plain' as const,
  content: `Welcome to SelOrg! By accessing or using our delivery partner platform, you agree to be bound by these Terms and Conditions.

1. Acceptance of Terms
By registering as a delivery partner, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, including our Privacy Policy.

2. Eligibility Requirements
To become a delivery partner, you must be at least 18 years of age and hold valid government-issued ID, driving license, and vehicle documents.

3. Independent Contractor Relationship
You are an independent contractor and may accept or decline delivery requests at your discretion.

4. Payment and Earnings
Earnings are calculated based on completed deliveries. Payment processing occurs per the payout schedule shown in the app.

5. Conduct and Professional Standards
Maintain professional behavior, handle deliveries with care, and follow traffic laws.

6. Account Security
You are responsible for maintaining the confidentiality of your account credentials.

7. Termination
Either party may terminate this agreement at any time.

8. Changes to Terms
We may modify these Terms at any time. Continued use constitutes acceptance.`,
};

export default function TermsConditionsScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { isLoggedIn } = useUser();
  const config = useConfigWithDefaults();
  const handleBack = useCallback(() => {
    goBackOrReplace(router, resolveLegalBackFallback(returnTo, isLoggedIn));
  }, [router, returnTo, isLoggedIn]);
  const { data, isLoading } = useQuery({
    queryKey: ['legal', 'terms'],
    queryFn: getTerms,
    staleTime: 60 * 60 * 1000,
  });
  const doc = data ?? FALLBACK_TERMS;

  if (isLoading && !data) {
    return (
      <SafeAreaView style={termsStyles.container} edges={['top', 'bottom']}>
        <Header title="Terms & Conditions" onBack={handleBack} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#155DFC" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={termsStyles.container} edges={['top', 'bottom']}>
      <Header title={doc.title || 'Terms & Conditions'} onBack={handleBack} />
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
            Questions?
          </Text>
          <Text variant="body" color="#364153" style={termsStyles.paragraph}>
            Contact us at: {config.supportEmail} or {config.supportPhone}
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
