import { postAPI } from "@shared/utils/apiMethods";

import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";

export const postMatchingArticleFavorite = ({
  exchangePostNo,
  isFavorite,
}: Pick<matchingArticleType, "exchangePostNo" | "isFavorite">) =>
  postAPI(
    `/v1/posts/exchanges/${exchangePostNo}/favorite`,
    { favorite: isFavorite },
    {
      withCredentials: true,
    }
  );
