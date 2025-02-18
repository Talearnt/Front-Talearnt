import { getAPI } from "@utils/apiMethods";

import { paginationType } from "@common/common.type";
import { matchingArticleType } from "@pages/articles/MatchingArticleList/core/matchingArticleList.type";

export const getMatchingArticleList = async () =>
  await getAPI<paginationType<matchingArticleType>>("v1/posts/exchanges");
