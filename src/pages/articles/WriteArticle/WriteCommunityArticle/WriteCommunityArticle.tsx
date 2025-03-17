import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { UseFormReturn } from "react-hook-form";

import { postToGetPresignedURL } from "@pages/articles/WriteArticle/core/writeArticle.api";

import { extractImageSrcList } from "@pages/articles/WriteArticle/core/writeArticle.util";
import { classNames } from "@utils/classNames";

import {
  usePostCommunityArticle,
  usePutEditCommunityArticle
} from "@pages/articles/WriteArticle/WriteCommunityArticle/core/writeCommunityArticle.hook";

import { usePromptStore, useToastStore } from "@common/common.store";
import { useEditCommunityArticleDataStore } from "@pages/articles/core/articles.store";

import { PreviewArticleModal } from "@pages/articles/WriteArticle/components/PreviewArticleModal/PreviewArticleModal";
import { TextEditor } from "@pages/articles/WriteArticle/components/TextEditor/TextEditor";

import { Button } from "@components/Button/Button";
import { Chip } from "@components/Chip/Chip";
import { PencilIcon } from "@components/icons/textEditor/PencilIcon";
import { Input } from "@components/inputs/Input/Input";
import { Spinner } from "@components/Spinner/Spinner";
import { TitledBox } from "@components/TitledBox/TitledBox";

import { postTypeList } from "@pages/articles/core/articles.constants";

import { communityArticleFormDataType } from "@pages/articles/WriteArticle/WriteCommunityArticle/core/writeCommunityArticle.type";

function WriteCommunityArticle() {
  const navigator = useNavigate();
  const context = useOutletContext();

  const {
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset
  } = (
    context as { communityForm: UseFormReturn<communityArticleFormDataType> }
  ).communityForm;

  const { mutateAsync: postCommunityArticle } = usePostCommunityArticle();
  const { mutateAsync: editCommunityArticle } = usePutEditCommunityArticle();

  const editCommunityArticleData = useEditCommunityArticleDataStore(
    state => state.editCommunityArticle
  );
  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);

  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [isPostInProgress, setIsPostInProgress] = useState(false);

  const [title, content, imageFileList, postType] = watch([
    "title",
    "content",
    "imageFileList",
    "postType"
  ]);

  const handleDataChange = (
    field: keyof communityArticleFormDataType,
    value: communityArticleFormDataType[keyof communityArticleFormDataType]
  ) => {
    setValue(field, value);

    if (errors[field]) {
      void trigger(field);
    }
  };
  const postArticle = async () => {
    setIsPostInProgress(true);

    // content에 있는 image의 src 목록
    const imageSrcList = extractImageSrcList(content);
    // 누적된 파일 중 현재 content에 있는 image의 파일만 필터
    const files = imageFileList.filter(({ url }) => imageSrcList.includes(url));
    // 필터링 된 파일이 0개라면 게시물 수정 시 기존에 있던 image들만 있는 경우
    const imageUrls: string[] = files.length === 0 ? imageSrcList : [];

    // 업로드 할 파일이 있는 경우에만 실행
    if (files.length > 0) {
      let presignedURLs: string[] = [];
      let presignedURLIndex = 0;

      try {
        // 이미지 올릴 주소 요청
        const { data } = await postToGetPresignedURL(
          files.map(({ fileName, fileType, fileSize }) => ({
            fileName,
            fileSize,
            fileType
          }))
        );

        presignedURLs = data;
      } catch {
        setToast({
          message: "이미지 업로드 URL을 가져오는 데 실패했습니다.",
          type: "error"
        });
        setIsPostInProgress(false);
        return;
      }

      for (const src of imageSrcList) {
        // src가 파일에 없다면 기존에 업로드 한 이미지
        if (!files.some(({ url }) => url === src)) {
          imageUrls.push(src);
          continue;
        }

        try {
          const presignedURL = presignedURLs[presignedURLIndex];
          const { origin, pathname } = new URL(presignedURL);
          // presingedURL에서 필요없는 부분 제거하고 저장
          const url = origin + pathname;

          await fetch(presignedURL, {
            method: "PUT",
            body: files[presignedURLIndex].file,
            headers: new Headers({
              "Content-Type": files[presignedURLIndex].fileType
            })
          });

          imageUrls.push(url);
          presignedURLIndex++;
        } catch {
          setToast({
            message: "이미지 업로드 중 오류가 발생했습니다.",
            type: "error"
          });
          setIsPostInProgress(false);
          return;
        }
      }
    }

    try {
      // content내 image src변경할 때 사용할 용도
      const newImageUrls = [...imageUrls];
      // content내 image src 변경
      const newContent = content.replace(
        /(<img\s+[^>]*src=")([^"]+)(")/g,
        (match, start, _src, end) =>
          newImageUrls.length ? `${start}${newImageUrls.shift()}${end}` : match
      );

      if (editCommunityArticleData) {
        await editCommunityArticle({
          communityPostNo: editCommunityArticleData.communityPostNo,
          postType,
          title,
          content: newContent,
          imageUrls
        });
      } else {
        await postCommunityArticle({
          postType,
          title,
          content: newContent,
          imageUrls
        });
      }
    } catch {
      setToast({
        message: "게시글 업로드 중 오류가 발생했습니다.",
        type: "error"
      });
    } finally {
      setIsPostInProgress(false);
    }
  };

  // 수정 게시물 데이터 있는 경우 reset
  useEffect(() => {
    if (editCommunityArticleData) {
      const { communityPostNo: _, ...data } = editCommunityArticleData;
      reset(data);
    }
  }, [editCommunityArticleData, reset]);

  return (
    <>
      <TitledBox
        title={
          <div className={"flex items-center gap-4"}>
            <PencilIcon />
            <span
              className={"text-talearnt-Text_Strong text-heading4_20_semibold"}
            >
              필수 정보를 입력해 주세요
            </span>
          </div>
        }
      >
        <div className={"flex flex-col gap-2"}>
          <span className={"text-body2_16_medium"}>진행 방식</span>
          <div className={"grid grid-cols-[repeat(3,156px)] gap-4"}>
            {postTypeList.map(type => (
              <Chip
                onClickHandler={() => handleDataChange("postType", type)}
                pressed={postType === type}
                type={"default-large"}
                key={type}
              >
                {type}
              </Chip>
            ))}
          </div>
        </div>
      </TitledBox>
      <Input
        onChange={({ target }) => handleDataChange("title", target.value)}
        value={title}
        error={errors.title?.message}
        insideNode={
          <span className={"text-body2_16_medium text-talearnt_Text_04"}>
            {title.length}
            /50
          </span>
        }
        maxLength={50}
        size={"large"}
        placeholder={"제목을 2글자 이상 입력해 주세요"}
      />
      <TextEditor
        value={content}
        onChangeHandler={({ value, pureText }) => {
          handleDataChange("content", value);
          handleDataChange("pureText", pureText);
        }}
        onImageHandler={imageFileList =>
          handleDataChange("imageFileList", imageFileList)
        }
        error={errors.pureText?.message}
      />
      <div
        className={classNames("grid grid-cols-[1fr_110px_110px] gap-4", "mt-8")}
      >
        <Button
          buttonStyle={"outlined"}
          className={"w-[110px]"}
          onClick={handleSubmit(() => setIsOpenPreview(true))}
          disabled={isPostInProgress}
        >
          미리보기
        </Button>
        <Button
          buttonStyle={"outlined-blue"}
          onClick={() =>
            setPrompt({
              title: "게시물 작성 취소",
              content:
                "페이지를 나가면 작성된 내용이 모두 유실됩니다. 그래도 나가시겠어요?",
              cancelOnClickHandler: () => setPrompt(),
              confirmOnClickHandler: () => navigator(-1)
            })
          }
          disabled={isPostInProgress}
        >
          취소하기
        </Button>
        <Button onClick={handleSubmit(postArticle)} disabled={isPostInProgress}>
          {isPostInProgress ? <Spinner /> : "등록하기"}
        </Button>
      </div>
      {isOpenPreview && (
        <PreviewArticleModal
          type={"community"}
          postType={postType}
          imageUrls={extractImageSrcList(content)}
          title={title}
          content={content}
          onCloseHandler={() => setIsOpenPreview(false)}
        />
      )}
    </>
  );
}

export default WriteCommunityArticle;
