import { getAPI } from "@shared/utils/apiMethods";

import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";
import { paginationRequestType, paginationType } from "@shared/type/api.type";

// 작성한 매칭 게시글 목록 조회
export const getWrittenMatchingArticleList = (data: paginationRequestType) =>
  getAPI<paginationType<matchingArticleType>>("/v1/posts/exchanges/mine", data);

// 작성한 커뮤니티 게시글 목록 조회
export const getWrittenCommunityArticleList = (data: paginationRequestType) =>
  getAPI<paginationType<communityArticleType>>(
    "/v1/posts/communities/mine",
    data
  );
