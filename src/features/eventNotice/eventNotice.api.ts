import { getAPI } from "@shared/utils/apiMethods";

import { eventType, noticeType } from "@features/eventNotice/eventNotice.type";
import { paginationRequestType, paginationType } from "@shared/type/api.type";

// 이벤트 조회
export const getEventList = (data: paginationRequestType) =>
  getAPI<paginationType<eventType>>("v1/events", data);

// 공지사항 조회
export const getNoticeList = (data: paginationRequestType) =>
  getAPI<paginationType<noticeType>>("/v1/notices", data);
