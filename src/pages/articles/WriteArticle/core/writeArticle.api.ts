import { postAPI } from "@utils/apiMethods";

import { matchArticleBodyType } from "@pages/articles/WriteArticle/core/writeArticle.type";

// TODO 커뮤니티용 body 가져오기
export const postArticle = async (body: matchArticleBodyType) =>
  await postAPI("/v1/posts/exchanges", body, { withCredentials: true });
