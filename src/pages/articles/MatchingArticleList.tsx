import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { classNames } from "@shared/utils/classNames";

import { useGetMatchingArticleList } from "@features/articles/matchingArticleList/matchingArticleList.hook";

import { useMatchingArticleListFilterStore } from "@features/articles/matchingArticleList/matchingArticleList.store";
import { useHasNewMatchingArticleStore } from "@features/articles/shared/articles.store";

import { AnimatedLoader } from "@components/common/AnimatedLoader/AnimatedLoader";
import { DropdownLabeled } from "@components/common/dropdowns/DropdownLabeled/DropdownLabeled";
import { DropdownWithCategories } from "@components/common/dropdowns/DropdownWithCategories/DropdownWithCategories";
import { EmptyState } from "@components/common/EmptyState/EmptyState";
import { Pagination } from "@components/common/Pagination/Pagination";
import { MatchingArticleCard } from "@components/shared/MatchingArticleCard/MatchingArticleCard";

import {
  durationOptions,
  exchangeTypeList,
} from "@features/articles/shared/articles.constants";
import { talentsOptions } from "@shared/constants/talentsOptions";

import {
  durationType,
  exchangeType,
} from "@features/articles/shared/articles.type";

function MatchingArticleList() {
  const filterRef = useRef<HTMLDivElement>(null);
  const navigator = useNavigate();

  const {
    giveTalents,
    receiveTalents,
    duration,
    type,
    status,
    order,
    page,
    setFilter,
    resetFilters,
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
      resetFilters: state.resetFilters,
    }))
  );
  const { hasNewMatchingArticle, setHasNewMatchingArticle } =
    useHasNewMatchingArticleStore(
      useShallow(state => ({
        hasNewMatchingArticle: state.hasNewMatchingArticle,
        setHasNewMatchingArticle: state.setHasNewMatchingArticle,
      }))
    );

  const {
    data: {
      data: {
        results,
        pagination: { totalPages },
      },
    },
    isLoading,
    isSuccess,
  } = useGetMatchingArticleList();

  const hasFilter =
    giveTalents.length > 0 ||
    receiveTalents.length > 0 ||
    duration !== undefined ||
    type !== undefined ||
    status !== undefined;

  // 애니메이션 완료 후 플래그 제거
  useEffect(() => {
    if (!hasNewMatchingArticle) {
      return;
    }

    // 다른 페이지네이션 갔다가 1페이지로 돌아왔을때 애니메이션 방지
    setTimeout(() => setHasNewMatchingArticle(false), 1000);

    // 페이지 이탈 후 복귀시 애니메이션 방지
    return () => setHasNewMatchingArticle(false);
  }, [hasNewMatchingArticle, setHasNewMatchingArticle]);

  return (
    <div
      className={classNames("relative", "flex flex-col items-center", "pt-8")}
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
              duration: value === "" ? undefined : value,
            }))
          }
          selectedValue={duration}
          label={"진행 기간"}
        />
        <DropdownLabeled<exchangeType | "">
          options={[
            { label: "전체", value: "" },
            ...exchangeTypeList.map(item => ({ label: item, value: item })),
          ]}
          onSelectHandler={({ value }) =>
            setFilter(prev => ({
              ...prev,
              type: value === "" ? undefined : value,
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
                status: target.checked ? "모집중" : undefined,
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
            { label: "인기순", value: "popular" },
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
              <EmptyState
                title={
                  hasFilter
                    ? "해당 게시물이 없어요..."
                    : "첫 게시물을 작성해 보세요!!"
                }
                description={
                  hasFilter
                    ? "필터를 초기화하거나 직접 게시물을 작성해 보세요"
                    : "탤런트가 여러분의 게시물을 기다리고 있어요"
                }
                buttonData={{
                  buttonText: "게시물 작성하기",
                  buttonOnClick: () => navigator("/write-article"),
                  subButtonText: hasFilter ? "필터 초기화하기" : undefined,
                  subButtonOnClick: hasFilter ? resetFilters : undefined,
                }}
              />
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
      <Pagination
        className={"mt-14"}
        currentPage={page}
        totalPages={totalPages}
        handlePageChange={page => {
          setFilter(prev => ({ ...prev, page }));
          window.scrollTo({ top: 0 });
        }}
      />
    </div>
  );
}

export default MatchingArticleList;
