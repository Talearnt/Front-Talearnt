import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postMatchingArticleFavorite } from "@features/articles/matchingArticleFavorite/matchingArticleFavorite.api";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { matchingArticleDetailType } from "@features/articles/matchingArticleDetail/matchingArticleDetail.type";
import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";
import { activityCountsType } from "@features/user/profile/profile.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

/**
 * usePostMatchingArticleFavorite
 * - 매칭 게시글 찜하기/취소를 처리합니다.
 * - Optimistic Update로 즉시 UI 반영하고, 실패 시 롤백합니다.
 */
export const usePostMatchingArticleFavorite = () => {
  const queryClient = useQueryClient();

  const activityCountsQueryKey = QueryKeyFactory.user.activityCounts();

  return useMutation({
    mutationFn: postMatchingArticleFavorite,
    onMutate: async (exchangePostNo: number) => {
      /* [onMutate] 1) 관련 쿼리 키 */
      const detailQueryKey = QueryKeyFactory.matching.detail(exchangePostNo);

      /* [onMutate] 2) 관련 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: detailQueryKey,
      });
      await queryClient.cancelQueries({
        predicate: ({ queryKey }) =>
          QueryKeyFactory.matching.all().every(key => queryKey.includes(key)),
      });
      await queryClient.cancelQueries({
        queryKey: activityCountsQueryKey,
      });

      /* [onMutate] 3) 현재 상태 스냅샷 저장 */
      const previousDetail =
        queryClient.getQueryData<
          customAxiosResponseType<matchingArticleDetailType>
        >(detailQueryKey);
      const previousLists = queryClient.getQueriesData<
        customAxiosResponseType<paginationType<matchingArticleType>>
      >({
        predicate: ({ queryKey }) =>
          QueryKeyFactory.matching.lists().every(key => queryKey.includes(key)),
      });
      const previousActivityCounts = queryClient.getQueryData(
        activityCountsQueryKey
      );

      /* [onMutate] 4) Optimistic Update - 상세 페이지 */
      queryClient.setQueryData<
        customAxiosResponseType<matchingArticleDetailType>
      >(detailQueryKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        const currentIsFavorite = oldData.data.isFavorite;
        const currentFavoriteCount = oldData.data.favoriteCount;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            isFavorite: !currentIsFavorite,
            favoriteCount: currentIsFavorite
              ? currentFavoriteCount - 1
              : currentFavoriteCount + 1,
          },
        };
      });

      /* [onMutate] 5) Optimistic Update - 리스트 페이지들 */
      previousLists.forEach(([queryKey]) => {
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<matchingArticleType>>
        >(queryKey, oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.map(article =>
                article.exchangePostNo === exchangePostNo
                  ? {
                      ...article,
                      isFavorite: !article.isFavorite,
                      favoriteCount: article.isFavorite
                        ? article.favoriteCount - 1
                        : article.favoriteCount + 1,
                    }
                  : article
              ),
            },
          };
        });
      });

      /* [onMutate] 6) Optimistic Update - 활동 counts (증감량 반영) */
      let delta = 0;

      if (previousDetail) {
        delta = previousDetail.data.isFavorite ? -1 : 1;
      } else {
        for (const [, data] of previousLists) {
          const found = data?.data.results.find(
            article => article.exchangePostNo === exchangePostNo
          );

          if (found) {
            delta = found.isFavorite ? -1 : 1;
            break;
          }
        }
      }

      if (delta === 0) {
        delta = 1; // 기본값: 찜 추가로 간주
      }

      queryClient.setQueryData<customAxiosResponseType<activityCountsType>>(
        activityCountsQueryKey,
        oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              favoritePostCount: oldData.data.favoritePostCount + delta,
            },
          };
        }
      );

      return { previousDetail, previousLists, previousActivityCounts };
    },
    onError: (_err, exchangePostNo, context) => {
      /* [onError] 스냅샷으로 롤백 */
      if (context?.previousDetail) {
        queryClient.setQueryData(
          QueryKeyFactory.matching.detail(exchangePostNo),
          context.previousDetail
        );
      }

      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.previousActivityCounts) {
        queryClient.setQueryData(
          activityCountsQueryKey,
          context.previousActivityCounts
        );
      }
    },
  });
};
