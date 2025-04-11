import { communityArticleType } from "@pages/articles/CommunityArticleList/core/communityArticleList.type";
import { commonArticleDataType } from "@pages/articles/core/articles.type";
import { profileType } from "@type/user.type";

export type communityArticleDetailType = Pick<profileType, "userNo"> &
  Pick<commonArticleDataType, "content"> &
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
