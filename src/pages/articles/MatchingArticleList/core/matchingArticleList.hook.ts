import { useEffect } from "react";

import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

import { getMatchingArticleList } from "@pages/articles/MatchingArticleList/core/matchingArticleList.api";

import { createQueryKey } from "@utils/createQueryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

import { useFilterStore } from "@pages/articles/MatchingArticleList/core/matchingArticleList.store";

import { queryKeys } from "@common/common.constants";

import { customAxiosResponseType, paginationType } from "@common/common.type";
import { matchingArticleType } from "@pages/articles/MatchingArticleList/core/matchingArticleList.type";

export const useGetMatchingArticleList = () => {
  const queryClient = useQueryClient();

  const filter = useFilterStore(
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
      queryKey: createQueryKey([queryKeys.MATCH], {
        isArticleList: true
      })
    })
    // 초기화 하고 난 뒤부터는 마지막에 호출된값이 나오는게 보장되지 않는듯
    .reverse()
    .find(([, data]) => data !== undefined) as
    | [QueryKey, customAxiosResponseType<paginationType<matchingArticleType>>]
    | undefined;
  console.log(
    queryClient.getQueriesData<
      customAxiosResponseType<paginationType<matchingArticleType>>
    >({
      queryKey: createQueryKey([queryKeys.MATCH], {
        isArticleList: true
      })
    })
  );
  const queryResult = useQueryWithInitial(
    previousQueryData
      ? previousQueryData[1].data
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
      queryKey: createQueryKey([queryKeys.MATCH, filter], {
        isArticleList: true
      }),
      queryFn: async () => await getMatchingArticleList(filter)
    }
  );

  useEffect(() => {
    if (queryResult.isSuccess && filter.page > 1) {
      const previousPageData = queryClient
        .getQueriesData<
          customAxiosResponseType<paginationType<matchingArticleType>>
        >({
          queryKey: createQueryKey([queryKeys.MATCH], {
            isArticleList: true
          })
        })
        .reverse()
        .find(
          ([queryKey]) =>
            JSON.stringify(queryKey) !==
            JSON.stringify(
              createQueryKey([queryKeys.MATCH, filter], { isArticleList: true })
            )
        )?.[1];

      if (!previousPageData) {
        return;
      }

      const { totalCount, latestCreatedAt, currentPage } =
        previousPageData.data.pagination;

      const {
        totalCount: newTotalCount,
        latestCreatedAt: newLatestCreatedAt,
        currentPage: newPage
      } = queryResult.data.data.pagination;

      console.log("memory", totalCount, latestCreatedAt, currentPage);
      console.log("new", newTotalCount, newLatestCreatedAt, newPage);
      if (
        newTotalCount !== totalCount ||
        latestCreatedAt !== newLatestCreatedAt
      ) {
        console.log("초기화");
        void queryClient.invalidateQueries({
          queryKey: createQueryKey([queryKeys.MATCH], { isArticleList: true }),
          predicate: query =>
            JSON.stringify(query.queryKey) !==
            JSON.stringify(
              createQueryKey([queryKeys.MATCH, filter], { isArticleList: true })
            )
        });
      }
    }
  }, [
    filter,
    filter.page,
    queryClient,
    queryResult.data.data.pagination,
    queryResult.isSuccess
  ]);

  return queryResult;
};
