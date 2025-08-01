import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import {
  commentType,
  replyType,
} from "@features/articles/shared/articles.type";

// 댓글
export type writtenCommentType = Pick<commentType, "commentNo"> &
  Pick<communityArticleType, "postType"> & {
    commentContent: string;
    commentCreatedAt: string;
    commentUpdatedAt?: string;
    postNo: number;
    postTitle: string;
  };
// {
//   "commentContent": "",
//   "commentCreatedAt": "",
//   "commentNo": 0,
//   "commentUpdatedAt": "",
//   "postNo": 0,
//   "postTitle": "",
//   "postType": "스터디 모집 게시판",
// }

// 답글
export type writtenReplyType = Pick<replyType, "replyNo"> &
  Pick<communityArticleType, "postType"> & {
    replyContent: string;
    replyCreatedAt: string;
    replyUpdatedAt?: string;
    postNo: number;
    postTitle: string;
  };
// {
//   "replyContent": "",
//   "replyCreatedAt": "",
//   "replyNo": 0,
//   "replyUpdatedAt": "",
//   "postNo": 0,
//   "postTitle": "",
//   "postType": "스터디 모집 게시판",
// }
