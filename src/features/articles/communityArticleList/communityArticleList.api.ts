import { getAPI } from "@shared/utils/apiMethods";

import {
  communityArticleListFilterType,
  communityArticleType,
} from "@features/articles/communityArticleList/communityArticleList.type";
import { paginationType } from "@shared/type/api.type";

export const getCommunityArticleList = ({
  size = 12,
  ...filter
}: Partial<communityArticleListFilterType> & { size?: number }) =>
  getAPI<paginationType<communityArticleType>>("v1/posts/communities", {
    size,
    ...filter,
  });
