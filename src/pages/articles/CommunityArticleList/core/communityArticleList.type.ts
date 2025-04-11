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
//   "commentCount": 0,
//   "communityPostNo": 0,
//   "count": 0,
//   "createdAt": "",
//   "isLike": false,
//   "likeCount": 0,
//   "nickname": "",
//   "postType": "스터디 모집 게시판",
//   "profileImg": null,
//   "title": "",
//   "updatedAt": ""
// }
