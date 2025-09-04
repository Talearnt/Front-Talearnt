import { deleteAPI, getAPI, postAPI, putAPI } from "@shared/utils/apiMethods";

import {
  baseContentType,
  commentType,
  replyType,
} from "@features/articles/shared/articles.type";
import { paginationType } from "@shared/type/api.type";

// 커뮤니티 게시글 답글 작성
export const postCommunityArticleReply = (
  reply: Pick<commentType, "commentNo"> & Pick<baseContentType, "content">
) =>
  postAPI<replyType>("/v1/communities/replies", reply, {
    withCredentials: true,
  });

// 커뮤니티 게시글 답글 목록 조회
export const getCommunityArticleReplyList = ({
  commentNo,
  lastNo,
}: Pick<commentType, "commentNo"> & {
  lastNo?: number;
}) =>
  getAPI<paginationType<replyType>>(`/v1/communities/${commentNo}/replies`, {
    lastNo,
  });

// 커뮤니티 게시글 답글 수정
export const putEditCommunityArticleReply = ({
  replyNo,
  content,
}: Pick<replyType, "replyNo" | "content">) =>
  putAPI<null>(
    `v1/communities/replies/${replyNo}`,
    { content },
    {
      withCredentials: true,
    }
  );

// 커뮤니티 게시글 답글 삭제
export const deleteCommunityArticleReply = (replyNo: number) =>
  deleteAPI(`v1/communities/replies/${replyNo}`, {
    withCredentials: true,
  });
