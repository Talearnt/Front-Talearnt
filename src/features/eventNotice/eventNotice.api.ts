import { getAPI } from "@shared/utils/apiMethods";

import {
  eventDetailType,
  eventType,
  noticeDetailType,
  noticeType,
} from "@features/eventNotice/eventNotice.type";
import { paginationRequestType, paginationType } from "@shared/type/api.type";

// 이벤트 조회
export const getEventList = (data: paginationRequestType) =>
  getAPI<paginationType<eventType>>("v1/events", data);

// 공지사항 조회
export const getNoticeList = (data: paginationRequestType) =>
  getAPI<paginationType<noticeType>>("/v1/notices", data);

// 이벤트 상세 조회
export const getEventDetail = (eventNo: number) =>
  getAPI<eventDetailType>(`v1/events/${eventNo}`);

// 공지사항 상세 조회
export const getNoticeDetail = (noticeNo: number) =>
  getAPI<noticeDetailType>(`v1/notices/${noticeNo}`);
