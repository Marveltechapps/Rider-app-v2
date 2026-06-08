/**
 * Delivery Issues Screen Component
 * Lists delivery issue topics with navigation to FAQs
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import PackageIcon from '../components/icons/PackageIcon';
import Header from '../components/layout/Header';
import paymentIssuesStyles from '../styles/paymentIssuesStyles';
import { scale } from '../utils/responsive';

interface DeliveryTopic {
  id: string;
  title: string;
  description: string;
  route: string;
}

const deliveryTopics: DeliveryTopic[] = [
  {
    id: '1',
    title: 'Customer Not Available',
    description: 'What to do when customer is not reachable',
    route: '/delivery-faq-customer-not-available',
  },
  {
    id: '2',
    title: 'Wrong Address',
    description: 'Handling incorrect or incomplete addresses',
    route: '/delivery-faq-wrong-address',
  },
  {
    id: '3',
    title: 'Order Cancellation',
    description: 'Understanding cancellation policies and charges',
    route: '/delivery-faq-cancellation',
  },
  {
    id: '4',
    title: 'Delivery Delays',
    description: 'Managing delays and customer complaints',
    route: '/delivery-faq-delays',
  },
  {
    id: '5',
    title: 'Damaged or Missing Items',
    description: 'Handling damaged packages and missing items',
    route: '/delivery-faq-damaged-items',
  },
];

export default function DeliveryIssuesScreen() {
  const router = useRouter();

  const handleTopicPress = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  return (
    <SafeAreaView style={paymentIssuesStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <Header
        title="Delivery Issues"
        subtitle="Find answers to common delivery questions"
        onBack={() => router.back()}
      />

      <ScrollView
        style={paymentIssuesStyles.scrollView}
        contentContainerStyle={paymentIssuesStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topics List */}
        <View style={paymentIssuesStyles.topicsContainer}>
          {deliveryTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={paymentIssuesStyles.topicCard}
              onPress={() => handleTopicPress(topic.route)}
              activeOpacity={0.7}
            >
              <View style={paymentIssuesStyles.topicCardLeft}>
                <View style={paymentIssuesStyles.topicIconContainer}>
                  <PackageIcon size={scale(24)} color="#237227" />
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


