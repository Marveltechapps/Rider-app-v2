/**
 * Live Chat Support — real-time chat with dashboard support team
 */

import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import AppPressable from '../components/common/AppPressable';
import Header from '../components/layout/Header';
import SendIcon from '../components/icons/ArrowRightIcon';
import {
  fetchMySupportChat,
  sendSupportChatMessage,
  markSupportChatRead,
  type SupportMessage,
  type SupportConversation,
} from '../api/supportChat';
import { supportChatSocket } from '../services/supportChatSocket';
import chatStyles from '../styles/chatStyles';
import { scale } from '../utils/responsive';

export default function ChatScreen() {
  const router = useRouter();
  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const appendMessage = useCallback((msg: SupportMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.messageId === msg.messageId)) return prev;
      return [...prev, msg];
    });
  }, []);

  const loadChat = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMySupportChat();
      setConversation(data.conversation);
      setMessages(data.messages);
      await markSupportChatRead();
      supportChatSocket.connect();
      supportChatSocket.joinConversation(data.conversation.conversationId);
    } catch (e) {
      console.error('[ChatScreen] load failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const conversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    void loadChat();
  }, [loadChat]);

  useEffect(() => {
    conversationIdRef.current = conversation?.conversationId ?? null;
  }, [conversation?.conversationId]);

  useEffect(() => {
    return () => {
      const id = conversationIdRef.current;
      if (id) supportChatSocket.leaveConversation(id);
      supportChatSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onMessage = (payload: {
      conversation?: SupportConversation;
      message?: SupportMessage;
    }) => {
      if (payload.conversation) setConversation(payload.conversation);
      if (payload.message) {
        appendMessage(payload.message);
        if (payload.message.senderType === 'admin') {
          void markSupportChatRead();
        }
      }
    };
    supportChatSocket.on('support:message', onMessage);
    return () => supportChatSocket.off('support:message', onMessage);
  }, [appendMessage]);

  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || sending || !conversation) return;
    const text = inputText.trim();
    const clientMessageId = `rider-${Date.now()}`;
    setInputText('');
    setSending(true);

    const optimistic: SupportMessage = {
      messageId: clientMessageId,
      conversationId: conversation.conversationId,
      senderType: 'rider',
      senderId: conversation.riderId,
      senderName: conversation.riderName,
      body: text,
      clientMessageId,
      createdAt: new Date().toISOString(),
    };
    appendMessage(optimistic);

    try {
      const result = await sendSupportChatMessage(text, clientMessageId);
      setConversation(result.conversation);
      setMessages((prev) => {
        const withoutOpt = prev.filter((m) => m.messageId !== clientMessageId);
        if (withoutOpt.some((m) => m.messageId === result.message.messageId)) return withoutOpt;
        return [...withoutOpt, result.message];
      });
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.messageId !== clientMessageId));
      setInputText(text);
      console.error('[ChatScreen] send failed', e);
    } finally {
      setSending(false);
    }
  }, [inputText, sending, conversation, appendMessage]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={chatStyles.container} edges={['top', 'bottom']}>
        <Header title="Live Chat Support" onBack={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#237227" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={chatStyles.container} edges={['top', 'bottom']}>
      <Header
        title="Live Chat Support"
        subtitle="Chat with our support team"
        onBack={() => router.back()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={chatStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={chatStyles.messagesContainer}
          contentContainerStyle={chatStyles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <View style={chatStyles.emptyState}>
              <Text variant="body" color="#6A7282">
                Send a message to start the conversation.
              </Text>
            </View>
          ) : (
            messages.map((message) => {
              const isUser = message.senderType === 'rider';
              return (
                <View
                  key={message.messageId}
                  style={[
                    chatStyles.messageWrapper,
                    isUser ? chatStyles.userMessageWrapper : chatStyles.supportMessageWrapper,
                  ]}
                >
                  <View
                    style={[
                      chatStyles.messageBubble,
                      isUser ? chatStyles.userBubble : chatStyles.supportBubble,
                    ]}
                  >
                    <Text
                      variant="body"
                      style={isUser ? chatStyles.userMessageText : chatStyles.supportMessageText}
                    >
                      {message.body}
                    </Text>
                    <Text
                      variant="caption"
                      style={isUser ? chatStyles.userTimestamp : chatStyles.supportTimestamp}
                    >
                      {formatTime(message.createdAt)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={chatStyles.inputContainer}>
          <View style={chatStyles.inputRow}>
            <TextInput
              style={chatStyles.textInput}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
              editable={conversation?.status !== 'resolved'}
            />
            <AppPressable
              style={[
                chatStyles.sendButton,
                (!inputText.trim() || sending) && chatStyles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || sending || conversation?.status === 'resolved'}
              minTouchSize={44}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <SendIcon size={scale(20)} color="#FFFFFF" />
              )}
            </AppPressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
