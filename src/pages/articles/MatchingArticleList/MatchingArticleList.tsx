import { classNames } from "@utils/classNames";

import { useGetMatchingArticleList } from "@pages/articles/MatchingArticleList/core/matchingArticleList.hook";

import { MatchingArticleCard } from "@pages/articles/MatchingArticleList/components/MatchingArticleCard/MatchingArticleCard";

function MatchingArticleList() {
  const {
    data: {
      data: { results, pagination }
    },
    isLoading,
    isSuccess,
    isError
  } = useGetMatchingArticleList();

  return (
    <div className={classNames("flex flex-col", "px-[80px]")}>
      <div className={"grid grid-cols-4 gap-4"}>
        {results.map(article => (
          <MatchingArticleCard {...article} />
        ))}
      </div>
    </div>
  );
}

export default MatchingArticleList;
