import {
  communityArticleBodyType,
  matchingArticleBodyType
} from "@pages/articles/core/articles.type";

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

// 매칭 게시글 - state
export type matchingArticleFormDataType = Omit<
  matchingArticleBodyType,
  "imageUrls"
> & {
  pureText: string;
  imageFileList: imageFileType[];
};

// 매칭 게시글 수정
export type editMatchingArticleDataType = matchingArticleFormDataType & {
  exchangePostNo: number;
};

// 커뮤니티 게시글 - state
export type communityArticleFormDataType = Omit<
  communityArticleBodyType,
  "imageUrls"
> & {
  pureText: string;
  imageFileList: imageFileType[];
};
