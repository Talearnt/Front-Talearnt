import {
  commonArticleDataType,
  postType
} from "@features/articles/shared/articles.type";
import { profileType } from "@features/user/user.type";

// 커뮤니티 목록 필터
export type communityArticleListFilterType = {
  postType?: postType;
  order?: "hot";
  page: number;
};
// 커뮤니티 게시물
export type communityArticleType = Pick<
  profileType,
  "nickname" | "profileImg"
> &
  commonArticleDataType & {
    commentCount: number;
    communityPostNo: number;
    count: number;
    isLike: boolean;
    likeCount: number;
    postType: postType;
  };
// {
//   "commentCount": 0,
//   "communityPostNo": 0,
//   "content": "", order 가 hot 일 때만 넘어오는 필드
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
