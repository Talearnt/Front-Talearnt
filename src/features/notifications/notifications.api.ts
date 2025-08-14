import { deleteAPI, getAPI, putAPI } from "@shared/utils/apiMethods";

import { notificationType } from "@features/notifications/notifications.type";

// 알림 목록 조회
export const getNotifications = async () =>
  getAPI<notificationType[]>("/notifications", undefined, {
    withCredentials: true,
  });

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationNos: number[]) =>
  putAPI(
    "/notifications/read",
    { notificationNos },
    {
      withCredentials: true,
    }
  );

// 알림 삭제
export const deleteNotification = async (notificationNos: number[]) =>
  deleteAPI("/notifications", {
    data: {
      notificationNos,
    },
    withCredentials: true,
  });
