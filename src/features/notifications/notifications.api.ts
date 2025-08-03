import { deleteAPI, getAPI, patchAPI } from "@shared/utils/apiMethods";

import { notificationResponseType } from "@features/notifications/notifications.type";

// 알림 목록 조회
export const getNotifications = async () =>
  getAPI<notificationResponseType>("/notifications", undefined, {
    withCredentials: true,
  });

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId: string) =>
  patchAPI(`/notifications/${notificationId}/read`, undefined, {
    withCredentials: true,
  });

// 모든 알림 읽음 처리
export const markAllNotificationsAsRead = async () =>
  patchAPI("/notifications/read-all", undefined, { withCredentials: true });

// 알림 삭제
export const deleteNotification = async (notificationId: string) =>
  deleteAPI(`/notifications/${notificationId}`, {
    withCredentials: true,
  });

// 읽지 않은 알림 개수 조회
export const getUnreadNotificationCount = async () =>
  getAPI<number>("/notifications/unread-count", undefined, {
    withCredentials: true,
  });
