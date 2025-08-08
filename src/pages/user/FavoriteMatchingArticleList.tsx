import { useNavigate } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { useGetFavoriteMatchingArticleList } from "@features/user/favoriteMatchingArticleList/favoriteMatchingArticleList.hook";

import { useFavoriteMatchingArticlePageStore } from "@features/user/favoriteMatchingArticleList/favoriteMatchingArticleList.store";

import { EmptyState } from "@components/common/EmptyState/EmptyState";
import { Pagination } from "@components/common/Pagination/Pagination";
import { MatchingArticleCard } from "@components/shared/MatchingArticleCard/MatchingArticleCard";

function FavoriteMatchingArticleList() {
  const navigator = useNavigate();

  const {
    data: {
      data: {
        results,
        pagination: { totalCount, totalPages },
      },
    },
  } = useGetFavoriteMatchingArticleList();

  const { page, setPage } = useFavoriteMatchingArticlePageStore();

  return (
    <div
      className={classNames(
        "flex flex-col",
        results.length === 0 &&
          "h-[756px] justify-center rounded-[20px] border border-talearnt_Line_01"
      )}
    >
      {results.length === 0 ? (
        <EmptyState
          title={"아직 찜한 게시물이 없어요"}
          description={"마음에 드는 게시물을 찜해보세요!"}
          buttonData={{
            buttonText: "게시물 찜하러 가기",
            buttonOnClick: () => navigator("/matching"),
          }}
        />
      ) : (
        <>
          <div className={classNames("flex items-center", "mb-4 h-10")}>
            <span className={"text-heading3_22_semibold text-talearnt_Text_02"}>
              총
            </span>
            <span
              className={classNames(
                "ml-1",
                "text-heading2_24_semibold text-talearnt_Primary_01"
              )}
            >
              {totalCount}
            </span>
            <span className={"text-heading3_22_semibold text-talearnt_Text_02"}>
              개의 매칭 게시물을 찜했어요
            </span>
          </div>
          <div className={"grid grid-cols-[repeat(3,305px)] gap-5"}>
            {results.map(({ exchangePostNo, ...article }) => (
              <MatchingArticleCard
                {...article}
                exchangePostNo={exchangePostNo}
                key={exchangePostNo}
              />
            ))}
          </div>
          <Pagination
            className={"mt-14"}
            currentPage={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default FavoriteMatchingArticleList;
