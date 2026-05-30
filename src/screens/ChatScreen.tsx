/**
 * Chat Screen Component
 * Live chat support interface with modern UX/UI
 */

import { useRouter } from 'expo-router';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import Header from '../components/layout/Header';
import ChatIcon from '../components/icons/ChatIcon';
import SendIcon from '../components/icons/ArrowRightIcon';
import chatStyles from '../styles/chatStyles';
import { scale, verticalScale } from '../utils/responsive';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m here to help you. How can I assist you today?',
      sender: 'support',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate support response after 2 seconds
    setTimeout(() => {
      setIsTyping(false);
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Our support team is looking into this and will get back to you shortly.',
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportResponse]);
    }, 2000);
  }, [inputText]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={chatStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <Header
        title="Live Chat Support"
        subtitle="We typically reply within a few minutes"
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={chatStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          style={chatStyles.messagesContainer}
          contentContainerStyle={chatStyles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {/* Support Agent Info Card */}
          <View style={chatStyles.agentCard}>
            <View style={chatStyles.agentAvatar}>
              <ChatIcon size={scale(20)} color="#32C96A" />
            </View>
            <View style={chatStyles.agentInfo}>
              <Text variant="body" color="#101828" style={chatStyles.agentName}>
                Support Agent
              </Text>
              <Text variant="caption" color="#6A7282" style={chatStyles.agentStatus}>
                Online • Usually replies in 2 minutes
              </Text>
            </View>
          </View>

          {/* Messages */}
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                chatStyles.messageWrapper,
                message.sender === 'user' && chatStyles.messageWrapperUser,
              ]}
            >
              <View
                style={[
                  chatStyles.messageBubble,
                  message.sender === 'user'
                    ? chatStyles.messageBubbleUser
                    : chatStyles.messageBubbleSupport,
                ]}
              >
                <Text
                  variant="body"
                  style={[
                    chatStyles.messageText,
                    message.sender === 'user'
                      ? chatStyles.messageTextUser
                      : chatStyles.messageTextSupport,
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  variant="caption"
                  style={[
                    chatStyles.messageTime,
                    message.sender === 'user'
                      ? chatStyles.messageTimeUser
                      : chatStyles.messageTimeSupport,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={chatStyles.messageWrapper}>
              <View style={[chatStyles.messageBubble, chatStyles.messageBubbleSupport]}>
                <View style={chatStyles.typingIndicator}>
                  <View style={[chatStyles.typingDot, chatStyles.typingDot1]} />
                  <View style={[chatStyles.typingDot, chatStyles.typingDot2]} />
                  <View style={[chatStyles.typingDot, chatStyles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={chatStyles.inputContainer}>
          <View style={chatStyles.inputWrapper}>
            <TextInput
              style={chatStyles.input}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              textAlignVertical="center"
            />
            <TouchableOpacity
              style={[
                chatStyles.sendButton,
                !inputText.trim() && chatStyles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
              activeOpacity={0.7}
            >
              <SendIcon size={scale(18)} color={inputText.trim() ? '#FFFFFF' : '#9CA3AF'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


