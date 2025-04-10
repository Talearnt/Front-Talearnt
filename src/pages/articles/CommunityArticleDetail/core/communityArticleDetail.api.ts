import { deleteAPI, getAPI, postAPI, putAPI } from "@utils/apiMethods";

import { paginationType } from "@common/common.type";
import { communityArticleDetailType } from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.type";
import {
  baseContentType,
  commentType,
  replyType
} from "@pages/articles/core/articles.type";

// 커뮤니티 게시물 상세 정보 조회
export const getCommunityArticleDetail = async (communityPostNo: number) =>
  await getAPI<communityArticleDetailType>(
    `v1/posts/communities/${communityPostNo}`
  );
// 커뮤니티 게시물 삭제
export const deleteCommunityArticle = async (communityPostNo: number) =>
  await deleteAPI(`v1/posts/communities/${communityPostNo}`, {
    withCredentials: true
  });

// 댓글 목록 조회
export const getCommunityArticleCommentList = async ({
  communityPostNo,
  page
}: Pick<communityArticleDetailType, "communityPostNo"> & {
  page: number;
}) =>
  await getAPI<paginationType<commentType>>(
    `/v1/communities/${communityPostNo}/comments`,
    { page }
  );
// 답글 목록 조회
export const getCommunityArticleReplyList = async ({
  commentNo,
  lastNo
}: Pick<commentType, "commentNo"> & {
  lastNo?: number;
}) =>
  await getAPI<paginationType<replyType>>(
    `/v1/communities/${commentNo}/replies`,
    { lastNo }
  );
// 댓글 작성
export const postCommunityArticleComment = async (
  comment: Pick<communityArticleDetailType, "communityPostNo"> &
    Pick<baseContentType, "content">
) =>
  await postAPI<paginationType<commentType>>(
    "/v1/communities/comments",
    comment,
    {
      withCredentials: true
    }
  );
// 답글 작성
export const postCommunityArticleReply = async (
  reply: Pick<commentType, "commentNo"> & Pick<baseContentType, "content">
) =>
  await postAPI<paginationType<replyType>>("/v1/communities/replies", reply, {
    withCredentials: true
  });
// 댓글 삭제
export const deleteCommunityArticleComment = async (commentNo: number) =>
  await deleteAPI(`v1/communities/comments/${commentNo}`, {
    withCredentials: true
  });
// 답글 삭제
export const deleteCommunityArticleReply = async (replyNo: number) =>
  await deleteAPI(`v1/communities/replies/${replyNo}`, {
    withCredentials: true
  });
//댓글 수정
export const putEditCommunityArticleComment = async ({
  commentNo,
  content
}: Pick<commentType, "commentNo" | "content">) =>
  await putAPI(
    `v1/communities/comments/${commentNo}`,
    { content },
    {
      withCredentials: true
    }
  );
//답글 수정
export const putEditCommunityArticleReply = async ({
  replyNo,
  content
}: Pick<replyType, "replyNo" | "content">) =>
  await putAPI(
    `v1/communities/replies/${replyNo}`,
    { content },
    {
      withCredentials: true
    }
  );
