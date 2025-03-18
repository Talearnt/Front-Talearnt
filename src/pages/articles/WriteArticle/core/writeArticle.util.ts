import { postToGetPresignedURL } from "@pages/articles/WriteArticle/core/writeArticle.api";

import { imageFileType } from "@pages/articles/WriteArticle/core/writeArticle.type";

export const extractImageSrcList = (content: string) =>
  [...content.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match => match[1]);

export const uploadImageToPresignedURL = (
  content: string,
  imageFileList: imageFileType[]
) =>
  new Promise<string[]>(async (resolve, reject) => {
    // content에 있는 image의 src 목록
    const imageSrcList = extractImageSrcList(content);

    if (imageSrcList.length === 0) {
      return resolve([]);
    }

    // 누적된 파일 중 현재 content에 있는 image의 파일만 필터
    const files = imageFileList.filter(({ url }) => imageSrcList.includes(url));

    if (files.length === 0) {
      // 필터링 된 파일이 0개라면 게시물 수정 시 기존에 있던 image들만 있는 경우
      return resolve(imageSrcList);
    }

    const imageUrlList: string[] = [];
    let presignedURLList: string[] = [];

    try {
      // 이미지 올릴 주소 요청
      const { data } = await postToGetPresignedURL(
        files.map(({ fileName, fileType, fileSize }) => ({
          fileName,
          fileSize,
          fileType
        }))
      );

      presignedURLList = data;
    } catch {
      return reject("이미지 업로드 URL을 가져오는 데 실패했습니다.");
    }

    let presignedURLIndex = 0;

    for (const src of imageSrcList) {
      if (!files.some(({ url }) => url === src)) {
        // src가 파일에 없다면 기존에 업로드 한 이미지
        imageUrlList.push(src);
        continue;
      }

      try {
        const presignedURL = presignedURLList[presignedURLIndex];

        await fetch(presignedURL, {
          method: "PUT",
          body: files[presignedURLIndex].file,
          headers: new Headers({
            "Content-Type": files[presignedURLIndex].fileType
          })
        });

        const { origin, pathname } = new URL(presignedURL);

        // presingedURL에서 필요없는 부분 제거하고 저장
        imageUrlList.push(origin + pathname);
        presignedURLIndex++;
      } catch {
        return reject("이미지 업로드 중 오류가 발생했습니다.");
      }
    }

    return resolve(imageUrlList);
  });
