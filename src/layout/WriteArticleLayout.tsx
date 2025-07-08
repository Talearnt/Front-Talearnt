import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { classNames } from "@shared/utils/classNames";

import { useGetProfile } from "@features/user/profile/profile.hook";

import { TitledBox } from "@components/articles/writeArticle/TitledBox/TitledBox";
import { AnimatedLoader } from "@components/common/AnimatedLoader/AnimatedLoader";
import { Dot } from "@components/common/Dot/Dot";
import { ArticleIcon } from "@components/common/icons/textEditor/ArticleIcon";
import { TabSlider } from "@components/common/TabSlider/TabSlider";

import {
  communityArticleSchema,
  matchingArticleSchema,
} from "@features/articles/shared/writeArticle.constants";

const articleTypeOptions = [
  { label: "매칭 게시물 글쓰기", value: "/write-article/matching" },
  { label: "커뮤니티 게시물 글쓰기", value: "/write-article/community" },
];

function WriteArticleLayout() {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const { isLoading } = useGetProfile(pathname.includes("matching"));
  const matchingForm = useForm({
    resolver: yupResolver(matchingArticleSchema),
    defaultValues: {
      giveTalents: [],
      receiveTalents: [],
      duration: undefined,
      exchangeType: "온라인",
      title: "",
      content: "",
      pureText: "",
      imageFileList: [],
    },
  });
  const communityForm = useForm({
    resolver: yupResolver(communityArticleSchema),
    defaultValues: {
      postType: "자유 게시판",
      title: "",
      content: "",
      pureText: "",
      imageFileList: [],
    },
  });

  return (
    <div
      className={classNames(
        "relative flex flex-col gap-6",
        "h-full w-[848px] pt-8"
      )}
    >
      <TabSlider
        className={"mx-auto mb-2 w-min"}
        currentValue={pathname}
        onClickHandler={value => navigator(value)}
        options={articleTypeOptions}
        type={"shadow"}
      />
      {pathname.includes("matching") && isLoading ? (
        <AnimatedLoader
          className={
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          }
        />
      ) : (
        <>
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
              <li className={"flex items-center gap-2"}>
                <Dot className={"h-[6px] w-[6px] bg-talearnt_Icon_01"} />
                <p>
                  이미지는 최대&nbsp;
                  <b>
                    5개까지 업로드 할 수 있으며, JPG, JPEG, PNG, JFIF, TIFF
                    형식으로 업로드
                  </b>
                  &nbsp;할 수 있어요.
                </p>
              </li>
              <li className={"flex items-center gap-2"}>
                <Dot className={"h-[6px] w-[6px] bg-talearnt_Icon_01"} />
                <p>
                  이미지 용량이&nbsp;<b>3MB 초과 시 자동으로 압축</b>돼요.
                </p>
              </li>
              <li className={"flex items-center gap-2"}>
                <Dot className={"h-[6px] w-[6px] bg-talearnt_Icon_01"} />
                <p>
                  게시글&nbsp;
                  <b>제목은 2글자 이상, 내용은 20글자 이상 필수로 입력</b>해
                  주세요.
                </p>
              </li>
              <li className={"flex items-center gap-2"}>
                <Dot className={"h-[6px] w-[6px] bg-talearnt_Icon_01"} />
                <p>
                  글 작성과 이미지 업로드 시,&nbsp;
                  <b>타인의 지식재산권을 침해하지 않도록 유의해 주세요.</b>
                </p>
              </li>
            </ul>
          </TitledBox>
          <Outlet context={{ communityForm, matchingForm }} />
        </>
      )}
    </div>
  );
}

export default WriteArticleLayout;
