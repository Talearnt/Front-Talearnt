import {
  durationType,
  exchangeType
} from "@features/articles/shared/articles.type";
import { matchingArticleBodyType } from "@features/articles/writeMatchingArticle/writeMatchingArticle.type";
import { profileType } from "@features/user/user.type";

export type matchingArticleType = Pick<profileType, "nickname" | "profileImg"> &
  Omit<
    matchingArticleBodyType,
    "giveTalents" | "receiveTalents" | "imageUrls"
  > & {
    exchangePostNo: number;
    createdAt: string;
    giveTalents: string[];
    receiveTalents: string[];
    status: "모집중" | "모집 완료";
    isFavorite: boolean;
    favoriteCount: number;
  };
// {
//   "nickname": "",
//   "profileImg": null,
//   "exchangePostNo": 0,
//   "createdAt": "",
//   "title": "",
//   "content": "",
//   "giveTalents": [],
//   "receiveTalents": [],
//   "duration": "기간 미정",
//   "exchangeType": "온라인",
//   "status": "모집중",
//   "isFavorite": false,
//   "favoriteCount": 0,
// }

export type matchingArticleListFilterType = {
  giveTalents: number[];
  receiveTalents: number[];
  duration?: durationType;
  type?: exchangeType;
  status?: "모집중" | "모집_완료";
  order: "recent" | "popular";
  page: number;
};
