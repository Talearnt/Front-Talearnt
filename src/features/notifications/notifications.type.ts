export type notificationStatusType = "UNREAD" | "READ";

export type notificationType = {
  content: string;
  createdAt: string;
  isRead: boolean;
  notificationNo: number;
  notificationType: "댓글" | "답글" | "관심 키워드";
  senderNickname: string;
  talentCodes: number[];
  targetNo: number;
  unreadCount: number;
};
