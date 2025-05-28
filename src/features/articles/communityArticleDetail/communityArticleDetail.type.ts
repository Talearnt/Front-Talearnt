import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import { profileType } from "@features/user/user.type";

export type communityArticleDetailType = Pick<profileType, "userNo"> &
  Omit<communityArticleType, "commentCount"> & {
    commentLastPage: number;
    imageUrls: string[];
  };
// {
//   "commentLastPage": 0,
//   "communityPostNo": 0,
//   "content": "",
//   "count": 0,
//   "createdAt: "2025-03-21T18:45:30.998488"
//   "imageUrls": [],
//   "isLike": false,
//   "likeCount": 0,
//   "nickname": "",
//   "postType": "스터디 모집 게시판",
//   "profileImg": null,
//   "title": "",
//   "updatedAt": "",
//   "userNo": 0,
// }
