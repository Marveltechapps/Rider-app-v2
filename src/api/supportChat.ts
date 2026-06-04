/**
 * Rider live chat support — shared with Rider Dashboard (SupportConversation / SupportMessage)
 */

import { api } from './client';

export interface SupportConversation {
  conversationId: string;
  riderId: string;
  riderName: string;
  riderPhone: string;
  status: 'open' | 'resolved';
  lastMessage: string;
  lastMessageAt: string | null;
  riderUnreadCount: number;
  adminUnreadCount: number;
}

export interface SupportMessage {
  messageId: string;
  conversationId: string;
  senderType: 'rider' | 'admin';
  senderId: string;
  senderName: string;
  body: string;
  clientMessageId?: string | null;
  createdAt: string;
}

export async function fetchMySupportChat(): Promise<{
  conversation: SupportConversation;
  messages: SupportMessage[];
}> {
  return api.get<{ conversation: SupportConversation; messages: SupportMessage[] }>(
    '/api/v1/support-chat/rider/conversation'
  );
}

export async function sendSupportChatMessage(
  body: string,
  clientMessageId?: string
): Promise<{ conversation: SupportConversation; message: SupportMessage }> {
  return api.post<{ conversation: SupportConversation; message: SupportMessage }>(
    '/api/v1/support-chat/rider/conversation/messages',
    { body, clientMessageId }
  );
}

export async function markSupportChatRead(): Promise<SupportConversation> {
  const res = await api.post<{ conversation: SupportConversation }>(
    '/api/v1/support-chat/rider/conversation/read'
  );
  return res.conversation;
}
