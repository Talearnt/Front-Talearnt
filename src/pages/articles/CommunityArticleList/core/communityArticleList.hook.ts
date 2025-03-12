import { useEffect } from "react";

import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

import { getCommunityArticleList } from "@pages/articles/CommunityArticleList/core/communityArticleList.api";

import { createQueryKey } from "@utils/createQueryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

import { useCommunityArticleListFilterStore } from "@pages/articles/CommunityArticleList/core/communityArticleList.store";

import { queryKeys } from "@common/common.constants";

import { customAxiosResponseType, paginationType } from "@common/common.type";
import { communityArticleType } from "@pages/articles/CommunityArticleList/core/communityArticleList.type";

const communityArticleListQueryKey = createQueryKey([queryKeys.COMMUNITY], {
  isArticleList: true
});

export const useGetCommunityArticleList = () => {
  const queryClient = useQueryClient();

  const filter = useCommunityArticleListFilterStore(
    useShallow(state => ({
      postType: state.postType,
      page: state.page
    }))
  );

  const previousQueryData = queryClient
    .getQueriesData<
      customAxiosResponseType<paginationType<communityArticleType>>
    >({
      queryKey: communityArticleListQueryKey
    })
    .reverse()
    .find(([, data]) => data !== undefined) as
    | [QueryKey, customAxiosResponseType<paginationType<communityArticleType>>]
    | undefined;
  const queryKey = createQueryKey([queryKeys.COMMUNITY, filter], {
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
      queryFn: async () => await getCommunityArticleList(filter)
    }
  );

  useEffect(() => {
    if (queryResult.isSuccess && filter.page > 1) {
      const previousPageData = queryClient
        .getQueriesData<
          customAxiosResponseType<paginationType<communityArticleType>>
        >({
          queryKey: communityArticleListQueryKey
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
          queryKey: communityArticleListQueryKey,
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
