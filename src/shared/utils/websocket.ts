import {
  Client,
  IMessage,
  StompHeaders,
  StompSubscription,
} from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { useAuthStore } from "@store/user.store";

type webSocketConfigType = {
  endpoint: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: unknown) => void;
  debug?: boolean;
};

type subscriptionConfigType = {
  destination: string;
  callback: (message: IMessage) => void;
};

class WebSocketManager {
  private client: Client | null = null;
  private subscriptions = new Map<string, StompSubscription>();
  private config: webSocketConfigType | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private reconnectTimer: NodeJS.Timeout | null = null;

  /**
   * WebSocket 연결을 설정합니다.
   */
  connect(config: webSocketConfigType): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.config = config;
        this.client = new Client({
          webSocketFactory: () => new SockJS(config.endpoint),
          connectHeaders: this.getConnectHeaders(),
          // debug: config.debug ? this.debugLog.bind(this) : undefined,
          reconnectDelay: 0, // 자동 재연결 비활성화 (수동으로 관리)
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            this.reconnectAttempts = 0;
            config.onConnect?.();
            resolve();
          },
          onDisconnect: () => {
            config.onDisconnect?.();
            this.handleReconnect();
          },
          onStompError: frame => {
            const error = new Error(`STOMP error: ${frame.headers.message}`);
            config.onError?.(error);
            reject(error);
          },
          onWebSocketError: error => {
            config.onError?.(error);
            reject(error);
          },
        });

        this.client.activate();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * WebSocket 연결을 해제합니다.
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.subscriptions.clear();

    if (this.client?.connected) {
      void this.client.deactivate();
    }

    this.client = null;
    this.config = null;
    this.reconnectAttempts = 0;
  }

  /**
   * 토픽을 구독합니다.
   */
  subscribe(config: subscriptionConfigType): string | null {
    if (!this.client?.connected) {
      console.warn("WebSocket is not connected. Cannot subscribe to topic.");
      return null;
    }

    try {
      const subscription = this.client.subscribe(
        config.destination,
        config.callback
      );

      const subscriptionId = `${config.destination}_${Date.now()}`;
      this.subscriptions.set(subscriptionId, subscription);

      return subscriptionId;
    } catch (error) {
      console.error(
        `Failed to subscribe to topic ${config.destination}:`,
        error
      );
      return null;
    }
  }

  /**
   * 구독을 해제합니다.
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
    } else {
      console.warn(`Subscription with ID ${subscriptionId} not found.`);
    }
  }

  /**
   * 메시지를 전송합니다.
   */
  sendMessage(destination: string, body: unknown, headers?: unknown): void {
    if (!this.client?.connected) {
      console.warn("WebSocket is not connected. Cannot send message.");
      return;
    }

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
        headers: headers as StompHeaders,
      });
      console.log(`Message sent to ${destination}:`, body);
    } catch (error) {
      console.error(`Failed to send message to ${destination}:`, error);
    }
  }

  /**
   * 현재 연결 상태를 반환합니다.
   */
  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  /**
   * 연결 헤더를 생성합니다.
   */
  private getConnectHeaders(): StompHeaders {
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      throw new Error("Access token is required for WebSocket connection");
    }

    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  /**
   * 재연결 로직을 처리합니다.
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached. Giving up.");
      return;
    }

    if (!this.config) {
      console.warn("No config found for reconnection.");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * this.reconnectAttempts;

    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`
    );

    this.reconnectTimer = setTimeout(() => {
      if (this.config) {
        this.connect(this.config).catch((error: unknown) => {
          console.error("Reconnection failed:", error);
        });
      }
    }, delay);
  }

  /**
   * 디버그 로그를 출력합니다.
   */
  // private debugLog(str: string): void {
  //   console.log("STOMP Debug:", str);
  // }
}

// 싱글톤 인스턴스
export const webSocketManager = new WebSocketManager();

// 편의 함수들
export const connectWebSocket = (config: webSocketConfigType) =>
  webSocketManager.connect(config);

export const disconnectWebSocket = () => webSocketManager.disconnect();

export const subscribeToTopic = (config: subscriptionConfigType) =>
  webSocketManager.subscribe(config);

export const unsubscribeFromTopic = (subscriptionId: string) =>
  webSocketManager.unsubscribe(subscriptionId);

export const sendWebSocketMessage = (
  destination: string,
  body: unknown,
  headers?: unknown
) => webSocketManager.sendMessage(destination, body, headers);

export const isWebSocketConnected = () => webSocketManager.isConnected();
