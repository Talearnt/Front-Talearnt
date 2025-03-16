import { communityArticleType } from "@pages/articles/CommunityArticleList/core/communityArticleList.type";
import { commonArticleDataType } from "@pages/articles/core/articles.type";
import { profileType } from "@type/user.type";

export type communityArticleDetailType = Pick<profileType, "userNo"> &
  Pick<commonArticleDataType, "content"> &
  communityArticleType & {
    communityPostNo: number;
    imageUrls: string[];
    isLike: false;
    count: number;
    likeCount: number;
    commentCount: number;
  };

// {
//   "userNo": 0,
//   "nickname": "",
//   "profileImg": null,
//   "communityPostNo": 0,
//   "createdAt": "",
//   "title": "",
//   "content": "",
//   "imageUrls": [],
//   "postType": "스터디 모집 게시판",
//   "isLike": false,
//   "count": 0,
//   "commentCount": 0,
//   "likeCount": 0,
// }
