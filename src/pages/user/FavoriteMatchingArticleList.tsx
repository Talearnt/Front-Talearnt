import { classNames } from "@shared/utils/classNames";

import { useGetFavoriteMatchingArticleList } from "@features/user/favoriteMatchingArticleList/favoriteMatchingArticleList.hook";

import { useFavoriteMatchingArticlePageStore } from "@features/user/favoriteMatchingArticleList/favoriteMatchingArticleList.store";

import { MatchingArticleCard } from "@components/articles/matchingArticleList/MatchingArticleCard/MatchingArticleCard";
import { Pagination } from "@components/common/Pagination/Pagination";

function FavoriteMatchingArticleList() {
  const {
    data: {
      data: {
        results,
        pagination: { totalPages },
      },
    },
  } = useGetFavoriteMatchingArticleList();

  const { page, setPage } = useFavoriteMatchingArticlePageStore();

  return (
    <div className={"flex flex-col"}>
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
          9
        </span>
        <span className={"text-heading3_22_semibold text-talearnt_Text_02"}>
          개의 매칭 게시물을 찜했어요
        </span>
      </div>
      <div className={"grid grid-cols-[repeat(3,305px)] gap-5"}>
        {/*TODO 리스트 없을 때*/}
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
    </div>
  );
}

export default FavoriteMatchingArticleList;
