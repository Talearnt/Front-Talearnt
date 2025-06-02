import { postAPI, putAPI } from "@shared/utils/apiMethods";

import {
  editMatchingArticleBodyType,
  matchingArticleBodyType,
} from "@features/articles/writeMatchingArticle/writeMatchingArticle.type";

// 매칭 게시글 작성
export const postMatchingArticle = (body: matchingArticleBodyType) =>
  postAPI<number>("/v1/posts/exchanges", body, { withCredentials: true });
// 매칭 게시글 수정
export const putEditMatchingArticle = ({
  exchangePostNo,
  ...body
}: editMatchingArticleBodyType) =>
  putAPI(`/v1/posts/exchanges/${exchangePostNo}`, body, {
    withCredentials: true,
  });
