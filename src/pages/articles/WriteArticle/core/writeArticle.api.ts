import { postAPI, putAPI } from "@utils/apiMethods";

import { matchingArticleType } from "@pages/articles/MatchingArticleList/core/matchingArticleList.type";
import {
  matchingArticleBodyType,
  presignedURLBodyType
} from "@pages/articles/WriteArticle/core/writeArticle.type";

export const postMatchingArticle = async (body: matchingArticleBodyType) =>
  await postAPI<number>("/v1/posts/exchanges", body, { withCredentials: true });

export const putMatchingArticle = async ({
  exchangePostNo,
  ...body
}: matchingArticleBodyType & Pick<matchingArticleType, "exchangePostNo">) =>
  await putAPI(`/v1/posts/exchanges/${exchangePostNo}`, body, {
    withCredentials: true
  });

export const postToGetPresignedURL = async (files: presignedURLBodyType[]) =>
  await postAPI<string[]>("/v1/uploads", files, { withCredentials: true });
