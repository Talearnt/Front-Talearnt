import { deleteAPI, getAPI, postAPI, putAPI } from "@shared/utils/apiMethods";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import {
  baseContentType,
  commentType,
} from "@features/articles/shared/articles.type";
import { paginationType } from "@shared/type/api.type";

// 커뮤니티 게시글 댓글 작성
export const postCommunityArticleComment = (
  comment: Pick<communityArticleDetailType, "communityPostNo"> &
    Pick<baseContentType, "content">
) =>
  postAPI<commentType>("/v1/communities/comments", comment, {
    withCredentials: true,
  });

// 커뮤니티 게시글 댓글 목록 조회
export const getCommunityArticleCommentList = ({
  communityPostNo,
  ...data
}: Pick<communityArticleDetailType, "communityPostNo"> & {
  page: number;
}) =>
  getAPI<paginationType<commentType>>(
    `/v1/communities/${communityPostNo}/comments`,
    data
  );

// 커뮤니티 게시글 댓글 수정
export const putEditCommunityArticleComment = ({
  commentNo,
  content,
}: Pick<commentType, "commentNo" | "content">) =>
  putAPI<null>(
    `v1/communities/comments/${commentNo}`,
    { content },
    {
      withCredentials: true,
    }
  );

// 커뮤니티 게시글 댓글 삭제
export const deleteCommunityArticleComment = (commentNo: number) =>
  deleteAPI(`v1/communities/comments/${commentNo}`, {
    withCredentials: true,
  });
