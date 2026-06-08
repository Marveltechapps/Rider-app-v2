/**
 * Payment Issues Screen Component
 * Lists payment issue topics with navigation to FAQs
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import MoneyIcon from '../components/icons/MoneyIcon';
import Header from '../components/layout/Header';
import paymentIssuesStyles from '../styles/paymentIssuesStyles';
import { scale, verticalScale } from '../utils/responsive';

interface PaymentTopic {
  id: string;
  title: string;
  description: string;
  route: string;
}

const paymentTopics: PaymentTopic[] = [
  {
    id: '1',
    title: 'Payment Not Received',
    description: 'Issues with payments not reflecting in your account',
    route: '/payment-faq-not-received',
  },
  {
    id: '2',
    title: 'Wrong Payment Amount',
    description: 'Discrepancies in payment amounts or calculations',
    route: '/payment-faq-wrong-amount',
  },
  {
    id: '3',
    title: 'Payment Delays',
    description: 'Delays in payment processing and cash out',
    route: '/payment-faq-delays',
  },
];

export default function PaymentIssuesScreen() {
  const router = useRouter();

  const handleTopicPress = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  return (
    <SafeAreaView style={paymentIssuesStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <Header
        title="Payment Issues"
        subtitle="Find answers to common payment questions"
        onBack={() => router.back()}
      />

      <ScrollView
        style={paymentIssuesStyles.scrollView}
        contentContainerStyle={paymentIssuesStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topics List */}
        <View style={paymentIssuesStyles.topicsContainer}>
          {paymentTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={paymentIssuesStyles.topicCard}
              onPress={() => handleTopicPress(topic.route)}
              activeOpacity={0.7}
            >
              <View style={paymentIssuesStyles.topicCardLeft}>
                <View style={paymentIssuesStyles.topicIconContainer}>
                  <MoneyIcon size={scale(24)} color="#237227" />
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


