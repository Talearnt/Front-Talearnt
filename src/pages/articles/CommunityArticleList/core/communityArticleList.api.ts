import { getAPI } from "@utils/apiMethods";

import { paginationType } from "@common/common.type";
import {
  communityArticleListFilterType,
  communityArticleType
} from "@pages/articles/CommunityArticleList/core/communityArticleList.type";

export const getCommunityArticleList = async (
  filter: communityArticleListFilterType
) =>
  await getAPI<paginationType<communityArticleType>>("v1/posts/communities", {
    size: 12,
    ...filter
  });
