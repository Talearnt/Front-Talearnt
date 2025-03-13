import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { UseFormReturn } from "react-hook-form";

import { extractImageSrcList } from "@pages/articles/WriteArticle/core/writeArticle.util";
import { classNames } from "@utils/classNames";

import { usePromptStore } from "@common/common.store";

import { PreviewArticleModal } from "@pages/articles/WriteArticle/components/PreviewArticleModal/PreviewArticleModal";
import { TextEditor } from "@pages/articles/WriteArticle/components/TextEditor/TextEditor";

import { Button } from "@components/Button/Button";
import { Chip } from "@components/Chip/Chip";
import { PencilIcon } from "@components/icons/textEditor/PencilIcon";
import { Input } from "@components/inputs/Input/Input";
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

  const setPrompt = usePromptStore(state => state.setPrompt);

  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [isPostInProgress, setIsPostInProgress] = useState(false);

  const [title, content, postType] = watch(["title", "content", "postType"]);

  const handleCommunityDataChange = (
    field: keyof communityArticleFormDataType,
    value: communityArticleFormDataType[keyof communityArticleFormDataType]
  ) => {
    setValue(field, value);

    if (errors[field]) {
      void trigger(field);
    }
  };

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
                onClickHandler={() =>
                  handleCommunityDataChange("postType", type)
                }
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
        onChange={({ target }) => setValue("title", target.value)}
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
          setValue("content", value);
          setValue("pureText", pureText);
        }}
        onImageHandler={imageFileList =>
          setValue("imageFileList", imageFileList)
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
        >
          취소하기
        </Button>
        <Button>등록하기</Button>
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
