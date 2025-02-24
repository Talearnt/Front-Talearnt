import {
  durationType,
  exchangeType,
  matchArticleBodyType
} from "@pages/articles/core/articles.type";
import { profileType } from "@type/user.type";

type matchingArticleType = Pick<profileType, "nickname" | "profileImg"> &
  Omit<matchArticleBodyType, "giveTalents" | "receiveTalents" | "imageUrls"> & {
    giveTalents: string[];
    receiveTalents: string[];
    exchangePostNo: number;
    status: "모집중" | "모집 완료";
    createdAt: string;
    favoriteCount: number;
    isFavorite: boolean;
  };
type matchingArticleListFilterType = {
  giveTalents: number[];
  receiveTalents: number[];
  duration?: durationType;
  type?: exchangeType;
  status?: "모집중" | "모집_완료";
  order: "recent" | "popular";
  page: number;
};

export type { matchingArticleListFilterType, matchingArticleType };
