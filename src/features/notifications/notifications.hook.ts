import { useCallback, useEffect, useRef } from "react";

import { IMessage } from "@stomp/stompjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@features/notifications/notifications.api";

import {
  connectWebSocket,
  disconnectWebSocket,
  isWebSocketConnected,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "@shared/utils/websocket";

import { useNotificationStore } from "@features/notifications/notifications.store";
import { useAuthStore } from "@store/user.store";

import { realtimeNotificationDataType } from "@features/notifications/notifications.type";

const WEBSOCKET_ENDPOINT = "https://api.talearnt.net/ws";

/**
 * 실시간 알림 기능을 관리하는 훅
 */
export const useRealtimeNotifications = () => {
  const { isLoggedIn } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    addNotification,
    setConnectionStatus,
    setLoading,
    reset,
  } = useNotificationStore();

  const subscriptionIdRef = useRef<string | null>(null);

  // 실시간 알림 메시지 처리
  const handleNotificationMessage = useCallback(
    (message: IMessage) => {
      try {
        const data: realtimeNotificationDataType = JSON.parse(message.body);
        console.log("Received notification:", data);

        // 새로운 알림을 store에 추가
        addNotification(data.notification);

        // 필요시 브라우저 알림 표시
        if (Notification.permission === "granted") {
          new Notification(data.notification.title, {
            body: data.notification.message,
            icon: "/favicon.ico",
          });
        }
      } catch (error) {
        console.error("Failed to parse notification message:", error);
      }
    },
    [addNotification]
  );

  // WebSocket 연결 함수
  const connectToWebSocket = useCallback(async () => {
    if (!isLoggedIn) {
      console.log("User not logged in, skipping WebSocket connection");
      return;
    }

    if (isWebSocketConnected()) {
      console.log("WebSocket already connected");
      return;
    }

    try {
      setLoading(true);

      await connectWebSocket({
        endpoint: WEBSOCKET_ENDPOINT,
        onConnect: () => {
          console.log("Successfully connected to notification WebSocket");
          setConnectionStatus(true);

          // 알림 토픽 구독
          const subscriptionId = subscribeToTopic({
            destination: "/user/queue/notifications",
            callback: handleNotificationMessage,
          });

          subscriptionIdRef.current = subscriptionId;
        },
        onDisconnect: () => {
          console.log("Disconnected from notification WebSocket");
          setConnectionStatus(false);
          subscriptionIdRef.current = null;
        },
        onError: error => {
          console.error("WebSocket connection error:", error);
          setConnectionStatus(false);
        },
        debug: import.meta.env.MODE !== "production",
      });
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      setConnectionStatus(false);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, setConnectionStatus, setLoading, handleNotificationMessage]);

  // WebSocket 연결 해제 함수
  const disconnectFromWebSocket = useCallback(() => {
    if (subscriptionIdRef.current) {
      unsubscribeFromTopic(subscriptionIdRef.current);
      subscriptionIdRef.current = null;
    }
    disconnectWebSocket();
    setConnectionStatus(false);
  }, [setConnectionStatus]);

  // 로그인 상태 변화에 따른 WebSocket 연결/해제
  useEffect(() => {
    if (isLoggedIn) {
      void connectToWebSocket();
    } else {
      disconnectFromWebSocket();
      reset();
    }

    return () => {
      disconnectFromWebSocket();
    };
  }, [isLoggedIn, connectToWebSocket, disconnectFromWebSocket, reset]);

  return {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    connectToWebSocket,
    disconnectFromWebSocket,
  };
};

/**
 * 알림 목록을 관리하는 훅
 */
export const useNotifications = () => {
  const queryClient = useQueryClient();

  // 알림 목록 조회
  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    enabled: useAuthStore.getState().isLoggedIn,
  });

  // 읽지 않은 알림 개수 조회
  const { data: unreadCountData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => getUnreadNotificationCount(),
    enabled: useAuthStore.getState().isLoggedIn,
    refetchInterval: 30000, // 30초마다 갱신
  });

  // 알림 읽음 처리
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });

  // 모든 알림 읽음 처리
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });

  // 알림 삭제
  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });

  return {
    notifications: notificationsData?.data.notifications || [],
    totalCount: notificationsData?.data.totalCount || 0,
    unreadCount: unreadCountData?.data || 0,
    hasMore: notificationsData?.data.hasMore || false,
    isLoading,
    isError,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeletingNotification: deleteNotificationMutation.isPending,
  };
};

/**
 * 브라우저 알림 권한을 요청하는 훅
 */
export const useNotificationPermission = () => {
  const requestPermission = useCallback(async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }, []);

  const hasPermission =
    "Notification" in window && Notification.permission === "granted";

  return {
    hasPermission,
    requestPermission,
  };
};
