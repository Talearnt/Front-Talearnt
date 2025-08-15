import { create } from "zustand/react";

import { notificationType } from "@features/notifications/notifications.type";

type NotificationStoreType = {
  // 알림 목록
  notifications: notificationType[];
  // 로딩 상태
  isLoading: boolean;
  // 알림 목록 설정
  setNotifications: (notifications: notificationType[]) => void;
  // 알림 추가
  addNotification: (notification: notificationType) => void;
  // 알림 읽음 처리
  markAsRead: (notificationNos: number[]) => void;
  // 알림 삭제
  removeNotification: (notificationNos: number[]) => void;
  // 로딩 상태 설정
  setLoading: (isLoading: boolean) => void;
  // 읽지 않은 알림 개수 조회
  getUnreadCount: () => number;
  // 읽지 않은 알림 플래그 조회
  getUnreadFlags: () => { all: boolean; keyword: boolean; comment: boolean };
  // 초기화
  reset: () => void;
};

const initialState = {
  notifications: [],
  isLoading: false,
};

export const useNotificationStore = create<NotificationStoreType>(
  (set, get) => ({
    ...initialState,

    setNotifications: notifications =>
      set({ notifications: notifications.slice(0, 50) }),

    addNotification: notification => {
      const { notifications } = get();

      const index = notifications.findIndex(
        n => n.notificationNo === notification.notificationNo
      );

      // 신규 → 맨 앞에 추가
      if (index === -1) {
        set({ notifications: [notification, ...notifications].slice(0, 50) });
        return;
      }

      // 기존 항목 갱신 + 맨 앞으로 이동
      const before = notifications.slice(0, index);
      const after = notifications.slice(index + 1);
      const bumped = [notification, ...before, ...after];
      if (bumped.length > 50) {
        bumped.length = 50;
      }
      set({ notifications: bumped });
    },
    markAsRead: notificationNos => {
      const { notifications } = get();

      const updatedNotifications = notifications.map(notification => {
        if (notificationNos.includes(notification.notificationNo)) {
          return { ...notification, isRead: true, unreadCount: 0 };
        }

        return notification;
      });

      set({ notifications: updatedNotifications });
    },
    removeNotification: notificationNos => {
      const { notifications } = get();

      const updatedNotifications = notifications.filter(
        notification => !notificationNos.includes(notification.notificationNo)
      );

      set({ notifications: updatedNotifications });
    },
    setLoading: isLoading => set({ isLoading }),
    getUnreadCount: () => {
      const { notifications } = get();
      return notifications.reduce((acc, n) => acc + (n.isRead ? 0 : 1), 0);
    },
    getUnreadFlags: () => {
      const { notifications } = get();
      let all = false;
      let keyword = false;
      let comment = false;
      for (const n of notifications) {
        if (!n.isRead) {
          all = true;
          if (n.notificationType === "관심 키워드") keyword = true;
          else comment = true;
          if (keyword && comment) break;
        }
      }
      return { all, keyword, comment };
    },
    reset: () => set(initialState),
  })
);
