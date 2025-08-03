export type notificationStatusType = "UNREAD" | "READ";

export type notificationType = {
  id: string;
  title: string;
  message: string;
  status: notificationStatusType;
  createdAt: string;
};

export type notificationResponseType = {
  notifications: notificationType[];
  totalCount: number;
  unreadCount: number;
  hasMore: boolean;
};

// WebSocket으로 받는 실시간 알림 데이터
export type realtimeNotificationDataType = {
  notification: notificationType;
  unreadCount: number;
};
