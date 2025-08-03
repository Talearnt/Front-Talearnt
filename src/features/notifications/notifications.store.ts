import { create } from "zustand/react";

import { notificationType } from "@features/notifications/notifications.type";

type NotificationStoreType = {
  // 알림 목록
  notifications: notificationType[];
  // 읽지 않은 알림 개수
  unreadCount: number;
  // WebSocket 연결 상태
  isConnected: boolean;
  // 로딩 상태
  isLoading: boolean;
  // 알림 목록 설정
  setNotifications: (notifications: notificationType[]) => void;
  // 알림 추가
  addNotification: (notification: notificationType) => void;
  // 알림 읽음 처리
  markAsRead: (notificationId: string) => void;
  // 모든 알림 읽음 처리
  markAllAsRead: () => void;
  // 알림 삭제
  removeNotification: (notificationId: string) => void;
  // 읽지 않은 알림 개수 설정
  setUnreadCount: (count: number) => void;
  // WebSocket 연결 상태 설정
  setConnectionStatus: (isConnected: boolean) => void;
  // 로딩 상태 설정
  setLoading: (isLoading: boolean) => void;
  // 초기화
  reset: () => void;
};

const initialState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  isLoading: false,
};

export const useNotificationStore = create<NotificationStoreType>(
  (set, get) => ({
    ...initialState,

    setNotifications: notifications => set({ notifications }),

    addNotification: notification => {
      const { notifications, unreadCount } = get();

      // 중복 알림 체크
      const exists = notifications.some(n => n.id === notification.id);
      if (exists) {
        return;
      }

      const newNotifications = [notification, ...notifications];
      const newUnreadCount =
        notification.status === "UNREAD" ? unreadCount + 1 : unreadCount;

      set({
        notifications: newNotifications,
        unreadCount: newUnreadCount,
      });
    },

    markAsRead: notificationId => {
      const { notifications, unreadCount } = get();

      const updatedNotifications = notifications.map(notification => {
        if (
          notification.id === notificationId &&
          notification.status === "UNREAD"
        ) {
          return { ...notification, status: "READ" as const };
        }
        return notification;
      });

      const wasUnread =
        notifications.find(n => n.id === notificationId)?.status === "UNREAD";
      const newUnreadCount = wasUnread
        ? Math.max(0, unreadCount - 1)
        : unreadCount;

      set({
        notifications: updatedNotifications,
        unreadCount: newUnreadCount,
      });
    },

    markAllAsRead: () => {
      const { notifications } = get();

      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        status: "READ" as const,
      }));

      set({
        notifications: updatedNotifications,
        unreadCount: 0,
      });
    },

    removeNotification: notificationId => {
      const { notifications, unreadCount } = get();

      const notificationToRemove = notifications.find(
        n => n.id === notificationId
      );
      const updatedNotifications = notifications.filter(
        n => n.id !== notificationId
      );

      const newUnreadCount =
        notificationToRemove?.status === "UNREAD"
          ? Math.max(0, unreadCount - 1)
          : unreadCount;

      set({
        notifications: updatedNotifications,
        unreadCount: newUnreadCount,
      });
    },

    setUnreadCount: count => set({ unreadCount: Math.max(0, count) }),

    setConnectionStatus: isConnected => set({ isConnected }),

    setLoading: isLoading => set({ isLoading }),

    reset: () => set(initialState),
  })
);
