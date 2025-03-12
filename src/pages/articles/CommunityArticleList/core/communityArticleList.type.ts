import {
  commonArticleDataType,
  postType
} from "@pages/articles/core/articles.type";
import { profileType } from "@type/user.type";

// 커뮤니티 목록 필터
export type communityArticleListFilterType = {
  postType?: postType;
  page: number;
};
// 커뮤니티 게시물
export type communityArticleType = Pick<
  profileType,
  "nickname" | "profileImg"
> &
  Omit<commonArticleDataType, "content"> & {
    commentCount: number;
    communityPostNo: number;
    count: number;
    isLike: boolean;
    likeCount: number;
    postType: postType;
  };
