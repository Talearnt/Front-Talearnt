import { getAPI } from "@shared/utils/apiMethods";

import {
  matchingArticleListFilterType,
  matchingArticleType
} from "@features/articles/matchingArticleList/matchingArticleList.type";
import { paginationType } from "@shared/type/api.type";

export const getMatchingArticleList = ({
  size = 12,
  ...filter
}: Partial<matchingArticleListFilterType> & { size?: number }) =>
  getAPI<paginationType<matchingArticleType>>("v1/posts/exchanges", {
    size,
    ...filter
  });
