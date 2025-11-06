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
    onMutate: async ({ exchangePostNo, isFavorite }) => {
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
        predicate: ({ queryKey }) =>
          QueryKeyFactory.user.favoriteMatching
            .all()
            .every(key => queryKey.includes(key)),
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
      const previousFavoriteLists = queryClient.getQueriesData<
        customAxiosResponseType<paginationType<matchingArticleType>>
      >({
        predicate: ({ queryKey }) =>
          QueryKeyFactory.user.favoriteMatching
            .all()
            .every(key => queryKey.includes(key)),
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

        return {
          ...oldData,
          data: {
            ...oldData.data,
            isFavorite,
            favoriteCount: oldData.data.favoriteCount + (isFavorite ? 1 : -1),
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
                      isFavorite,
                      favoriteCount:
                        article.favoriteCount + (isFavorite ? 1 : -1),
                    }
                  : article
              ),
            },
          };
        });
      });

      /**
       * [onMutate] 6) Optimistic Update - 찜 목록 페이지들
       *
       * 찜 해제만 Optimistic Update 수행:
       * - 찜 해제는 즉시 UI 반영하여 빠른 UX 제공 (refetch 불필요)
       * - 찜 등록은 Optimistic Update 하지 않음 (onSettled에서 refetch로 정확한 데이터 반영)
       */
      if (!isFavorite) {
        previousFavoriteLists.forEach(([queryKey]) => {
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
                results: oldData.data.results.filter(
                  article => article.exchangePostNo !== exchangePostNo
                ),
                pagination: {
                  ...oldData.data.pagination,
                  totalCount: Math.max(
                    0,
                    oldData.data.pagination.totalCount - 1
                  ),
                },
              },
            };
          });
        });
      }

      /* [onMutate] 7) Optimistic Update - 활동 counts (증감량 반영) */
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
              favoritePostCount:
                oldData.data.favoritePostCount + (isFavorite ? 1 : -1),
            },
          };
        }
      );

      return {
        previousDetail,
        previousLists,
        previousFavoriteLists,
        previousActivityCounts,
      };
    },
    onError: (_err, { exchangePostNo }, context) => {
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

      context?.previousFavoriteLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.previousActivityCounts) {
        queryClient.setQueryData(
          activityCountsQueryKey,
          context.previousActivityCounts
        );
      }
    },
    onSettled: (_data, _error, { isFavorite }) => {
      /**
       * [onSettled] 찜 등록 시 찜 목록 refetch
       *
       * 찜 해제: Optimistic Update만으로 충분 (목록에서 제거는 간단)
       * 찜 등록: refetch로 서버에서 최신 데이터 받아옴
       *   - 이유: 새 항목 추가는 정렬/페이지네이션 고려가 복잡하여
       *           서버를 단일 진실 공급원(Single Source of Truth)으로 사용
       *
       * 결과적으로:
       * - 찜 해제: 즉시 UI 반영 (빠른 UX)
       * - 찜 등록: 서버 응답 후 정확한 데이터 반영 (데이터 정합성)
       */
      if (isFavorite) {
        void queryClient.invalidateQueries({
          predicate: ({ queryKey }) =>
            QueryKeyFactory.user.favoriteMatching
              .all()
              .every(key => queryKey.includes(key)),
        });
      }
    },
  });
};
