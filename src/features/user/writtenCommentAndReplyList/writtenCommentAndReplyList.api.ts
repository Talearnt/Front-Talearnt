import { getAPI } from "@shared/utils/apiMethods";

import {
  writtenCommentType,
  writtenReplyType,
} from "@features/user/writtenCommentAndReplyList/writtenCommentAndReplyList.type";
import { paginationRequestType, paginationType } from "@shared/type/api.type";

// 작성한 댓글 목록 조회
export const getWrittenCommentList = ({ page }: paginationRequestType) =>
  getAPI<paginationType<writtenCommentType>>(
    "/v1/users/comments",
    { page, size: 5 },
    {
      withCredentials: true,
    }
  );

// 작성한 답변 목록 조회
export const getWrittenReplyList = ({ page }: paginationRequestType) =>
  getAPI<paginationType<writtenReplyType>>(
    "/v1/users/replies",
    { page, size: 5 },
    {
      withCredentials: true,
    }
  );
