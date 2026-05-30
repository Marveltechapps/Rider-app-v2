/**
 * App Issues Screen Component
 * Lists app issue topics with navigation to FAQs
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import Header from '../components/layout/Header';
import paymentIssuesStyles from '../styles/paymentIssuesStyles';
import { scale } from '../utils/responsive';

interface AppTopic {
  id: string;
  title: string;
  description: string;
  route: string;
}

const appTopics: AppTopic[] = [
  {
    id: '1',
    title: 'Login Problems',
    description: 'Troubleshooting login and authentication issues',
    route: '/app-faq-login',
  },
  {
    id: '2',
    title: 'App Crashes & Bugs',
    description: 'Fixing app crashes, freezes, and technical issues',
    route: '/app-faq-crashes',
  },
];

export default function AppIssuesScreen() {
  const router = useRouter();

  const handleTopicPress = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  return (
    <SafeAreaView style={paymentIssuesStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <Header
        title="App Issues"
        subtitle="Find answers to app-related questions"
        onBack={() => router.back()}
      />

      <ScrollView
        style={paymentIssuesStyles.scrollView}
        contentContainerStyle={paymentIssuesStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topics List */}
        <View style={paymentIssuesStyles.topicsContainer}>
          {appTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={paymentIssuesStyles.topicCard}
              onPress={() => handleTopicPress(topic.route)}
              activeOpacity={0.7}
            >
              <View style={paymentIssuesStyles.topicCardLeft}>
                <View style={paymentIssuesStyles.topicIconContainer}>
                  <PhoneIcon size={scale(24)} color="#32C96A" />
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


