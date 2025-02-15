import { dropdownOptionType } from "@components/dropdowns/dropdown.type";

// 게시글 타입
type articleType = "match" | "community";
// 게시글 데이터
type commonArticleDataType = {
  title: string;
  content: string;
  pureText: string;
};
// 이미지 파일
type imageFileType = {
  file: File;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
};
type presignedURLBodyType = Omit<imageFileType, "file" | "url">;
// 매칭 게시글 - 진행 기간
type durationType = "기간 미정" | "1개월" | "2개월" | "3개월" | "3개월 이상";
// 매칭 게시글 - 진행 방식
type exchangeType = "온라인" | "오프라인" | "온오프라인";
// 매칭 게시글 - state
type matchArticleFormDataType = commonArticleDataType & {
  duration: dropdownOptionType<durationType>[];
  exchangeType: exchangeType;
  giveTalents: dropdownOptionType<number>[];
  receiveTalents: dropdownOptionType<number>[];
  imageFileList: imageFileType[];
};
// 매칭 게시글 - body
type matchArticleBodyType = Pick<
  matchArticleFormDataType,
  "title" | "content" | "exchangeType"
> & {
  duration: durationType;
  giveTalents: number[];
  receiveTalents: number[];
  imageUrls: string[];
};
// 커뮤니티 게시글 - 게시판 타입
type postType = "자유 게시판" | "질문 게시판" | "스터디 모집";
// 커뮤니티 게시글 - state
type communityArticleDataType = commonArticleDataType & {
  postType: postType;
  imageFileList: imageFileType[];
};
// 커뮤니티 게시글 - body
type communityArticleBodyType = commonArticleDataType & {
  postType: postType;
  imageUrls: imageFileType[];
};

export type {
  articleType,
  communityArticleBodyType,
  communityArticleDataType,
  durationType,
  exchangeType,
  imageFileType,
  matchArticleBodyType,
  matchArticleFormDataType,
  postType,
  presignedURLBodyType
};
