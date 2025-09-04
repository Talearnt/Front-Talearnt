import { deleteAPI, getAPI } from "@shared/utils/apiMethods";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";

// 커뮤니티 게시물 상세 정보 조회
export const getCommunityArticleDetail = (communityPostNo: number) =>
  getAPI<communityArticleDetailType>(`v1/posts/communities/${communityPostNo}`);

// 커뮤니티 게시물 삭제
export const deleteCommunityArticle = (communityPostNo: number) =>
  deleteAPI(`v1/posts/communities/${communityPostNo}`, {
    withCredentials: true,
  });
