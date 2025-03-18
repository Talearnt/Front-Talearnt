import { postToGetPresignedURL } from "@pages/articles/WriteArticle/core/writeArticle.api";

import { imageFileType } from "@pages/articles/WriteArticle/core/writeArticle.type";

export const extractImageSrcList = (content: string) =>
  [...content.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match => match[1]);

const MAX_DIMENSION = 1024; // 최대 길이
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export const compressImageFile = (file: File): Promise<imageFileType> =>
  new Promise((resolve, reject) => {
    // 새로운 파일 URL 생성
    const fileUrl = URL.createObjectURL(file);

    if (file.size <= MAX_FILE_SIZE) {
      return resolve({
        file,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        url: fileUrl
      });
    }

    const { name } = file;

    try {
      const image = document.createElement("img");

      image.src = fileUrl;

      // 이미지 로드 실패 시 에러 처리
      image.onerror = () => {
        reject(
          `[${name || "파일 이름 없음"}] 이미지 압축에 실패했습니다. (이미지 로드 실패)`
        );
      };
      image.onload = () => {
        URL.revokeObjectURL(fileUrl);

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          return reject(
            `[${name || "파일 이름 없음"}] 이미지 압축에 실패했습니다. (압축 준비 실패)`
          );
        }

        const { type } = file;
        let { width, height } = image;

        // 이미지 크기 조정
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        const reduceFileSize = (
          quality: number,
          newWidth: number,
          newHeight: number
        ) => {
          canvas.width = newWidth;
          canvas.height = newHeight;
          context.drawImage(image, 0, 0, newWidth, newHeight);

          // Blob으로 변환 후 파일 생성
          context.canvas.toBlob(
            newImageBlob => {
              if (newImageBlob === null) {
                return reject(
                  `[${name || "파일 이름 없음"}] 이미지 압축에 실패했습니다. (파일 생성 실패)`
                );
              }

              const newFile = new File([newImageBlob], name, {
                type
              });

              if (newFile.size <= MAX_FILE_SIZE) {
                // 새로운 파일 URL 생성
                const fileUrl = URL.createObjectURL(newFile);

                return resolve({
                  file: newFile,
                  fileName: newFile.name,
                  fileType: newFile.type,
                  fileSize: newFile.size,
                  url: fileUrl
                });
              } else if (quality > 0.1) {
                // 파일 크기가 3MB 초과면 품질을 낮추고 다시 시도
                const newQuality = quality - 0.1; // 품질을 10%씩 낮춰가며 압축

                reduceFileSize(
                  newQuality,
                  Math.floor(newWidth * 0.9),
                  Math.floor(newHeight * 0.9)
                );
              } else {
                return reject(
                  `[${name || "파일 이름 없음"}] 이미지 압축에 실패했습니다. (품질 보호})`
                );
              }
            },
            type,
            quality
          );
        };

        reduceFileSize(1, width, height);
      };
    } catch (e) {
      return reject(
        `[${name || "파일 이름 없음"}] 이미지 압축에 실패했습니다. (${String(e)})`
      );
    }
  });

export const uploadImageToPresignedURL = async (
  content: string,
  imageFileList: imageFileType[]
) => {
  // content에 있는 image의 src 목록
  const imageSrcList = extractImageSrcList(content);

  if (imageSrcList.length === 0) {
    return [];
  }

  // 누적된 파일 중 현재 content에 있는 image의 파일만 필터
  const filteredImageFileList = imageFileList.filter(({ url }) =>
    imageSrcList.includes(url)
  );

  if (filteredImageFileList.length === 0) {
    // 필터링 된 파일이 0개라면 게시물 수정 시 기존에 있던 image들만 있는 경우
    return imageSrcList;
  }

  const imageUrlList: string[] = [];
  let presignedURLList: string[] = [];

  try {
    // 이미지 올릴 주소 요청
    const { data } = await postToGetPresignedURL(
      filteredImageFileList.map(({ fileName, fileType, fileSize }) => ({
        fileName,
        fileSize,
        fileType
      }))
    );

    presignedURLList = data;
  } catch {
    throw new Error("이미지 업로드 URL을 가져오는 데 실패했습니다.");
  }

  let presignedURLIndex = 0;

  for (const src of imageSrcList) {
    if (!filteredImageFileList.some(({ url }) => url === src)) {
      // src가 파일에 없다면 기존에 업로드 한 이미지
      imageUrlList.push(src);
      continue;
    }

    try {
      const presignedURL = presignedURLList[presignedURLIndex];

      await fetch(presignedURL, {
        method: "PUT",
        body: filteredImageFileList[presignedURLIndex].file,
        headers: new Headers({
          "Content-Type": filteredImageFileList[presignedURLIndex].fileType
        })
      });

      const { origin, pathname } = new URL(presignedURL);

      // presingedURL에서 필요없는 부분 제거하고 저장
      imageUrlList.push(origin + pathname);
      presignedURLIndex++;
    } catch {
      throw new Error("이미지 업로드 중 오류가 발생했습니다.");
    }
  }

  return imageUrlList;
};
