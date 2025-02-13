import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { useGetProfile } from "@hook/user.hook";

import { WriteArticleInfo } from "@pages/articles/WriteArticle/components/WriteArticleInfo/WriteArticleInfo";

import { ArticleIcon } from "@components/icons/textEditor/ArticleIcon";
import { Input } from "@components/inputs/Input/Input";
import { TabSlider } from "@components/TabSlider/TabSlider";
import { TextEditor } from "@components/TextEditor/TextEditor";
import { TitledBox } from "@components/TitledBox/TitledBox";

import {
  articleType,
  communityArticleDataType,
  matchArticleFormDataType
} from "@pages/articles/WriteArticle/core/writeArticle.type";

const articleTypeOptions = [
  { label: "매칭 게시물 글쓰기", value: "match" },
  { label: "커뮤니티 게시물 글쓰기", value: "community" }
];

function WriteArticle() {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = (searchParams.get("type") as articleType | null) ?? "match";

  const { isSuccess } = useGetProfile(type === "match");

  const [communityArticleData, setCommunityArticleData] =
    useState<communityArticleDataType>({
      title: "",
      content: "",
      boardType: ""
    });
  const [matchArticleData, setMatchArticleData] =
    useState<matchArticleFormDataType>({
      duration: [],
      exchangeType: "온라인",
      imageUrls: [],
      giveTalents: [],
      receiveTalents: [],
      title: "",
      content: ""
    });

  if (type === "match" && !isSuccess) {
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
        setCommunityArticleData={setCommunityArticleData}
        setMatchArticleData={setMatchArticleData}
      />
      <Input
        onChange={({ target }) =>
          type === "match"
            ? setMatchArticleData(prev => ({ ...prev, title: target.value }))
            : setCommunityArticleData(prev => ({
                ...prev,
                title: target.value
              }))
        }
        value={
          type === "match" ? matchArticleData.title : communityArticleData.title
        }
        size={"large"}
      />
      <TextEditor
        value={
          type === "match"
            ? matchArticleData.content
            : communityArticleData.content
        }
        onChangeHandler={value =>
          type === "match"
            ? setMatchArticleData(prev => ({ ...prev, content: value }))
            : setCommunityArticleData(prev => ({
                ...prev,
                content: value
              }))
        }
        editorKey={type}
      />
    </div>
  );
}

export default WriteArticle;
