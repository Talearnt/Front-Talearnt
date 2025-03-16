import { postAPI, putAPI } from "@utils/apiMethods";

import {
  communityArticleBodyType,
  editCommunityArticleBodyType
} from "@pages/articles/WriteArticle/WriteCommunityArticle/core/writeCommunityArticle.type";

// 커뮤니티 게시글 작성
export const postCommunityArticle = async (body: communityArticleBodyType) =>
  await postAPI<number>("/v1/posts/communities", body, {
    withCredentials: true
  });
// 커뮤니티 게시글 수정
export const putEditCommunityArticle = async ({
  communityPostNo,
  ...body
}: editCommunityArticleBodyType) =>
  await putAPI(`/v1/posts/communities/${communityPostNo}`, body, {
    withCredentials: true
  });
