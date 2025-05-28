import { postAPI, putAPI } from "@shared/utils/apiMethods";

import {
  communityArticleBodyType,
  editCommunityArticleBodyType
} from "@features/articles/writeCommunityArticle/writeCommunityArticle.type";

// 커뮤니티 게시글 작성
export const postCommunityArticle = (body: communityArticleBodyType) =>
  postAPI<number>("/v1/posts/communities", body, {
    withCredentials: true
  });
// 커뮤니티 게시글 수정
export const putEditCommunityArticle = ({
  communityPostNo,
  ...body
}: editCommunityArticleBodyType) =>
  putAPI(`/v1/posts/communities/${communityPostNo}`, body, {
    withCredentials: true
  });
