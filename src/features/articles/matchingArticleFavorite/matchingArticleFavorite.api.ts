import { postAPI } from "@shared/utils/apiMethods";

export const postMatchingArticleFavorite = (exchangePostNo: number) =>
  postAPI(`/v1/posts/exchanges/${exchangePostNo}/favorite`, undefined, {
    withCredentials: true,
  });
