/**
 * Account & Documents Screen Component
 * Lists account and document issue topics with navigation to FAQs
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import DocumentIcon from '../components/icons/DocumentIcon';
import Header from '../components/layout/Header';
import paymentIssuesStyles from '../styles/paymentIssuesStyles';
import { scale } from '../utils/responsive';

interface AccountTopic {
  id: string;
  title: string;
  description: string;
  route: string;
}

const accountTopics: AccountTopic[] = [
  {
    id: '1',
    title: 'Profile Verification',
    description: 'How to verify your profile and documents',
    route: '/account-faq-profile-verification',
  },
  {
    id: '2',
    title: 'KYC Documents',
    description: 'Uploading and updating KYC documents',
    route: '/account-faq-kyc-documents',
  },
  {
    id: '3',
    title: 'Account Suspension',
    description: 'Understanding account suspension and reactivation',
    route: '/account-faq-suspension',
  },
  {
    id: '4',
    title: 'Update Profile',
    description: 'Changing personal information and documents',
    route: '/account-faq-update-profile',
  },
];

export default function AccountDocumentsScreen() {
  const router = useRouter();

  const handleTopicPress = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  return (
    <SafeAreaView style={paymentIssuesStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <Header
        title="Account & Documents"
        subtitle="Find answers to account and document questions"
        onBack={() => router.back()}
      />

      <ScrollView
        style={paymentIssuesStyles.scrollView}
        contentContainerStyle={paymentIssuesStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topics List */}
        <View style={paymentIssuesStyles.topicsContainer}>
          {accountTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={paymentIssuesStyles.topicCard}
              onPress={() => handleTopicPress(topic.route)}
              activeOpacity={0.7}
            >
              <View style={paymentIssuesStyles.topicCardLeft}>
                <View style={paymentIssuesStyles.topicIconContainer}>
                  <DocumentIcon size={scale(24)} color="#32C96A" />
                </View>
                <View style={paymentIssuesStyles.topicInfo}>
                  <Text variant="body" color="#101828" style={paymentIssuesStyles.topicTitle}>
                    {topic.title}
                  </Text>
                  <Text variant="caption" color="#6A7282" style={paymentIssuesStyles.topicDescription}>
                    {topic.description}
                  </Text>
                </View>
              </View>
              <ChevronRightIcon size={scale(17.5)} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


