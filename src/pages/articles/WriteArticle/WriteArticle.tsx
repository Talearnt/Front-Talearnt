import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { postToGetPresignedURL } from "@pages/articles/WriteArticle/core/writeArticle.api";

import { classNames } from "@utils/classNames";

import { useGetProfile } from "@hook/user.hook";
import {
  usePostMatchingArticle,
  usePutEditMatchingArticle
} from "@pages/articles/WriteArticle/core/writeArticle.hook";

import { usePromptStore, useToastStore } from "@common/common.store";
import { useEditMatchingArticleDataStore } from "@pages/articles/core/articles.store";

import { PreviewArticleModal } from "@pages/articles/WriteArticle/components/PreviewArticleModal/PreviewArticleModal";
import { WriteArticleInfo } from "@pages/articles/WriteArticle/components/WriteArticleInfo/WriteArticleInfo";

import { Button } from "@components/Button/Button";
import { ArticleIcon } from "@components/icons/textEditor/ArticleIcon";
import { Input } from "@components/inputs/Input/Input";
import { TabSlider } from "@components/TabSlider/TabSlider";
import { TextEditor } from "@components/TextEditor/TextEditor";
import { TitledBox } from "@components/TitledBox/TitledBox";

import {
  articleTypeOptions,
  communityArticleSchema,
  matchArticleSchema
} from "@pages/articles/WriteArticle/core/writeArticle.constants";

import {
  articleType,
  communityArticleFormDataType,
  matchingArticleFormDataType
} from "@pages/articles/WriteArticle/core/writeArticle.type";

function WriteArticle() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigator = useNavigate();

  const { isSuccess } = useGetProfile();

  const {
    formState: { errors: matchErrors },
    handleSubmit: handleMatchSubmit,
    watch: matchWatch,
    setValue: setMatchArticleData,
    trigger: matchTrigger,
    reset
  } = useForm({
    resolver: yupResolver(matchArticleSchema),
    defaultValues: {
      exchangeType: "온라인",
      giveTalents: [],
      receiveTalents: [],
      title: "",
      content: "",
      pureText: "",
      imageFileList: []
    }
  });
  const {
    formState: { errors: communityErrors },
    watch: communityWatch,
    setValue: setCommunityArticleData,
    trigger: communityTrigger
  } = useForm({
    resolver: yupResolver(communityArticleSchema),
    defaultValues: {
      postType: "자유 게시판",
      title: "",
      content: "",
      pureText: "",
      imageFileList: []
    }
  });

  const { mutateAsync: postMatchingArticle } = usePostMatchingArticle();
  const { mutateAsync: editMatchingArticle } = usePutEditMatchingArticle();

  const editMatchingArticleData = useEditMatchingArticleDataStore(
    state => state.editMatchingArticle
  );
  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);

  const [isOpenPreview, setIsOpenPreview] = useState(false);

  const communityArticleData = communityWatch();
  const matchArticleData = matchWatch();
  const type = (searchParams.get("type") as articleType | null) ?? "match";
  const isMatchType = type === "match";

  const handleCommunityDataChange = (
    field: keyof communityArticleFormDataType,
    value: communityArticleFormDataType[keyof communityArticleFormDataType]
  ) => {
    setCommunityArticleData(field, value);

    if (communityErrors[field]) {
      void communityTrigger(field);
    }
  };
  const handleMatchDataChange = (
    field: keyof matchingArticleFormDataType,
    value: matchingArticleFormDataType[keyof matchingArticleFormDataType]
  ) => {
    setMatchArticleData(field, value);

    if (matchErrors[field]) {
      void matchTrigger(field);
    }
  };
  const extractImageSrcList = (content: string) =>
    [...content.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match => match[1]);
  const postMatchArticle = async () => {
    const {
      title,
      content,
      imageFileList,
      exchangeType,
      duration,
      giveTalents,
      receiveTalents
    } = matchArticleData;

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
            body: files[presignedURLIndex].file as File,
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
          duration,
          giveTalents,
          receiveTalents,
          imageUrls
        });
      } else {
        await postMatchingArticle({
          title,
          content: newContent,
          exchangeType,
          duration,
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
    }
  };

  useEffect(() => {
    if (editMatchingArticleData) {
      reset({
        title: editMatchingArticleData.title,
        content: editMatchingArticleData.content,
        duration: editMatchingArticleData.duration,
        exchangeType: editMatchingArticleData.exchangeType,
        giveTalents: editMatchingArticleData.giveTalents,
        receiveTalents: editMatchingArticleData.receiveTalents,
        pureText: editMatchingArticleData.pureText,
        imageFileList: []
      });
    }
  }, [editMatchingArticleData, reset]);

  if (isMatchType && !isSuccess) {
    return null;
  }

  return (
    <>
      <div className={classNames("flex flex-col gap-6", "mt-8 w-[848px]")}>
        <TabSlider
          className={"mx-auto mb-2 w-min"}
          currentValue={type}
          onClickHandler={value => setSearchParams({ type: value })}
          options={articleTypeOptions}
          type={"shadow"}
        />
        <TitledBox
          canOpen
          title={
            <div className={"flex items-center gap-4"}>
              <ArticleIcon />
              <span
                className={
                  "text-talearnt-Text_Strong text-heading4_20_semibold"
                }
              >
                매칭 게시물 작성 가이드를 확인해 주세요
              </span>
            </div>
          }
        >
          <ul className={"space-y-4"}>
            <li className={"list-bullet"}>
              이미지는 최대&nbsp;
              <b>
                5개까지 업로드 할 수 있으며, JPG, JPEG, PNG, JFIF, TIFF 형식으로
                업로드
              </b>
              &nbsp;할 수 있어요.
            </li>
            <li className={"list-bullet"}>
              이미지 용량이&nbsp;<b>3MB 초과 시 자동으로 압축</b>돼요.
            </li>
            <li className={"list-bullet"}>
              게시글&nbsp;
              <b>제목은 2글자 이상, 내용은 20글자 이상 필수로 입력</b>해 주세요.
            </li>
            <li className={"list-bullet"}>
              글 작성과 이미지 업로드 시,&nbsp;
              <b>타인의 지식재산권을 침해하지 않도록 유의해 주세요.</b>
            </li>
          </ul>
        </TitledBox>
        <WriteArticleInfo
          type={type}
          communityArticleData={communityArticleData}
          matchArticleData={matchArticleData}
          handleCommunityDataChange={handleCommunityDataChange}
          handleMatchDataChange={handleMatchDataChange}
          errors={matchErrors}
        />
        <Input
          onChange={({ target }) =>
            isMatchType
              ? handleMatchDataChange("title", target.value)
              : handleCommunityDataChange("title", target.value)
          }
          value={
            isMatchType ? matchArticleData.title : communityArticleData.title
          }
          error={
            isMatchType
              ? matchErrors.title?.message
              : communityErrors.title?.message
          }
          insideNode={
            <span className={"text-body2_16_medium text-talearnt_Text_04"}>
              {
                (isMatchType
                  ? matchArticleData.title
                  : communityArticleData.title
                ).length
              }
              /50
            </span>
          }
          maxLength={50}
          size={"large"}
          placeholder={"제목을 2글자 이상 입력해 주세요"}
        />
        <TextEditor
          value={
            isMatchType
              ? matchArticleData.content
              : communityArticleData.content
          }
          onChangeHandler={({ value, pureText }) => {
            if (isMatchType) {
              handleMatchDataChange("content", value);
              handleMatchDataChange("pureText", pureText);

              return;
            }

            handleCommunityDataChange("content", value);
            handleCommunityDataChange("pureText", pureText);
          }}
          onImageHandler={imageFileList =>
            (isMatchType ? handleMatchDataChange : handleCommunityDataChange)(
              "imageFileList",
              imageFileList
            )
          }
          editorKey={type}
          error={
            isMatchType
              ? matchErrors.pureText?.message
              : communityErrors.pureText?.message
          }
        />
        <div
          className={classNames(
            "grid grid-cols-[1fr_110px_110px] gap-4",
            "mt-8"
          )}
        >
          <Button
            buttonStyle={"outlined"}
            className={"w-[110px]"}
            onClick={handleMatchSubmit(() => setIsOpenPreview(true))}
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
          <Button onClick={handleMatchSubmit(postMatchArticle)}>
            등록하기
          </Button>
        </div>
      </div>
      {isOpenPreview && (
        <PreviewArticleModal
          type={type}
          duration={matchArticleData.duration}
          exchangeType={matchArticleData.exchangeType}
          giveTalents={matchArticleData.giveTalents}
          receiveTalents={matchArticleData.receiveTalents}
          postType={communityArticleData.postType}
          imageUrls={extractImageSrcList(
            (isMatchType ? matchArticleData : communityArticleData).content
          )}
          title={(isMatchType ? matchArticleData : communityArticleData).title}
          content={
            (isMatchType ? matchArticleData : communityArticleData).content
          }
          onCloseHandler={() => setIsOpenPreview(false)}
        />
      )}
    </>
  );
}

export default WriteArticle;
