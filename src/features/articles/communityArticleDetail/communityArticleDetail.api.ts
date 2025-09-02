import { deleteAPI, getAPI, postAPI, putAPI } from "@shared/utils/apiMethods";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import {
  baseContentType,
  commentType,
  replyType,
} from "@features/articles/shared/articles.type";
import { paginationType } from "@shared/type/api.type";

// 커뮤니티 게시물 상세 정보 조회
export const getCommunityArticleDetail = (communityPostNo: number) =>
  getAPI<communityArticleDetailType>(`v1/posts/communities/${communityPostNo}`);
// 커뮤니티 게시물 삭제
export const deleteCommunityArticle = (communityPostNo: number) =>
  deleteAPI(`v1/posts/communities/${communityPostNo}`, {
    withCredentials: true,
  });

// ***********************
// 댓글 관련 api
// ***********************

// 댓글 작성
export const postCommunityArticleComment = (
  comment: Pick<communityArticleDetailType, "communityPostNo"> &
    Pick<baseContentType, "content">
) =>
  postAPI<commentType>("/v1/communities/comments", comment, {
    withCredentials: true,
  });

// 댓글 목록 조회
export const getCommunityArticleCommentList = ({
  communityPostNo,
  ...data
}: Pick<communityArticleDetailType, "communityPostNo"> & {
  page: number;
}) =>
  getAPI<paginationType<commentType>>(
    `/v1/communities/${communityPostNo}/comments`,
    data
  );

//댓글 수정
export const putEditCommunityArticleComment = ({
  commentNo,
  content,
}: Pick<commentType, "commentNo" | "content">) =>
  putAPI<null>(
    `v1/communities/comments/${commentNo}`,
    { content },
    {
      withCredentials: true,
    }
  );

// 댓글 삭제
export const deleteCommunityArticleComment = (commentNo: number) =>
  deleteAPI(`v1/communities/comments/${commentNo}`, {
    withCredentials: true,
  });

// ***********************
// 답글 관련 api
// ***********************

// 답글 작성
export const postCommunityArticleReply = (
  reply: Pick<commentType, "commentNo"> & Pick<baseContentType, "content">
) =>
  postAPI<replyType>("/v1/communities/replies", reply, {
    withCredentials: true,
  });

// 답글 목록 조회
export const getCommunityArticleReplyList = ({
  commentNo,
  lastNo,
}: Pick<commentType, "commentNo"> & {
  lastNo?: number;
}) =>
  getAPI<paginationType<replyType>>(`/v1/communities/${commentNo}/replies`, {
    lastNo,
  });

//답글 수정
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

// 답글 삭제
export const deleteCommunityArticleReply = (replyNo: number) =>
  deleteAPI(`v1/communities/replies/${replyNo}`, {
    withCredentials: true,
  });
