// 이미지 파일
export type imageFileType = {
  file: File;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
};
// presigned URL
export type presignedURLBodyType = Omit<imageFileType, "file" | "url">;
