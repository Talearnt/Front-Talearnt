import { postAPI } from "@shared/utils/apiMethods";

import { presignedURLBodyType } from "@features/articles/shared/writeArticle.type";

export const postToGetPresignedURL = (files: presignedURLBodyType[]) =>
  postAPI<string[]>("/v1/uploads", files, { withCredentials: true });
