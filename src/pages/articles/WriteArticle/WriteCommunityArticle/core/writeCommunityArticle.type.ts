import { communityArticleDetailType } from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.type";
import {
  commonArticleDataType,
  postType
} from "@pages/articles/core/articles.type";
import { imageFileType } from "@pages/articles/WriteArticle/core/writeArticle.type";

// 커뮤니티 게시글 - body
export type communityArticleBodyType = Pick<
  commonArticleDataType,
  "title" | "content"
> & {
  postType: postType;
  imageUrls: string[];
};
// 커뮤니티 게시글 - state
export type communityArticleFormDataType = Omit<
  communityArticleBodyType,
  "imageUrls"
> & {
  pureText: string;
  imageFileList: imageFileType[];
};
// 수정 커뮤니티 게시글 - body
export type editCommunityArticleBodyType = communityArticleBodyType &
  Pick<communityArticleDetailType, "communityPostNo">;
// 수정 커뮤니티 게시글 - state
export type editCommunityArticleDataType = communityArticleFormDataType &
  Pick<communityArticleDetailType, "communityPostNo">;
