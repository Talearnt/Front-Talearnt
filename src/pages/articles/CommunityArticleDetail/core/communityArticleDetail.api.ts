import { deleteAPI, getAPI } from "@utils/apiMethods";

import { paginationType } from "@common/common.type";
import { communityArticleDetailType } from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.type";
import { commentType, replyType } from "@pages/articles/core/articles.type";

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
