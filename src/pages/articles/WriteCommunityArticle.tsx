import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { UseFormReturn } from "react-hook-form";

import {
  extractImageSrcList,
  uploadImageToPresignedURL,
} from "@features/articles/shared/writeArticle.util";
import { classNames } from "@shared/utils/classNames";

import {
  usePostCommunityArticle,
  usePutEditCommunityArticle,
} from "@features/articles/writeCommunityArticle/writeCommunityArticle.hook";

import { useEditCommunityArticleDataStore } from "@features/articles/shared/articles.store";
import { usePromptStore } from "@store/prompt.store";
import { useToastStore } from "@store/toast.store";

import { PreviewArticleModal } from "@components/articles/writeArticle/PreviewArticleModal/PreviewArticleModal";
import { TextEditor } from "@components/articles/writeArticle/TextEditor/TextEditor";
import { TitledBox } from "@components/articles/writeArticle/TitledBox/TitledBox";
import { Button } from "@components/common/Button/Button";
import { Chip } from "@components/common/Chip/Chip";
import { PencilIcon } from "@components/common/icons/textEditor/PencilIcon";
import { Input } from "@components/common/inputs/Input/Input";
import { Spinner } from "@components/common/Spinner/Spinner";

import { postTypeList } from "@features/articles/shared/articles.constants";

import { communityArticleFormDataType } from "@features/articles/writeCommunityArticle/writeCommunityArticle.type";

function WriteCommunityArticle() {
  const navigator = useNavigate();
  const context = useOutletContext();

  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [isPostInProgress, setIsPostInProgress] = useState(false);

  const editCommunityArticleData = useEditCommunityArticleDataStore(
    state => state.editCommunityArticle
  );
  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);

  const { mutateAsync: postCommunityArticle } = usePostCommunityArticle();
  const { mutateAsync: editCommunityArticle } = usePutEditCommunityArticle();

  const {
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
  } = (
    context as { communityForm: UseFormReturn<communityArticleFormDataType> }
  ).communityForm;
  const [title, content, imageFileList, postType] = watch([
    "title",
    "content",
    "imageFileList",
    "postType",
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

    let imageUrls: string[] = [];

    try {
      imageUrls = await uploadImageToPresignedURL(content, imageFileList);
    } catch (error) {
      setToast({
        message: (error as { message: string }).message,
        type: "error",
      });

      setIsPostInProgress(false);

      return;
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
          imageUrls,
        });
      } else {
        await postCommunityArticle({
          postType,
          title,
          content: newContent,
          imageUrls,
        });
      }
    } catch {
      setToast({
        message: "게시글 업로드 중 오류가 발생했습니다.",
        type: "error",
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
      void trigger();
    }
  }, [editCommunityArticleData]);

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
              confirmOnClickHandler: () => navigator(-1),
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
