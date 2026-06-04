/**
 * Help & Support Screen Component
 * Displays support options, contact info, and help topics
 * Matches Figma design exactly
 */

import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConfigWithDefaults } from '../contexts';
import Text from '../components/common/Text';
import ChatIcon from '../components/icons/ChatIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import DocumentIcon from '../components/icons/DocumentIcon';
import EmailIcon from '../components/icons/EmailIcon';
import MoneyIcon from '../components/icons/MoneyIcon';
import PackageIcon from '../components/icons/PackageIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import Header from '../components/layout/Header';
import { createIncident } from '../api/incidents';
import { fetchMySupportChat } from '../api/supportChat';
import { supportChatSocket } from '../services/supportChatSocket';
import * as Location from 'expo-location';
import helpSupportStyles from '../styles/helpSupportStyles';
import { scale } from '../utils/responsive';

export default function HelpSupportScreen() {
  const router = useRouter();
  const config = useConfigWithDefaults();
  const [chatUnread, setChatUnread] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      fetchMySupportChat()
        .then((d) => {
          if (!cancelled) setChatUnread(d.conversation.riderUnreadCount ?? 0);
        })
        .catch(() => {});
      supportChatSocket.connect();
      const onRealtime = (payload: { conversation?: { riderUnreadCount?: number } }) => {
        if (payload?.conversation?.riderUnreadCount != null) {
          setChatUnread(payload.conversation.riderUnreadCount);
        }
      };
      supportChatSocket.on('support:message', onRealtime);
      supportChatSocket.on('support:conversation:updated', onRealtime);
      return () => {
        cancelled = true;
        supportChatSocket.off('support:message', onRealtime);
        supportChatSocket.off('support:conversation:updated', onRealtime);
      };
    }, [])
  );

  const handleLiveChat = useCallback(() => {
    router.push('/chat' as any);
  }, [router]);

  const handleEmergencySOS = useCallback(() => {
    Alert.alert(
      'Emergency SOS',
      'This will alert our safety team and emergency services. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send SOS',
          style: 'destructive',
          onPress: async () => {
            try {
              let location: { lat: number; lng: number } | undefined;
              try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                  const loc = await Location.getCurrentPositionAsync({});
                  location = { lat: loc.coords.latitude, lng: loc.coords.longitude };
                }
              } catch {
                // Location optional
              }
              await createIncident({
                type: 'safety_concern',
                description: 'Emergency SOS triggered by rider from Help & Support screen.',
                priority: 'urgent',
                location,
              });
              Alert.alert('SOS Sent', 'Our safety team has been notified.');
              Linking.openURL('tel:112').catch(() => {});
            } catch {
              Alert.alert('SOS failed', 'Could not send alert. Call emergency services directly.');
              Linking.openURL('tel:112').catch(() => {});
            }
          },
        },
      ]
    );
  }, []);

  const handleCallSupport = useCallback(() => {
    const digits = config.supportPhone.replace(/\D/g, '');
    Linking.openURL(`tel:${digits || '18001234567'}`);
  }, [config.supportPhone]);

  const handleEmailSupport = useCallback(() => {
    Linking.openURL(`mailto:${config.supportEmail}`);
  }, [config.supportEmail]);

  const handleSubmitTicket = useCallback(() => {
    router.push('/contact-support' as any);
  }, [router]);

  const handleHelpTopic = useCallback((topic: string) => {
    if (topic === 'Payment Issues') {
      router.push('/payment-issues' as any);
    } else if (topic === 'Delivery Issues') {
      router.push('/delivery-issues' as any);
    } else if (topic === 'Account & Documents') {
      router.push('/account-documents' as any);
    } else if (topic === 'App Issues') {
      router.push('/app-issues' as any);
    } else {
      console.log('Help topic:', topic);
      Alert.alert(topic, 'Opening help articles...');
    }
  }, [router]);

  return (
    <SafeAreaView style={helpSupportStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <Header
        title="Help & Support"
        onBack={() => router.back()}
      />
      <ScrollView
        style={helpSupportStyles.scrollView}
        contentContainerStyle={helpSupportStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Action Buttons */}
        <View style={helpSupportStyles.quickActions}>
          <View style={helpSupportStyles.liveChatButtonWrap}>
            {chatUnread > 0 && (
              <View style={helpSupportStyles.liveChatUnreadBadge}>
                <Text style={helpSupportStyles.liveChatUnreadText}>
                  {chatUnread > 99 ? '99+' : chatUnread}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={helpSupportStyles.liveChatButton}
              onPress={handleLiveChat}
              activeOpacity={0.8}
            >
              <ChatIcon size={scale(28)} color="#FFFFFF" />
              <Text variant="body" style={helpSupportStyles.liveChatText}>
                Live Chat Support
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={helpSupportStyles.emergencyButton}
            onPress={handleEmergencySOS}
            activeOpacity={0.8}
          >
            <View style={helpSupportStyles.emergencyIcon}>
              <Text style={helpSupportStyles.emergencyIconText}>!</Text>
            </View>
            <Text variant="body" style={helpSupportStyles.emergencyText}>
              Emergency SOS
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contact Support Section */}
        <View style={helpSupportStyles.contactSection}>
          <Text variant="h3" color="#101828" style={helpSupportStyles.sectionTitle}>
            Contact Support
          </Text>

          <View style={helpSupportStyles.contactList}>
            <TouchableOpacity
              style={helpSupportStyles.contactItem}
              onPress={handleCallSupport}
              activeOpacity={0.7}
            >
              <View style={helpSupportStyles.contactIconContainer}>
                <PhoneIcon size={scale(17.5)} color="#32C96A" />
              </View>
              <View style={helpSupportStyles.contactInfo}>
                <Text variant="body" color="#101828" style={helpSupportStyles.contactLabel}>
                  Call Support
                </Text>
                <Text variant="bodySm" color="#6A7282" style={helpSupportStyles.contactValue}>
                  {config.supportPhone} (24/7)
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={helpSupportStyles.contactItem}
              onPress={handleEmailSupport}
              activeOpacity={0.7}
            >
              <View style={helpSupportStyles.contactIconContainer}>
                <EmailIcon size={scale(17.5)} color="#32C96A" />
              </View>
              <View style={helpSupportStyles.contactInfo}>
                <Text variant="body" color="#101828" style={helpSupportStyles.contactLabel}>
                  Email Support
                </Text>
                <Text variant="bodySm" color="#6A7282" style={helpSupportStyles.contactValue}>
                  {config.supportEmail}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={helpSupportStyles.contactItem}
              onPress={handleSubmitTicket}
              activeOpacity={0.7}
            >
              <View style={helpSupportStyles.contactIconContainer}>
                <ChatIcon size={scale(17.5)} color="#32C96A" />
              </View>
              <View style={helpSupportStyles.contactInfo}>
                <Text variant="body" color="#101828" style={helpSupportStyles.contactLabel}>
                  Submit Ticket
                </Text>
                <Text variant="bodySm" color="#6A7282" style={helpSupportStyles.contactValue}>
                  Create a support ticket – we'll respond in {config.supportSlaMessage}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Browse Help Topics Section */}
        <View style={helpSupportStyles.topicsSection}>
          <Text variant="h3" color="#101828" style={helpSupportStyles.sectionTitle}>
            Browse Help Topics
          </Text>

          {/* Payment Issues */}
          <TouchableOpacity
            style={helpSupportStyles.topicCard}
            onPress={() => handleHelpTopic('Payment Issues')}
            activeOpacity={0.7}
          >
            <View style={helpSupportStyles.topicCardLeft}>
              <View style={helpSupportStyles.topicIconContainer}>
                <MoneyIcon size={scale(20)} color="#4A5565" />
              </View>
              <View style={helpSupportStyles.topicInfo}>
                <Text variant="body" color="#101828" style={helpSupportStyles.topicTitle}>
                  Payment Issues
                </Text>
                <Text variant="caption" color="#6A7282" style={helpSupportStyles.topicDescription}>
                  Payment not received, wrong amount
                </Text>
              </View>
            </View>
            <ChevronRightIcon
              size={scale(17.5)}
              color="#6B7280"
              style={helpSupportStyles.topicCardChevron}
            />
          </TouchableOpacity>

          {/* Delivery Issues */}
          <TouchableOpacity
            style={helpSupportStyles.topicCard}
            onPress={() => handleHelpTopic('Delivery Issues')}
            activeOpacity={0.7}
          >
            <View style={helpSupportStyles.topicCardLeft}>
              <View style={helpSupportStyles.topicIconContainer}>
                <PackageIcon size={scale(20)} color="#4A5565" />
              </View>
              <View style={helpSupportStyles.topicInfo}>
                <Text variant="body" color="#101828" style={helpSupportStyles.topicTitle}>
                  Delivery Issues
                </Text>
                <Text variant="caption" color="#6A7282" style={helpSupportStyles.topicDescription}>
                  Customer not available, address wrong
                </Text>
              </View>
            </View>
            <ChevronRightIcon
              size={scale(17.5)}
              color="#6B7280"
              style={helpSupportStyles.topicCardChevron}
            />
          </TouchableOpacity>

          {/* Account & Documents */}
          <TouchableOpacity
            style={helpSupportStyles.topicCard}
            onPress={() => handleHelpTopic('Account & Documents')}
            activeOpacity={0.7}
          >
            <View style={helpSupportStyles.topicCardLeft}>
              <View style={helpSupportStyles.topicIconContainer}>
                <DocumentIcon size={scale(20)} color="#4A5565" />
              </View>
              <View style={helpSupportStyles.topicInfo}>
                <Text variant="body" color="#101828" style={helpSupportStyles.topicTitle}>
                  Account & Documents
                </Text>
                <Text variant="caption" color="#6A7282" style={helpSupportStyles.topicDescription}>
                  Profile, KYC, verification
                </Text>
              </View>
            </View>
            <ChevronRightIcon
              size={scale(17.5)}
              color="#6B7280"
              style={helpSupportStyles.topicCardChevron}
            />
          </TouchableOpacity>

          {/* App Issues */}
          <TouchableOpacity
            style={helpSupportStyles.topicCard}
            onPress={() => handleHelpTopic('App Issues')}
            activeOpacity={0.7}
          >
            <View style={helpSupportStyles.topicCardLeft}>
              <View style={helpSupportStyles.topicIconContainer}>
                <PhoneIcon size={scale(20)} color="#4A5565" />
              </View>
              <View style={helpSupportStyles.topicInfo}>
                <Text variant="body" color="#101828" style={helpSupportStyles.topicTitle}>
                  App Issues
                </Text>
                <Text variant="caption" color="#6A7282" style={helpSupportStyles.topicDescription}>
                  Login problems, bugs, crashes
                </Text>
              </View>
            </View>
            <ChevronRightIcon
              size={scale(17.5)}
              color="#6B7280"
              style={helpSupportStyles.topicCardChevron}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

