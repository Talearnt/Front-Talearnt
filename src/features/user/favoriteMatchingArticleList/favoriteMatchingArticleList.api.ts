import { getAPI } from "@shared/utils/apiMethods";

import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";
import { paginationRequestType, paginationType } from "@shared/type/api.type";

// 찜 매칭 게시물 목록 조회
export const getFavoriteMatchingArticleList = (data: paginationRequestType) =>
  getAPI<paginationType<matchingArticleType>>(
    "/v1/posts/exchanges/favorites",
    data,
    { withCredentials: true }
  );
