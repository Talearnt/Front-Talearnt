import { useSearchParams } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { postArticle } from "@pages/articles/WriteArticle/core/writeArticle.api";

import { classNames } from "@utils/classNames";

import { useGetProfile } from "@hook/user.hook";

import { useToastStore } from "@common/common.store";

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
  communityArticleDataType,
  matchArticleFormDataType,
  postType
} from "@pages/articles/WriteArticle/core/writeArticle.type";

function WriteArticle() {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = (searchParams.get("type") as articleType | null) ?? "match";
  const isMatchType = type === "match";

  const { isSuccess } = useGetProfile(isMatchType);

  const {
    formState: { errors: matchErrors },
    handleSubmit: handleMatchSubmit,
    watch: matchWatch,
    setValue: setMatchArticleData,
    trigger: matchTrigger
  } = useForm({
    resolver: yupResolver(matchArticleSchema),
    defaultValues: {
      duration: [],
      exchangeType: "온라인",
      giveTalents: [],
      receiveTalents: [],
      title: "",
      content: "",
      pureText: "",
      imageUrls: []
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
      postType: "질문 게시판" as postType,
      title: "",
      content: "",
      pureText: "",
      imageUrls: []
    }
  });

  const setToast = useToastStore(state => state.setToast);

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
  const validateRequiredFields = () =>
    Object.values(isMatchType ? matchArticleData : communityArticleData).every(
      value => (Array.isArray(value) ? value.some(Boolean) : Boolean(value))
    );
  const postMatchArticle = async () => {
    // TODO 이미지 업로드
    const {
      title,
      content,
      exchangeType,
      duration,
      giveTalents,
      receiveTalents
    } = matchArticleData;

    await postArticle({
      title,
      content,
      exchangeType,
      duration: duration[0].value,
      giveTalents: giveTalents.map(({ value }) => value),
      receiveTalents: receiveTalents.map(({ value }) => value),
      imageUrls: []
    });
  };

  if (isMatchType && !isSuccess) {
    return null;
  }

  return (
    <div className={classNames("flex flex-col gap-6", "w-[848px]")}>
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
              className={"text-talearnt-Text_Strong text-heading4_20_semibold"}
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
            이미지 용량이 <b>3MB 초과 시 자동으로 압축</b>돼요.
          </li>
          <li className={"list-bullet"}>
            게시글 <b>제목은 2글자 이상, 내용은 20글자 이상 필수로 입력</b>해
            주세요.
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
        size={"large"}
      />
      <TextEditor
        value={
          isMatchType ? matchArticleData.content : communityArticleData.content
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
        editorKey={type}
        error={
          isMatchType
            ? matchErrors.pureText?.message
            : communityErrors.pureText?.message
        }
      />
      <div
        className={classNames("grid grid-cols-[1fr_110px_110px] gap-4", "mt-8")}
      >
        <Button
          buttonStyle={"outlined"}
          className={"w-[110px]"}
          onClick={() => {
            if (!validateRequiredFields()) {
              setToast({ message: "필수 정보", type: "error" });
              return;
            }
          }}
        >
          미리보기
        </Button>
        <Button buttonStyle={"outlined-blue"}>취소하기</Button>
        <Button onClick={handleMatchSubmit(postMatchArticle)}>등록하기</Button>
      </div>
    </div>
  );
}

export default WriteArticle;
