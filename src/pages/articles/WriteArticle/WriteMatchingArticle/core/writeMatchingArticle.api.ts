import { postAPI, putAPI } from "@utils/apiMethods";

import {
  editMatchingArticleBodyType,
  matchingArticleBodyType
} from "@pages/articles/WriteArticle/WriteMatchingArticle/core/writeMatchingArticle.type";

// 매칭 게시글 작성
export const postMatchingArticle = async (body: matchingArticleBodyType) =>
  await postAPI<number>("/v1/posts/exchanges", body, { withCredentials: true });
// 매칭 게시글 수정
export const putEditMatchingArticle = async ({
  exchangePostNo,
  ...body
}: editMatchingArticleBodyType) =>
  await putAPI(`/v1/posts/exchanges/${exchangePostNo}`, body, {
    withCredentials: true
  });
