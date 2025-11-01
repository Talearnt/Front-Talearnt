import {
  commonArticleDataType,
  durationType,
} from "@features/articles/shared/articles.type";
import { matchingArticleBodyType } from "@features/articles/writeMatchingArticle/writeMatchingArticle.type";
import { profileType } from "@features/user/profile/profile.type";
import { paginationRequestType } from "@shared/type/api.type";

export type matchingArticleType = Pick<profileType, "nickname" | "profileImg"> &
  Omit<
    matchingArticleBodyType,
    "giveTalents" | "receiveTalents" | "imageUrls"
  > &
  Pick<commonArticleDataType, "createdAt" | "updatedAt"> & {
    exchangePostNo: number;
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
//   "updatedAt": "",
//   "title": "",
//   "content": "",
//   "giveTalents": [],
//   "receiveTalents": [],
//   "duration": "기간 미정",
//   "hyperLink": "",
//   "status": "모집중",
//   "isFavorite": false,
//   "favoriteCount": 0,
// }

export type matchingArticleListFilterType = paginationRequestType & {
  giveTalents: number[];
  receiveTalents: number[];
  duration?: durationType;
  status?: "모집중" | "모집_완료";
  order: "recent" | "popular";
};
