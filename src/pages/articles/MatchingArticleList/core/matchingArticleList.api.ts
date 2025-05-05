import { getAPI } from "@utils/apiMethods";

import { paginationType } from "@common/common.type";
import {
  matchingArticleListFilterType,
  matchingArticleType
} from "@pages/articles/MatchingArticleList/core/matchingArticleList.type";

export const getMatchingArticleList = async ({
  size = 12,
  ...filter
}: Partial<matchingArticleListFilterType> & { size?: number }) =>
  await getAPI<paginationType<matchingArticleType>>("v1/posts/exchanges", {
    size,
    ...filter
  });
