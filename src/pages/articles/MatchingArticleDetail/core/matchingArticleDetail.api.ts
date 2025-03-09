import { deleteAPI, getAPI } from "@utils/apiMethods";

import { matchingArticleDetailType } from "@pages/articles/MatchingArticleDetail/core/matchingArticleDetail.type";

// 매칭 게시물 상세 정보 조회
export const getMatchingArticleDetail = async (exchangePostNo: number) =>
  await getAPI<matchingArticleDetailType>(
    `v1/posts/exchanges/${exchangePostNo}`
  );

// 매칭 게시물 삭제
export const deleteMatchingArticle = async (exchangePostNo: number) =>
  await deleteAPI(`v1/posts/exchanges/${exchangePostNo}`, {
    withCredentials: true
  });
