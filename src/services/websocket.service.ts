/**
 * WebSocket service for Rider app – real-time order updates from rider_v2 backend.
 * The rider backend exposes a native WebSocket endpoint at /ws, not Socket.IO.
 */

import { getWebSocketBaseUrl } from '../api/config';

type Listener = (data: unknown) => void;
type BackendMessage = {
  type?: string;
  payload?: unknown;
  timestamp?: string;
};

const REFRESH_EVENTS = new Set([
  'order_assignment_update',
  'order_update',
  'status_update',
  'eta_update',
  'location_update',
]);

function getWebSocketUrl(riderId: string): string | null {
  try {
    const wsBase = getWebSocketBaseUrl();
    if (!wsBase) {
      if (__DEV__) {
        console.warn('[Rider WebSocket] Skipping connect: no WS or API base URL');
      }
      return null;
    }

    const url = new URL(wsBase);
    if (url.protocol === 'http:') url.protocol = 'ws:';
    if (url.protocol === 'https:') url.protocol = 'wss:';

    // Default path to /ws if not provided explicitly.
    if (!url.pathname || url.pathname === '/') {
      url.pathname = '/ws';
    }

    url.searchParams.set('userId', riderId);
    url.searchParams.set('userType', 'rider');
    return url.toString();
  } catch {
    return null;
  }
}

class RiderWebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<Listener>> = new Map();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 30;
  private readonly reconnectDelayMs = 2000;
  private activeRiderId: string | null = null;
  private shouldReconnect = false;

  connect(riderId: string) {
    if (!riderId) return;

    if (this.activeRiderId && this.activeRiderId !== riderId) {
      this.disconnect();
    }

    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) &&
      this.activeRiderId === riderId
    ) {
      return;
    }

    const wsUrl = getWebSocketUrl(riderId);
    if (!wsUrl) {
      if (__DEV__) {
        console.warn('[Rider WebSocket] Skipping connect: API base URL is unavailable');
      }
      return;
    }

    this.clearReconnectTimer();
    this.shouldReconnect = true;
    this.activeRiderId = riderId;

    const socket = new WebSocket(wsUrl);
    this.socket = socket;

    socket.onopen = () => {
      this.reconnectAttempts = 0;
      if (__DEV__) {
        console.log('[Rider WebSocket] Connected');
      }
    };

    socket.onmessage = (event) => {
      const message = this.parseMessage(event.data);
      if (!message?.type) return;

      this.emit(message.type, message.payload);

      if (REFRESH_EVENTS.has(message.type)) {
        this.emit('orders:refresh', message.payload);
      }
    };

    socket.onerror = () => {
      // In dev, log only the first connection error to avoid noisy spam when
      // the backend /ws endpoint is not available.
      if (__DEV__ && this.reconnectAttempts === 0) {
        console.warn('[Rider WebSocket] Connection error');
      }
    };

    socket.onclose = (event) => {
      if (this.socket === socket) {
        this.socket = null;
      }

      // Only log abnormal closures in dev. 1000 (normal) and 1001 (stream end)
      // are expected when the backend restarts or intentionally closes idle
      // connections, so we keep them silent to avoid confusing noise.
      if (
        __DEV__ &&
        this.reconnectAttempts === 0 &&
        event.code !== 1000 &&
        event.code !== 1001
      ) {
        console.log(
          '[Rider WebSocket] Disconnected:',
          event.code,
          event.reason || 'no reason'
        );
      }

      // Only stop reconnecting on intentional server shutdown (1001). For 1006
      // (abnormal closure, e.g. network blip), keep reconnecting so push works.
      if (event.code === 1001) {
        this.shouldReconnect = false;
        return;
      }

      if (this.shouldReconnect && this.activeRiderId) {
        this.scheduleReconnect(this.activeRiderId);
      }
    };
  }

  private parseMessage(data: string | ArrayBuffer | Blob): BackendMessage | null {
    if (typeof data !== 'string') return null;

    try {
      return JSON.parse(data) as BackendMessage;
    } catch {
      if (__DEV__) {
        console.warn('[Rider WebSocket] Ignoring non-JSON message');
      }
      return null;
    }
  }

  private scheduleReconnect(riderId: string) {
    if (this.reconnectTimer || this.reconnectAttempts >= this.maxReconnectAttempts) return;

    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect(riderId);
    }, this.reconnectDelayMs);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private emit(event: string, payload: unknown) {
    this.listeners.get(event)?.forEach((callback) => {
      callback(payload);
    });
  }

  disconnect() {
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    this.reconnectAttempts = 0;
    this.activeRiderId = null;

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  on(event: string, callback: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback?: Listener) {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      return;
    }

    this.listeners.get(event)?.clear();
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const riderWebSocketService = new RiderWebSocketService();
