import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { classNames } from "@shared/utils/classNames";

import {
  useGetWrittenCommunityArticleList,
  useGetWrittenMatchingArticleList,
} from "@features/user/writtenArticleList/writtenArticleList.hook";

import {
  useWrittenCommunityArticlePageStore,
  useWrittenMatchingArticlePageStore,
} from "@features/user/writtenArticleList/writtenArticleList.store";

import { EmptyState } from "@components/common/EmptyState/EmptyState";
import { Pagination } from "@components/common/Pagination/Pagination";
import { TabSlider } from "@components/common/TabSlider/TabSlider";
import { CommunityArticleCard } from "@components/shared/CommunityArticleCard/CommunityArticleCard";
import { MatchingArticleCard } from "@components/shared/MatchingArticleCard/MatchingArticleCard";

import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";

const tabOptions = [
  { label: "매칭", value: "matching" },
  { label: "커뮤니티", value: "community" },
];

function WrittenArticleList() {
  const navigator = useNavigate();

  const [tab, setTab] = useState<"matching" | "community">("matching");

  const writtenCommunityArticlePageStore = useWrittenCommunityArticlePageStore(
    useShallow(state => ({
      page: state.page,
      setPage: state.setPage,
    }))
  );
  const writtenMatchingArticlePageStore = useWrittenMatchingArticlePageStore(
    useShallow(state => ({
      page: state.page,
      setPage: state.setPage,
    }))
  );

  const {
    data: { data: writtenMatchingArticleList },
  } = useGetWrittenMatchingArticleList(tab === "matching");
  const {
    data: { data: writtenCommunityArticleList },
  } = useGetWrittenCommunityArticleList(tab === "community");

  const handleTabChange = (value: string) => {
    setTab(value as "matching" | "community");

    if (value === "matching") {
      writtenCommunityArticlePageStore.setPage(1);
    } else {
      writtenMatchingArticlePageStore.setPage(1);
    }
  };
  const handleEmptyStateButtonClick = () => navigator(`/write-article/${tab}`);
  const handlePageChange = (page: number) => {
    currentPageStore.setPage(page);
    window.scrollTo({ top: 0 });
  };

  const { results, pagination } =
    tab === "matching"
      ? writtenMatchingArticleList
      : writtenCommunityArticleList;
  const currentPageStore =
    tab === "matching"
      ? writtenMatchingArticlePageStore
      : writtenCommunityArticlePageStore;
  const currentTabLabel = tab === "matching" ? "매칭" : "커뮤니티";

  return (
    <div className={"flex flex-col"}>
      <TabSlider
        currentValue={tab}
        options={tabOptions}
        onClickHandler={handleTabChange}
        type={"shadow"}
      />
      {results.length === 0 ? (
        <div
          className={classNames(
            "grid place-items-center",
            "mt-6 h-[756px] rounded-[20px] border border-talearnt_Line_01"
          )}
        >
          <EmptyState
            title={`아직 작성한 ${currentTabLabel} 글이 없어요`}
            description={
              tab === "matching"
                ? "당신의 재능을 공유해보세요!"
                : "관심 있는 이야기를 남겨보세요!"
            }
            buttonText={"게시물 작성하기"}
            buttonOnClick={handleEmptyStateButtonClick}
          />
        </div>
      ) : (
        <>
          <div className={classNames("flex items-center", "my-4 h-10")}>
            <span className={"text-heading3_22_semibold text-talearnt_Text_02"}>
              총
            </span>
            <span
              className={classNames(
                "ml-1",
                "text-heading2_24_semibold text-talearnt_Primary_01"
              )}
            >
              {pagination.totalCount}
            </span>
            <span className={"text-heading3_22_semibold text-talearnt_Text_02"}>
              개의 {currentTabLabel} 게시물을 작성했어요
            </span>
          </div>
          <div className={"grid grid-cols-[repeat(3,305px)] gap-5"}>
            {results.map(article => {
              const isMatching = tab === "matching";
              const postNo = isMatching
                ? (article as matchingArticleType).exchangePostNo
                : (article as communityArticleType).communityPostNo;

              return isMatching ? (
                <MatchingArticleCard
                  {...(article as matchingArticleType)}
                  exchangePostNo={postNo}
                  onClickHandler={() => navigator(`/${tab}-article/${postNo}`)}
                  key={postNo}
                />
              ) : (
                <CommunityArticleCard
                  {...(article as communityArticleType)}
                  onClickHandler={() => navigator(`/${tab}-article/${postNo}`)}
                  key={postNo}
                />
              );
            })}
          </div>
          <Pagination
            className={"mt-14"}
            currentPage={currentPageStore.page}
            totalPages={pagination.totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default WrittenArticleList;
