import { getAPI } from "@shared/utils/apiMethods";

import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";
import { paginationRequestType, paginationType } from "@shared/type/api.type";

// 작성한 매칭 게시글 목록 조회
export const getWrittenMatchingArticleList = ({
  page,
}: paginationRequestType) =>
  getAPI<paginationType<matchingArticleType>>(
    "/v1/users/exchanges",
    { page, size: 9 },
    {
      withCredentials: true,
    }
  );

// 작성한 커뮤니티 게시글 목록 조회
export const getWrittenCommunityArticleList = ({
  page,
}: paginationRequestType) =>
  getAPI<paginationType<communityArticleType>>(
    "/v1/users/communities",
    { page, size: 9 },
    {
      withCredentials: true,
    }
  );
