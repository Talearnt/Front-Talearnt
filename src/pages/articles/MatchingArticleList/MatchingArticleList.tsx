import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { classNames } from "@utils/classNames";

import { useGetMatchingArticleList } from "@pages/articles/MatchingArticleList/core/matchingArticleList.hook";

import { useMainScrollRefStore } from "@common/common.store";
import { useHasNewMatchingArticleStore } from "@pages/articles/core/articles.store";
import { useMatchingArticleListFilterStore } from "@pages/articles/MatchingArticleList/core/matchingArticleList.store";

import { MatchingArticleCard } from "@pages/articles/MatchingArticleList/components/MatchingArticleCard/MatchingArticleCard";

import { AnimatedLoader } from "@components/AnimatedLoader/AnimatedLoader";
import { Button } from "@components/Button/Button";
import { DropdownLabeled } from "@components/dropdowns/DropdownLabeled/DropdownLabeled";
import { DropdownWithCategories } from "@components/dropdowns/DropdownWithCategories/DropdownWithCategories";
import { MakoWithPencil } from "@components/icons/mako/MakoWithPencil";
import { Pagination } from "@components/Pagination/Pagination";
import { TopButton } from "@components/TopButton/TopButton";

import {
  durationOptions,
  exchangeTypeList,
  talentsOptions
} from "@pages/articles/WriteArticle/core/writeArticle.constants";

import { durationType, exchangeType } from "@pages/articles/core/articles.type";

function MatchingArticleList() {
  const filterRef = useRef<HTMLDivElement>(null);
  const navigator = useNavigate();

  const {
    data: {
      data: {
        results,
        pagination: { totalPages }
      }
    },
    isLoading,
    isSuccess
  } = useGetMatchingArticleList();

  const {
    giveTalents,
    receiveTalents,
    duration,
    type,
    status,
    order,
    page,
    setFilter,
    resetFilters
  } = useMatchingArticleListFilterStore(
    useShallow(state => ({
      giveTalents: state.giveTalents,
      receiveTalents: state.receiveTalents,
      duration: state.duration,
      type: state.type,
      status: state.status,
      order: state.order,
      page: state.page,
      setFilter: state.setFilter,
      resetFilters: state.resetFilters
    }))
  );
  const hasNewMatchingArticle = useHasNewMatchingArticleStore(
    state => state.hasNewMatchingArticle
  );
  const setHasNewMatchingArticle = useHasNewMatchingArticleStore(
    state => state.setHasNewMatchingArticle
  );
  const mainScrollRef = useMainScrollRefStore(state => state.mainScrollRef);

  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const hasFilter =
    giveTalents.length > 0 ||
    receiveTalents.length > 0 ||
    duration !== undefined ||
    type !== undefined ||
    status !== undefined;

  // 탑 버튼이 필터가 가려진 이후 보여야해서 추적
  useEffect(() => {
    if (!filterRef.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsFilterVisible(entry.isIntersecting);
    });

    observer.observe(filterRef.current);

    return () => observer.disconnect();
  }, []);
  // 애니메이션 완료 후(페이지 이동/이탈) 플래그 원복
  useEffect(() => {
    if (!hasNewMatchingArticle) {
      return;
    }

    setTimeout(() => setHasNewMatchingArticle(false), 1000);

    return () => setHasNewMatchingArticle(false);
  }, [hasNewMatchingArticle, setHasNewMatchingArticle]);

  return (
    <div
      className={classNames(
        "relative",
        "flex flex-col items-center",
        "h-full px-20 pt-8"
      )}
    >
      {/*상단 필터*/}
      <div ref={filterRef} className={classNames("flex gap-4", "mb-6 w-full")}>
        <DropdownWithCategories
          label={`주고 싶은 재능${giveTalents.length > 0 ? ` ${giveTalents.length}` : ""}`}
          options={talentsOptions}
          onSelectHandler={giveTalents =>
            setFilter(prev => ({ ...prev, giveTalents }))
          }
          selectedValue={giveTalents}
        />
        <DropdownWithCategories
          label={`받고 싶은 재능${receiveTalents.length > 0 ? ` ${receiveTalents.length}` : ""}`}
          options={talentsOptions}
          onSelectHandler={receiveTalents =>
            setFilter(prev => ({ ...prev, receiveTalents }))
          }
          selectedValue={receiveTalents}
        />
        <DropdownLabeled<durationType | "">
          options={[{ label: "전체", value: "" }, ...durationOptions]}
          onSelectHandler={({ value }) =>
            setFilter(prev => ({
              ...prev,
              duration: value === "" ? undefined : value
            }))
          }
          selectedValue={duration}
          label={"진행 기간"}
        />
        <DropdownLabeled<exchangeType | "">
          options={[
            { label: "전체", value: "" },
            ...exchangeTypeList.map(item => ({ label: item, value: item }))
          ]}
          onSelectHandler={({ value }) =>
            setFilter(prev => ({
              ...prev,
              type: value === "" ? undefined : value
            }))
          }
          selectedValue={type}
          label={"진행 방식"}
        />
        <label
          className={classNames(
            "peer/label group/label",
            "ml-auto rounded-full border border-talearnt_Icon_03 px-[23px] py-[7px]",
            "cursor-pointer",
            "has-[:checked]:border-talearnt_Primary_01"
          )}
        >
          <input
            className={"peer/checkbox hidden"}
            onChange={({ target }) =>
              setFilter(prev => ({
                ...prev,
                status: target.checked ? "모집중" : undefined
              }))
            }
            checked={status === "모집중"}
            type={"checkbox"}
          />
          <span
            className={classNames(
              "text-body2_16_medium text-talearnt_Text_02",
              "group-hover/label:text-talearnt_Primary_01",
              "peer-checked/checkbox:text-talearnt_Primary_01"
            )}
          >
            모집 중만 보기
          </span>
        </label>
        <DropdownLabeled<"recent" | "popular">
          options={[
            { label: "최신순", value: "recent" },
            { label: "인기순", value: "popular" }
          ]}
          onSelectHandler={({ value }) =>
            setFilter(prev => ({ ...prev, order: value }))
          }
          selectedValue={order}
        />
      </div>
      {/*매칭 게시물 목록 결과*/}
      <div
        className={
          results.length > 0
            ? "grid grid-cols-[repeat(4,305px)] gap-5"
            : classNames("flex flex-col items-center", "mt-[72px]")
        }
      >
        {/*목록 있는 경우*/}
        {results.length > 0
          ? results.map(({ exchangePostNo, ...article }, index) => (
              <MatchingArticleCard
                {...article}
                className={classNames(
                  hasNewMatchingArticle &&
                    (index === 0
                      ? "animate-new_matching_article_reveal"
                      : index < 4 && "animate-new_matching_article_slide")
                )}
                onClickHandler={() =>
                  navigator(`/matching-article/${exchangePostNo}`)
                }
                exchangePostNo={exchangePostNo}
                key={exchangePostNo}
              />
            ))
          : isSuccess && (
              // 목록이 없고 API 호출 성공한 경우
              <>
                <h1
                  className={classNames(
                    "mb-2",
                    "text-heading1_30_semibold text-talearnt_Text_Strong"
                  )}
                >
                  {hasFilter
                    ? "해당 게시글이 없어요..."
                    : "첫 게시글을 작성해 보세요!"}
                </h1>
                <span
                  className={classNames(
                    "mb-6",
                    "text-body2_16_medium text-talearnt_Text_02"
                  )}
                >
                  {hasFilter
                    ? "필터를 초기화하거나 직접 게시글을 작성해 보세요"
                    : "마꼬가 여러분의 게시글을 기다리고 있어요"}
                </span>
                <MakoWithPencil />
                <div className={classNames("flex gap-4", "mt-14")}>
                  {hasFilter && (
                    <Button buttonStyle={"outlined"} onClick={resetFilters}>
                      필터 초기화하기
                    </Button>
                  )}
                  <Button onClick={() => navigator("/write-article")}>
                    게시글 작성하기
                  </Button>
                </div>
              </>
            )}
      </div>
      {/*로딩중 상태*/}
      {isLoading && (
        // dim
        <div
          className={classNames(
            "fixed top-[90px]",
            "h-[calc(100vh-90px)] w-full bg-white/70"
          )}
        >
          <AnimatedLoader
            className={classNames(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            )}
            isGray={results.length > 0}
          />
        </div>
      )}
      {/*페이지네이션*/}
      {results.length > 0 && (
        <Pagination
          className={"mt-14"}
          currentPage={page}
          totalPages={totalPages}
          handlePageChange={page => {
            if (!mainScrollRef?.current) {
              return;
            }

            setFilter(prev => ({ ...prev, page }));
            mainScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {/*탑 버튼*/}
      {!isFilterVisible && <TopButton />}
    </div>
  );
}

export default MatchingArticleList;
