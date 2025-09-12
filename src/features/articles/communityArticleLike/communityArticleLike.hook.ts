import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postCommunityArticleLike } from "@features/articles/communityArticleLike/communityArticleLike.api";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

/**
 * usePostCommunityArticleLike
 * - 커뮤니티 게시글 좋아요/취소를 처리합니다.
 * - Optimistic Update로 즉시 UI 반영하고, 실패시 롤백합니다.
 */
export const usePostCommunityArticleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCommunityArticleLike,
    onMutate: async ({ communityPostNo, isLike }) => {
      /* [onMutate] 1) 관련 쿼리 키 */
      const detailQueryKey = QueryKeyFactory.community.detail(communityPostNo);

      /* [onMutate] 2) 관련 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: detailQueryKey,
      });
      await queryClient.cancelQueries({
        predicate: ({ queryKey }) =>
          QueryKeyFactory.community.all().every(key => queryKey.includes(key)),
      });

      /* [onMutate] 3) 현재 상태 스냅샷 저장 */
      const previousDetail = queryClient.getQueryData(detailQueryKey);
      const previousLists = queryClient.getQueriesData({
        predicate: ({ queryKey }) =>
          QueryKeyFactory.community
            .lists()
            .every(key => queryKey.includes(key)),
      });

      /* [onMutate] 4) Optimistic Update - 상세 페이지 */
      queryClient.setQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(detailQueryKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            isLike,
            likeCount: oldData.data.likeCount + (isLike ? 1 : -1),
          },
        };
      });

      /* [onMutate] 5) Optimistic Update - 리스트 페이지들 */
      previousLists.forEach(([queryKey]) => {
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<communityArticleType>>
        >(queryKey, oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.map(article =>
                article.communityPostNo === communityPostNo
                  ? {
                      ...article,
                      isLike,
                      likeCount: article.likeCount + (isLike ? 1 : -1),
                    }
                  : article
              ),
            },
          };
        });
      });

      return { previousDetail, previousLists };
    },
    onError: (_err, { communityPostNo }, context) => {
      /* [onError] 스냅샷으로 롤백 */
      if (context?.previousDetail) {
        queryClient.setQueryData(
          QueryKeyFactory.community.detail(communityPostNo),
          context.previousDetail
        );
      }

      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
  });
};
