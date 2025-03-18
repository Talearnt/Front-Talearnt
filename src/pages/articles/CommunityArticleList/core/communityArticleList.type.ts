import {
  commonArticleDataType,
  postType
} from "@pages/articles/core/articles.type";
import { profileType } from "@type/user.type";

// 커뮤니티 목록 필터
export type communityArticleListFilterType = {
  postType?: postType;
  page: number;
};
// 커뮤니티 게시물
export type communityArticleType = Pick<
  profileType,
  "nickname" | "profileImg"
> &
  Omit<commonArticleDataType, "content"> & {
    communityPostNo: number;
    postType: postType;
    isLike: boolean;
    count: number;
    commentCount: number;
    likeCount: number;
  };
// {
//   "nickname": "",
//   "profileImg": null,
//   "communityPostNo": 0,
//   "createdAt": "",
//   "title": "",
//   "postType": "스터디 모집 게시판",
//   "isLike": false,
//   "count": 0,
//   "commentCount": 0,
//   "likeCount": 0,
// }
