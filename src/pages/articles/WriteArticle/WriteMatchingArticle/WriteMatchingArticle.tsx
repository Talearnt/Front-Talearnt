import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { UseFormReturn } from "react-hook-form";

import { postToGetPresignedURL } from "@pages/articles/WriteArticle/core/writeArticle.api";

import { extractImageSrcList } from "@pages/articles/WriteArticle/core/writeArticle.util";
import { classNames } from "@utils/classNames";

import { useGetProfile } from "@hook/user.hook";
import {
  usePostMatchingArticle,
  usePutEditMatchingArticle
} from "@pages/articles/WriteArticle/WriteMatchingArticle/core/writeMatchingArticle.hook";

import { usePromptStore, useToastStore } from "@common/common.store";
import { useEditMatchingArticleDataStore } from "@pages/articles/core/articles.store";

import { PreviewArticleModal } from "@pages/articles/WriteArticle/components/PreviewArticleModal/PreviewArticleModal";
import { TextEditor } from "@pages/articles/WriteArticle/components/TextEditor/TextEditor";

import { Button } from "@components/Button/Button";
import { Chip } from "@components/Chip/Chip";
import { DropdownSearchable } from "@components/dropdowns/DropdownSearchable/DropdownSearchable";
import { PencilIcon } from "@components/icons/textEditor/PencilIcon";
import { Input } from "@components/inputs/Input/Input";
import { Spinner } from "@components/Spinner/Spinner";
import { TitledBox } from "@components/TitledBox/TitledBox";

import { CATEGORIZED_TALENTS_LIST } from "@common/common.constants";
import {
  durationOptions,
  exchangeTypeList,
  talentsOptions
} from "@pages/articles/core/articles.constants";

import { dropdownOptionType } from "@components/dropdowns/dropdown.type";
import { durationType } from "@pages/articles/core/articles.type";
import { matchingArticleFormDataType } from "@pages/articles/WriteArticle/WriteMatchingArticle/core/writeMatchingArticle.type";

type formType = Omit<matchingArticleFormDataType, "duration"> & {
  duration: durationType | undefined;
};

function WriteMatchingArticle() {
  const navigator = useNavigate();
  const context = useOutletContext();

  const {
    data: {
      data: { giveTalents: giveTalentCodeList }
    },
    isError
  } = useGetProfile();
  const {
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset
  } = (context as { matchingForm: UseFormReturn<formType> }).matchingForm;

  const { mutateAsync: postMatchingArticle } = usePostMatchingArticle();
  const { mutateAsync: editMatchingArticle } = usePutEditMatchingArticle();

  const editMatchingArticleData = useEditMatchingArticleDataStore(
    state => state.editMatchingArticle
  );
  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);

  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [isPostInProgress, setIsPostInProgress] = useState(false);

  const [
    giveTalents,
    receiveTalents,
    duration,
    exchangeType,
    title,
    content,
    imageFileList
  ] = watch([
    "giveTalents",
    "receiveTalents",
    "duration",
    "exchangeType",
    "title",
    "content",
    "imageFileList"
  ]);
  const giveTalentsOptions = useMemo(
    () =>
      CATEGORIZED_TALENTS_LIST.reduce<dropdownOptionType<number>[]>(
        (acc, category) => {
          category.talents.forEach(({ talentCode, talentName }) => {
            if (giveTalentCodeList.includes(talentCode)) {
              acc.push({ label: talentName, value: talentCode });
            }
          });

          return acc;
        },
        []
      ),
    [giveTalentCodeList]
  );

  const handleDataChange = (
    field: keyof formType,
    value: formType[keyof formType]
  ) => {
    setValue(field, value);

    if (errors[field]) {
      // mode onChange 로 파악이 안돼서 직접 trigger
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

      if (editMatchingArticleData) {
        await editMatchingArticle({
          title,
          content: newContent,
          exchangeType,
          duration: duration as durationType,
          giveTalents,
          receiveTalents,
          imageUrls,
          exchangePostNo: editMatchingArticleData.exchangePostNo
        });
      } else {
        await postMatchingArticle({
          title,
          content: newContent,
          exchangeType,
          duration: duration as durationType,
          giveTalents,
          receiveTalents,
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
    if (editMatchingArticleData) {
      const { exchangePostNo: _, ...data } = editMatchingArticleData;
      reset(data);
    }
  }, [editMatchingArticleData, reset]);
  // 에러난 경우 매칭 게시물 목록으로 이동
  useEffect(() => {
    if (!isError) {
      return;
    }

    setPrompt({
      title: "에러 발생",
      content: (
        <>
          네트워크 오류로 작성 페이지를 불러올 수 없습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </>
      ),
      confirmOnClickHandler: () => navigator("/matching")
    });
  }, [isError, navigator, setPrompt]);

  if (isError) {
    return null;
  }

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
        <div className={"flex flex-col gap-6"}>
          <div className={"grid grid-cols-2 gap-6"}>
            <div className={"flex flex-col gap-2"}>
              <span className={"text-body2_16_medium"}>주고 싶은 재능</span>
              <DropdownSearchable<number>
                error={errors.giveTalents?.message}
                options={giveTalentsOptions}
                onSelectHandler={({ checked, value }) => {
                  if (checked) {
                    if (giveTalents.length >= 5) {
                      setToast({
                        message: "키워드는 5개까지만 설정 가능해요",
                        type: "error"
                      });

                      return;
                    }

                    handleDataChange("giveTalents", [...giveTalents, value]);

                    return;
                  }

                  handleDataChange(
                    "giveTalents",
                    giveTalents.filter(selectedValue => selectedValue !== value)
                  );
                }}
                placeholder={"주고 싶은 재능을 선택해 주세요"}
                selectedValue={giveTalents}
              />
            </div>
            <div className={"flex flex-col gap-2"}>
              <span className={"text-body2_16_medium"}>받고 싶은 재능</span>
              <DropdownSearchable<number>
                error={errors.receiveTalents?.message}
                options={talentsOptions}
                onSelectHandler={({ checked, value }) => {
                  if (checked) {
                    if (receiveTalents.length >= 5) {
                      setToast({
                        message: "키워드는 5개까지만 설정 가능해요",
                        type: "error"
                      });

                      return;
                    }

                    handleDataChange("receiveTalents", [
                      ...receiveTalents,
                      value
                    ]);

                    return;
                  }

                  handleDataChange(
                    "receiveTalents",
                    receiveTalents.filter(
                      selectedValue => selectedValue !== value
                    )
                  );
                }}
                placeholder={
                  "받고 싶은 재능을 선택해 주세요 (최대 5개 선택 가능)"
                }
                selectedValue={receiveTalents}
              />
            </div>
          </div>
          <div className={"grid grid-cols-2 gap-6"}>
            <div className={"flex flex-col gap-2"}>
              <span className={"text-body2_16_medium"}>진행 기간</span>
              <DropdownSearchable
                isMultiple={false}
                error={errors.duration?.message}
                options={durationOptions}
                onSelectHandler={({ checked, value }) =>
                  handleDataChange("duration", checked ? value : undefined)
                }
                placeholder={"진행 기간을 선택해 주세요."}
                selectedValue={duration}
              />
            </div>
            <div className={classNames("flex flex-col gap-2", "w-full")}>
              <span className={"text-body2_16_medium"}>진행 방식</span>
              <div className={"grid grid-cols-3 gap-2"}>
                {exchangeTypeList.map(type => (
                  <Chip
                    onClickHandler={() =>
                      handleDataChange("exchangeType", type)
                    }
                    pressed={exchangeType === type}
                    type={"default-large"}
                    key={type}
                  >
                    {type}
                  </Chip>
                ))}
              </div>
            </div>
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
          type={"matching"}
          duration={duration as string}
          exchangeType={exchangeType}
          giveTalents={giveTalents}
          receiveTalents={receiveTalents}
          imageUrls={extractImageSrcList(content)}
          title={title}
          content={content}
          onCloseHandler={() => setIsOpenPreview(false)}
        />
      )}
    </>
  );
}

export default WriteMatchingArticle;
