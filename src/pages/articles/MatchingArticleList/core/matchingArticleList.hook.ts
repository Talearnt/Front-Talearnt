import { useEffect } from "react";

import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

import { getMatchingArticleList } from "@pages/articles/MatchingArticleList/core/matchingArticleList.api";

import { createQueryKey } from "@utils/createQueryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

import { useMatchingArticleListFilterStore } from "@pages/articles/MatchingArticleList/core/matchingArticleList.store";

import { queryKeys } from "@common/common.constants";

import { customAxiosResponseType, paginationType } from "@common/common.type";
import { matchingArticleType } from "@pages/articles/MatchingArticleList/core/matchingArticleList.type";

const matchingArticleListQueryKey = createQueryKey([queryKeys.MATCHING], {
  isArticleList: true
});

export const useGetMatchingArticleList = () => {
  const queryClient = useQueryClient();

  const filter = useMatchingArticleListFilterStore(
    useShallow(state => ({
      giveTalents: state.giveTalents,
      receiveTalents: state.receiveTalents,
      duration: state.duration,
      type: state.type,
      status: state.status,
      order: state.order,
      page: state.page
    }))
  );

  const previousQueryData = queryClient
    .getQueriesData<
      customAxiosResponseType<paginationType<matchingArticleType>>
    >({
      queryKey: matchingArticleListQueryKey
    })
    .reverse()
    .find(([, data]) => data !== undefined) as
    | [QueryKey, customAxiosResponseType<paginationType<matchingArticleType>>]
    | undefined;
  const queryKey = createQueryKey([queryKeys.MATCHING, filter], {
    isArticleList: true
  });

  const queryResult = useQueryWithInitial(
    previousQueryData
      ? // 로딩하는 동안 이전 데이터 노출
        previousQueryData[1].data
      : {
          results: [],
          pagination: {
            hasNext: false,
            hasPrevious: false,
            totalPages: 1,
            currentPage: 1,
            totalCount: 0,
            latestCreatedAt: ""
          }
        },
    {
      queryKey,
      queryFn: async () => await getMatchingArticleList(filter)
    }
  );

  useEffect(() => {
    if (queryResult.isSuccess && filter.page > 1) {
      const previousPageData = queryClient
        .getQueriesData<
          customAxiosResponseType<paginationType<matchingArticleType>>
        >({
          queryKey: matchingArticleListQueryKey
        })
        .reverse()
        .find(
          // 현재 로딩중인 쿼리와 다른 쿼리 중 값이 있는 제일 첫 캐시
          ([queryKey]) => JSON.stringify(queryKey) !== JSON.stringify(queryKey)
        )?.[1];

      if (!previousPageData) {
        return;
      }

      const { totalCount, latestCreatedAt } = previousPageData.data.pagination;

      const { totalCount: newTotalCount, latestCreatedAt: newLatestCreatedAt } =
        queryResult.data.data.pagination;

      if (
        newTotalCount !== totalCount ||
        latestCreatedAt !== newLatestCreatedAt
      ) {
        // 새로 불러온 쿼리의 값과 다르다면 기존 캐시 제거
        queryClient.removeQueries({
          queryKey: matchingArticleListQueryKey,
          predicate: query =>
            JSON.stringify(query.queryKey) !== JSON.stringify(queryKey)
        });
      }
    }
  }, [
    filter.page,
    queryClient,
    queryKey,
    queryResult.data.data.pagination,
    queryResult.isSuccess
  ]);

  return queryResult;
};
