import {
  commonArticleDataType,
  durationType,
  exchangeType,
  postType
} from "@pages/articles/core/articles.type";
import { matchingArticleDetailType } from "@pages/articles/MatchingArticleDetail/core/matchingArticleDetail.type";

// 게시글 타입
export type articleType = "match" | "community";
// 이미지 파일
export type imageFileType = {
  file: File;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
};
export type presignedURLBodyType = Omit<imageFileType, "file" | "url">;

// 매칭 게시글 - body
export type matchingArticleBodyType = Pick<
  commonArticleDataType,
  "title" | "content"
> & {
  duration: durationType;
  exchangeType: exchangeType;
  giveTalents: number[];
  receiveTalents: number[];
  imageUrls: string[];
};
// 매칭 게시글 - state
export type matchingArticleFormDataType = Omit<
  matchingArticleBodyType,
  "imageUrls"
> & {
  pureText: string;
  imageFileList: imageFileType[];
};
// 매칭 게시글 수정
export type editMatchingArticleDataType = matchingArticleFormDataType &
  Pick<matchingArticleDetailType, "exchangePostNo">;

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
