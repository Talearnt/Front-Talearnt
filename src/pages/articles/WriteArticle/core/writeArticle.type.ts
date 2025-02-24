import {
  communityArticleBodyType,
  matchArticleBodyType
} from "@pages/articles/core/articles.type";

// 게시글 타입
type articleType = "match" | "community";

// 이미지 파일
type imageFileType = {
  file: File;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
};
type presignedURLBodyType = Omit<imageFileType, "file" | "url">;

// 매칭 게시글 - state
type matchArticleFormDataType = Omit<matchArticleBodyType, "imageUrls"> & {
  pureText: string;
  imageFileList: imageFileType[];
};

// 커뮤니티 게시글 - state
type communityArticleDataType = Omit<communityArticleBodyType, "imageUrls"> & {
  pureText: string;
  imageFileList: imageFileType[];
};

export type {
  articleType,
  communityArticleDataType,
  imageFileType,
  matchArticleFormDataType,
  presignedURLBodyType
};
