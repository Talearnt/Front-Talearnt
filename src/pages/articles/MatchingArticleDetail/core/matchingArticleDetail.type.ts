import { matchingArticleType } from "@pages/articles/MatchingArticleList/core/matchingArticleList.type";
import { profileType } from "@type/user.type";

export type matchingArticleDetailType = Pick<profileType, "userNo"> &
  matchingArticleType & {
    imageUrls: string[];
    count: number;
  };
