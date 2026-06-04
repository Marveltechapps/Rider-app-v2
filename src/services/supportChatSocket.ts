/**
 * Socket.IO client for rider live chat (path /hhd-socket.io, same server as dashboard).
 */

import { io, Socket } from 'socket.io-client';
import { getBaseUrlOrThrow } from '../api/config';
import { getStoredAccessToken } from '../api/storage';

type Listener = (payload: unknown) => void;

function resolveSocketConfig(): { url: string; path: string } {
  const base = getBaseUrlOrThrow();
  try {
    const u = new URL(base);
    return { url: u.origin, path: '/hhd-socket.io' };
  } catch {
    return { url: base.replace(/\/$/, ''), path: '/hhd-socket.io' };
  }
}

class SupportChatSocketService {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Listener>>();

  connect() {
    if (this.socket?.connected) return;

    void (async () => {
      const token = await getStoredAccessToken();
      if (!token) return;

      const { url, path } = resolveSocketConfig();
      this.socket = io(url, {
        path,
        auth: { token, riderId: undefined },
        transports: ['polling', 'websocket'],
        reconnection: true,
      });

      this.socket.on('connect', () => {
        if (__DEV__) console.log('[SupportChatSocket] connected');
      });

      this.socket.on('support:message', (payload) => this.emitLocal('support:message', payload));
      this.socket.on('support:conversation:updated', (payload) =>
        this.emitLocal('support:conversation:updated', payload)
      );

      this.reattach();
    })();
  }

  private reattach() {
    if (!this.socket) return;
    this.listeners.forEach((set, event) => {
      set.forEach((cb) => this.socket!.on(event, cb));
    });
  }

  private emitLocal(event: string, payload: unknown) {
    this.listeners.get(event)?.forEach((cb) => cb(payload));
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinConversation(conversationId: string) {
    this.socket?.emit('support:join', { conversationId });
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('support:leave', { conversationId });
  }

  on(event: string, cb: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(cb);
    this.socket?.on(event, cb);
  }

  off(event: string, cb?: Listener) {
    if (cb) {
      this.listeners.get(event)?.delete(cb);
      this.socket?.off(event, cb);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }
}

export const supportChatSocket = new SupportChatSocketService();
