import { useEffect, useRef, useState } from "react";

import dayjs from "dayjs";
import { useShallow } from "zustand/shallow";

import { classNames } from "@utils/classNames";

import { useGetCommunityArticleList } from "@pages/articles/CommunityArticleList/core/communityArticleList.hook";

import { useMainScrollRefStore } from "@common/common.store";
import { useCommunityArticleListFilterStore } from "@pages/articles/CommunityArticleList/core/communityArticleList.store";

import { AnimatedLoader } from "@components/AnimatedLoader/AnimatedLoader";
import { Badge } from "@components/Badge/Badge";
import { DropdownLabeled } from "@components/dropdowns/DropdownLabeled/DropdownLabeled";
import { Pagination } from "@components/Pagination/Pagination";
import { TopButton } from "@components/TopButton/TopButton";

import { postTypeList } from "@pages/articles/core/articles.constants";

import { communityArticleListFilterType } from "@pages/articles/CommunityArticleList/core/communityArticleList.type";

function CommunityArticleList() {
  const filterRef = useRef<HTMLDivElement>(null);

  const {
    data: {
      data: {
        results,
        pagination: { totalPages, totalCount }
      }
    },
    isLoading
  } = useGetCommunityArticleList();

  const { postType, page, setFilter } = useCommunityArticleListFilterStore(
    useShallow(state => ({
      postType: state.postType,
      page: state.page,
      setFilter: state.setFilter,
      resetFilters: state.resetFilters
    }))
  );
  const mainScrollRef = useMainScrollRefStore(state => state.mainScrollRef);

  const [isFilterVisible, setIsFilterVisible] = useState(true);

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
        ref={filterRef}
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
            {totalCount.toLocaleString()}
          </span>
          개의 커뮤니티 게시물이 있어요
        </span>
        <DropdownLabeled<communityArticleListFilterType["postType"] | "">
          options={[
            { label: "전체", value: "" },
            ...postTypeList.map(item => ({ label: item, value: item }))
          ]}
          onSelectHandler={({ value }) =>
            setFilter(prev => ({
              ...prev,
              postType: value === "" ? undefined : value
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
              "flex items-center gap-6",
              "mb-2 h-[55px] rounded-lg bg-talearnt_BG_Up_02 px-6"
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
          {results.map(
            ({ title, nickname, createdAt, count, likeCount, postType }) => (
              <tr
                className={classNames(
                  "flex items-center gap-6",
                  "mb-2 h-[60px] px-4",
                  "cursor-pointer"
                )}
              >
                <td className={"w-[776px]"}>
                  <div className={"flex items-center gap-2"}>
                    <Badge label={postType} size={"medium"} />
                    <span
                      className={"text-body1_18_medium text-talearnt_Text_02"}
                    >
                      {title}
                    </span>
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
                  {dayjs(createdAt).format("YYYY-MM-DD")}
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

export default CommunityArticleList;
