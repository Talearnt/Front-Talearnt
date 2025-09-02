import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { classNames } from "@shared/utils/classNames";

import { useGetMatchingArticleList } from "@features/articles/matchingArticleList/matchingArticleList.hook";

import { useMatchingArticleListFilterStore } from "@features/articles/matchingArticleList/matchingArticleList.store";
import { useWriteMatchingArticleStore } from "@features/articles/shared/articles.store";

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

/**
 * MatchingArticleList
 * - 매칭 게시물 목록을 필터/정렬과 함께 표시합니다.
 * - 새로 작성한 게시물은 1페이지에서 최상단으로 잠시 재정렬하여 강조합니다.
 */
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
  const { writeMatchingArticleId, setWriteMatchingArticleId } =
    useWriteMatchingArticleStore(
      useShallow(state => ({
        writeMatchingArticleId: state.writeMatchingArticleId,
        setWriteMatchingArticleId: state.setWriteMatchingArticleId,
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
  const isFirstPage = page === 1;

  // 새로 작성한 글을 목록의 최상단으로 보이도록 재정렬 (1페이지이면서 쿼리 성공 시에만)
  const displayResults = useMemo(() => {
    if (!writeMatchingArticleId || !isFirstPage || !isSuccess) {
      return results;
    }

    const idx = results.findIndex(
      item => item.exchangePostNo === writeMatchingArticleId
    );

    if (idx <= 0) {
      return results;
    }

    const moved = results[idx];

    return [moved, ...results.slice(0, idx), ...results.slice(idx + 1)];
  }, [isFirstPage, isSuccess, results, writeMatchingArticleId]);

  // 애니메이션 완료 후 타깃 ID 제거(리스트에 새 글이 포함된 경우에만 1초 후 초기화)
  useEffect(() => {
    if (!writeMatchingArticleId || !isFirstPage || !isSuccess) {
      return;
    }

    if (!results.some(item => item.exchangePostNo === writeMatchingArticleId)) {
      return;
    }

    const timer = setTimeout(() => setWriteMatchingArticleId(null), 1000);

    return () => {
      clearTimeout(timer);
      setWriteMatchingArticleId(null);
    };
  }, [
    isFirstPage,
    isSuccess,
    results,
    setWriteMatchingArticleId,
    writeMatchingArticleId,
  ]);
  // 페이지 이탈 시 필터 초기화
  useEffect(() => {
    return () => resetFilters();
  }, [resetFilters]);

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
          displayResults.length > 0
            ? "grid grid-cols-[repeat(4,305px)] gap-5"
            : classNames("flex flex-col items-center", "mt-[72px]")
        }
      >
        {/*목록 있는 경우*/}
        {displayResults.length > 0
          ? displayResults.map(({ exchangePostNo, ...article }, index) => (
              <MatchingArticleCard
                {...article}
                className={classNames(
                  writeMatchingArticleId &&
                    (exchangePostNo === writeMatchingArticleId
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
            isGray={displayResults.length > 0}
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
