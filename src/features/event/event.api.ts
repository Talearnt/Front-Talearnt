import { getAPI } from "@shared/utils/apiMethods";

import { eventType } from "@features/event/event.type";
import { paginationRequestType, paginationType } from "@shared/type/api.type";

// 이벤트 조회
export const getEventList = (data: paginationRequestType) =>
  getAPI<paginationType<eventType>>("v1/events", data);
