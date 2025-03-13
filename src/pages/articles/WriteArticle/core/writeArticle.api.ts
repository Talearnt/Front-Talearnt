import { postAPI } from "@utils/apiMethods";

import { presignedURLBodyType } from "@pages/articles/WriteArticle/core/writeArticle.type";

export const postToGetPresignedURL = async (files: presignedURLBodyType[]) =>
  await postAPI<string[]>("/v1/uploads", files, { withCredentials: true });
