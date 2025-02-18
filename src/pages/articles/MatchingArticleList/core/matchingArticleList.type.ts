import { matchArticleBodyType } from "@pages/articles/articles.type";
import { profileType } from "@type/user.type";

type matchingArticleType = Pick<profileType, "nickname" | "profileImg"> &
  Omit<matchArticleBodyType, "imageUrls"> & {
    exchangePostNo: number;
    status: "모집중" | "모집 완료";
    createdAt: string;
    favoriteCount: number;
    isFavorite: boolean;
  };

export type { matchingArticleType };
