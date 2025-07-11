import { getAPI } from "@shared/utils/apiMethods";

import { noticeType } from "@features/notice/notice.type";
import { paginationRequestType, paginationType } from "@shared/type/api.type";

// 공지사항 조회
export const getNoticeList = (data: paginationRequestType) =>
  getAPI<paginationType<noticeType>>("/v1/notices", data);
