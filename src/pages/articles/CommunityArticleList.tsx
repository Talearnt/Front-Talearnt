import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import { useShallow } from "zustand/shallow";

import { classNames } from "@shared/utils/classNames";

import { useGetCommunityArticleList } from "@features/articles/communityArticleList/communityArticleList.hook";

import { useCommunityArticleListFilterStore } from "@features/articles/communityArticleList/communityArticleList.store";
import { useWriteCommunityArticleStore } from "@features/articles/shared/articles.store";

import { AnimatedLoader } from "@components/common/AnimatedLoader/AnimatedLoader";
import { Badge } from "@components/common/Badge/Badge";
import { DropdownLabeled } from "@components/common/dropdowns/DropdownLabeled/DropdownLabeled";
import { Pagination } from "@components/common/Pagination/Pagination";

import { postTypeList } from "@features/articles/shared/articles.constants";

import { communityArticleListFilterType } from "@features/articles/communityArticleList/communityArticleList.type";

function CommunityArticleList() {
  const navigator = useNavigate();

  const { postType, page, setFilter } = useCommunityArticleListFilterStore(
    useShallow(state => ({
      postType: state.postType,
      page: state.page,
      setFilter: state.setFilter,
      resetFilters: state.resetFilters,
    }))
  );
  const { writeCommunityArticleId, setWriteCommunityArticleId } =
    useWriteCommunityArticleStore(
      useShallow(state => ({
        writeCommunityArticleId: state.writeCommunityArticleId,
        setWriteCommunityArticleId: state.setWriteCommunityArticleId,
      }))
    );

  const {
    data: {
      data: {
        results,
        pagination: { totalPages, totalCount },
      },
    },
    isLoading,
    isSuccess,
  } = useGetCommunityArticleList();

  const isFirstPage = page === 1;

  // 새로 작성한 글을 목록의 최상단으로 보이도록 재정렬 (전체 게시판 1페이지이면서 쿼리 성공 시에만)
  const displayResults = useMemo(() => {
    if (!writeCommunityArticleId || !isFirstPage || !isSuccess) {
      return results;
    }

    const idx = results.findIndex(
      item => item.communityPostNo === writeCommunityArticleId
    );

    if (idx <= 0) {
      return results;
    }

    const moved = results[idx];

    return [moved, ...results.slice(0, idx), ...results.slice(idx + 1)];
  }, [isFirstPage, isSuccess, results, writeCommunityArticleId]);

  // 애니메이션 완료 후 타깃 ID 제거(리스트에 새 글이 포함된 경우에만 1초 후 초기화)
  useEffect(() => {
    if (!writeCommunityArticleId || !isFirstPage || !isSuccess) {
      return;
    }

    if (
      !results.some(item => item.communityPostNo === writeCommunityArticleId)
    ) {
      return;
    }

    const timer = setTimeout(() => setWriteCommunityArticleId(null), 1000);

    return () => {
      clearTimeout(timer);
      setWriteCommunityArticleId(null);
    };
  }, [
    isFirstPage,
    isSuccess,
    results,
    setWriteCommunityArticleId,
    writeCommunityArticleId,
  ]);

  return (
    <div
      className={classNames(
        "relative",
        "flex flex-col items-center",
        "h-full w-[1284px] pt-8"
      )}
    >
      {/*상단 필터*/}
      <div
        className={classNames(
          "flex items-center justify-between",
          "mb-6 w-full"
        )}
      >
        <span className={"text-heading3_22_semibold text-talearnt_Text_02"}>
          총
          <span
            className={classNames(
              "ml-1",
              "text-heading2_24_semibold text-talearnt_Primary_01"
            )}
          >
            {isLoading ? "-" : totalCount.toLocaleString()}
          </span>
          개의 커뮤니티 게시물이 있어요
        </span>
        <DropdownLabeled<communityArticleListFilterType["postType"] | "">
          options={[
            { label: "전체", value: "" },
            ...postTypeList.map(item => ({ label: item, value: item })),
          ]}
          onSelectHandler={({ value }) =>
            setFilter(prev => ({
              ...prev,
              postType: value === "" ? undefined : value,
            }))
          }
          selectedValue={postType}
          label={"전체 게시판"}
        />
      </div>
      {/*매칭 게시물 목록 결과*/}
      <table className={classNames("table-fixed", "w-full")}>
        <thead>
          <tr
            className={classNames(
              "relative", // z-index 를 적용하기 위함
              "flex items-center gap-6",
              "z-10 mb-2 h-[55px] rounded-lg bg-talearnt_BG_Up_02 px-6"
            )}
          >
            <th
              className={classNames(
                "w-[760px]",
                "text-body1_18_semibold text-talearnt_Text_02"
              )}
            >
              제목
            </th>
            <th
              className={classNames(
                "w-[120px]",
                "text-body1_18_semibold text-talearnt_Text_02"
              )}
            >
              닉네임
            </th>
            <th
              className={classNames(
                "w-[120px]",
                "text-body1_18_semibold text-talearnt_Text_02"
              )}
            >
              작성일
            </th>
            <th
              className={classNames(
                "w-[70px]",
                "text-body1_18_semibold text-talearnt_Text_02"
              )}
            >
              조회수
            </th>
            <th
              className={classNames(
                "w-[70px]",
                "text-body1_18_semibold text-talearnt_Text_02"
              )}
            >
              추천수
            </th>
          </tr>
        </thead>
        <tbody>
          {displayResults.map(
            ({
              nickname,
              communityPostNo,
              createdAt,
              title,
              postType,
              count,
              likeCount,
            }) => (
              <tr
                className={classNames(
                  "flex items-center gap-6",
                  "mb-2 h-[60px] px-4",
                  "cursor-pointer",
                  communityPostNo === writeCommunityArticleId &&
                    "animate-new_community_article_slide rounded-lg border border-transparent"
                )}
                onClick={() =>
                  navigator(`/community-article/${communityPostNo}`)
                }
                key={communityPostNo}
              >
                <td className={"w-[776px]"}>
                  <div className={"flex items-center gap-2"}>
                    <Badge label={postType} size={"medium"} />
                    <span
                      className={"text-body1_18_medium text-talearnt_Text_02"}
                    >
                      {title}
                    </span>
                    {dayjs(createdAt).isAfter(dayjs().subtract(1, "week")) && (
                      <Badge label={"New"} color={"red"} size={"medium"} />
                    )}
                  </div>
                </td>
                <td
                  className={classNames(
                    "w-[120px]",
                    "text-center text-body2_16_medium text-talearnt_Text_03"
                  )}
                >
                  {nickname}
                </td>
                <td
                  className={classNames(
                    "w-[120px]",
                    "text-center text-body2_16_medium text-talearnt_Text_03"
                  )}
                >
                  {dayjs(createdAt).isSame(dayjs(), "day")
                    ? dayjs(createdAt).format("HH:mm")
                    : dayjs(createdAt).format("YYYY-MM-DD")}
                </td>
                <td
                  className={classNames(
                    "w-[70px]",
                    "text-center text-body2_16_medium text-talearnt_Text_03"
                  )}
                >
                  {count.toLocaleString()}
                </td>
                <td
                  className={classNames(
                    "w-[70px]",
                    "text-center text-body2_16_medium text-talearnt_Text_03"
                  )}
                >
                  {likeCount.toLocaleString()}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
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

export default CommunityArticleList;
