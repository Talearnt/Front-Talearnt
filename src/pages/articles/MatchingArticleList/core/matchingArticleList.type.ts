import { durationType, exchangeType } from "@pages/articles/core/articles.type";
import { matchingArticleBodyType } from "@pages/articles/WriteArticle/WriteMatchingArticle/core/writeMatchingArticle.type";
import { profileType } from "@type/user.type";

export type matchingArticleType = Pick<profileType, "nickname" | "profileImg"> &
  Omit<
    matchingArticleBodyType,
    "giveTalents" | "receiveTalents" | "imageUrls"
  > & {
    giveTalents: string[];
    receiveTalents: string[];
    exchangePostNo: number;
    status: "모집중" | "모집 완료";
    createdAt: string;
    favoriteCount: number;
    isFavorite: boolean;
  };
export type matchingArticleListFilterType = {
  giveTalents: number[];
  receiveTalents: number[];
  duration?: durationType;
  type?: exchangeType;
  status?: "모집중" | "모집_완료";
  order: "recent" | "popular";
  page: number;
};
