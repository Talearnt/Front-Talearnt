import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

import { getMatchingArticleList } from "@pages/articles/MatchingArticleList/core/matchingArticleList.api";
import {
  postArticle,
  postToGetPresignedURL
} from "@pages/articles/WriteArticle/core/writeArticle.api";

import { classNames } from "@utils/classNames";
import { createQueryKey } from "@utils/queryKey";

import { useGetProfile } from "@hook/user.hook";

import { usePromptStore, useToastStore } from "@common/common.store";
import { useHasNewMatchingArticleStore } from "@pages/articles/core/articles.store";

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

import { customAxiosResponseType, paginationType } from "@common/common.type";
import { matchingArticleType } from "@pages/articles/MatchingArticleList/core/matchingArticleList.type";
import {
  articleType,
  communityArticleDataType,
  matchArticleFormDataType
} from "@pages/articles/WriteArticle/core/writeArticle.type";

const imageRegex = /src="([^"]+)"/g;

function WriteArticle() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const type = (searchParams.get("type") as articleType | null) ?? "match";
  const isMatchType = type === "match";

  const {
    data: {
      data: { profileImg, nickname }
    },
    isSuccess
  } = useGetProfile(isMatchType);

  const {
    formState: { errors: matchErrors },
    handleSubmit: handleMatchSubmit,
    watch: matchWatch,
    setValue: setMatchArticleData,
    trigger: matchTrigger
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

  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);
  const setHasNewMatchingArticle = useHasNewMatchingArticleStore(
    state => state.setHasNewMatchingArticle
  );

  const [isOpenPreview, setIsOpenPreview] = useState(false);

  const communityArticleData = communityWatch();
  const matchArticleData = matchWatch();

  const handleCommunityDataChange = (
    field: keyof communityArticleDataType,
    value: communityArticleDataType[keyof communityArticleDataType]
  ) => {
    setCommunityArticleData(field, value);

    if (communityErrors[field]) {
      void communityTrigger(field);
    }
  };
  const handleMatchDataChange = (
    field: keyof matchArticleFormDataType,
    value: matchArticleFormDataType[keyof matchArticleFormDataType]
  ) => {
    setMatchArticleData(field, value);

    if (matchErrors[field]) {
      void matchTrigger(field);
    }
  };
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

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const contentImages = Array.from(doc.querySelectorAll("img"));
    const files = imageFileList.filter(({ url }) =>
      contentImages.some(image => image.src === url)
    );
    const imageUrls = [];

    if (files.length > 0) {
      let presignedURLs: string[];

      try {
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

      for (const [index, img] of contentImages.entries()) {
        try {
          const presignedURL = presignedURLs[index];
          const { origin, pathname } = new URL(presignedURL);

          await fetch(presignedURL, {
            method: "PUT",
            body: files[index].file as File,
            headers: new Headers({
              "Content-Type": files[index].fileType
            })
          });

          const url = origin + pathname;

          img.src = url;
          imageUrls.push(url);
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
      // 모든 매칭 게시물 목록 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: createQueryKey(["MATCH"], { isArticleList: true })
      });
      // 필터링 되지 않은 매칭 게시물 목록 프리패치
      await queryClient.prefetchQuery({
        queryKey: createQueryKey(
          [
            "MATCH",
            { giveTalents: [], receiveTalents: [], order: "recent", page: 1 }
          ],
          { isArticleList: true }
        ),
        queryFn: async () =>
          await getMatchingArticleList({
            giveTalents: [],
            receiveTalents: [],
            order: "recent",
            page: 1
          })
      });
      // 게시물 작성
      await postArticle({
        title,
        content: doc.body.innerHTML,
        exchangeType,
        duration,
        giveTalents,
        receiveTalents,
        imageUrls
      });
      // 새롭게 작성된 게시물 저장
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<matchingArticleType>>
      >(
        createQueryKey(
          [
            "MATCH",
            { giveTalents: [], receiveTalents: [], order: "recent", page: 1 }
          ],
          { isArticleList: true }
        ),
        oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: [
                {
                  profileImg,
                  nickname,
                  duration,
                  exchangeType,
                  giveTalents: [],
                  receiveTalents: [],
                  exchangePostNo: -1,
                  status: "모집중",
                  title,
                  content: doc.body.innerText,
                  createdAt: dayjs().format("YYYY-MM-DD"),
                  favoriteCount: 0,
                  isFavorite: false
                },
                ...oldData.data.results.slice(0, -1)
              ]
            }
          };
        }
      );
      // 애니메이션을 위한 새로운 게시물 플래그
      setHasNewMatchingArticle(true);
      navigator("/matching");
    } catch {
      setToast({
        message: "게시글 업로드 중 오류가 발생했습니다.",
        type: "error"
      });
    }
  };

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
                cancelOnClickHandler: () => {
                  setPrompt();
                },
                confirmOnClickHandler: () => {
                  navigator(-1);
                  setPrompt();
                }
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
          imageUrls={[
            ...(isMatchType
              ? matchArticleData
              : communityArticleData
            ).content.matchAll(imageRegex)
          ].map(match => match[1])}
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
