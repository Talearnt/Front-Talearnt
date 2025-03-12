import { communityArticleType } from "@pages/articles/CommunityArticleList/core/communityArticleList.type";
import { commonArticleDataType } from "@pages/articles/core/articles.type";
import { profileType } from "@type/user.type";

export type communityArticleDetailType = Pick<profileType, "userNo"> &
  Pick<commonArticleDataType, "content"> &
  communityArticleType & {
    imageUrls: string[];
    isLike: false;
    count: number;
    likeCount: number;
    commentCount: number;
  };
