import { eventNoticeTabType } from "./eventNotice.type";

export const eventNoticeTabOptions: {
  label: string;
  value: eventNoticeTabType;
}[] = [
  { label: "이벤트", value: "event" },
  { label: "공지사항", value: "notice" },
];
