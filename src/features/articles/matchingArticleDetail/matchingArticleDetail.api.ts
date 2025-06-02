import { deleteAPI, getAPI } from "@shared/utils/apiMethods";

import { matchingArticleDetailType } from "@features/articles/matchingArticleDetail/matchingArticleDetail.type";

// 매칭 게시물 상세 정보 조회
export const getMatchingArticleDetail = (exchangePostNo: number) =>
  getAPI<matchingArticleDetailType>(`v1/posts/exchanges/${exchangePostNo}`);

// 매칭 게시물 삭제
export const deleteMatchingArticle = (exchangePostNo: number) =>
  deleteAPI(`v1/posts/exchanges/${exchangePostNo}`, {
    withCredentials: true,
  });
