import { deleteAPI, getAPI } from "@utils/apiMethods";

import { communityArticleDetailType } from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.type";

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
