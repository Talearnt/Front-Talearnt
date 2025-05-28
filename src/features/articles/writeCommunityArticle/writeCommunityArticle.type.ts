import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import {
  commonArticleDataType,
  postType
} from "@features/articles/shared/articles.type";
import { imageFileType } from "@features/articles/shared/writeArticle.type";

// 커뮤니티 게시글 - body
export type communityArticleBodyType = Pick<
  commonArticleDataType,
  "title" | "content"
> & {
  imageUrls: string[];
  postType: postType;
};
// {
//   "title": "",
//   "content": "",
//   "imageUrls": [],
//   "postType": "스터디 모집 게시판",
// }

// 커뮤니티 게시글 - state
export type communityArticleFormDataType = Omit<
  communityArticleBodyType,
  "imageUrls"
> & {
  pureText: string;
  imageFileList: imageFileType[];
};
// {
//   "title": "",
//   "content": "",
//   "pureText": "",
//   "imageFileList": [],
//   "postType": "스터디 모집 게시판",
// }

// 수정 커뮤니티 게시글 - body
export type editCommunityArticleBodyType = communityArticleBodyType &
  Pick<communityArticleDetailType, "communityPostNo">;
// {
//   "communityPostNo": 0,
//   "title": "",
//   "content": "",
//   "imageUrls": [],
//   "postType": "스터디 모집 게시판",
// }
