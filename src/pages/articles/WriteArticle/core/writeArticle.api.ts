import { postAPI } from "@utils/apiMethods";

import {
  matchArticleBodyType,
  presignedURLBodyType
} from "@pages/articles/WriteArticle/core/writeArticle.type";

// TODO 커뮤니티용 body 가져오기
export const postArticle = async (body: matchArticleBodyType) =>
  await postAPI("/v1/posts/exchanges", body, { withCredentials: true });

export const postToGetPresignedURL = async (files: presignedURLBodyType[]) =>
  await postAPI<string[]>("/v1/uploads", files, { withCredentials: true });
