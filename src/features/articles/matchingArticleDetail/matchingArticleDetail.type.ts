import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";
import { profileType } from "@features/user/user.type";

export type matchingArticleDetailType = Pick<profileType, "userNo"> &
  matchingArticleType & {
    imageUrls: string[];
    count: number;
  };
// {
//   "userNo": 0,
//   "nickname": "",
//   "profileImg": null,
//   "exchangePostNo": 0,
//   "createdAt": "",
//   "title": "",
//   "content": "",
//   "imageUrls": [],
//   "giveTalents": [],
//   "receiveTalents": [],
//   "duration": "기간 미정",
//   "exchangeType": "온라인",
//   "status": "모집중",
//   "isFavorite": false,
//   "count": 0,
//   "favoriteCount": 0,
// }
