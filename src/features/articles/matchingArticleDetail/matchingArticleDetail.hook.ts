import { useNavigate, useParams } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteMatchingArticle,
  getMatchingArticleDetail,
} from "@features/articles/matchingArticleDetail/matchingArticleDetail.api";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useToastStore } from "@store/toast.store";

import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

/**
 * useGetMatchingArticleDetail
 * - 매칭 게시물 상세 데이터를 조회합니다.
 * - 초기 데이터를 제공하여 첫 렌더 깜빡임을 줄이고, 캐시 정책을 적용합니다.
 */
export const useGetMatchingArticleDetail = () => {
  const { exchangePostNo } = useParams();

  const postNo = Number(exchangePostNo);

  return useQueryWithInitial(
    {
      userNo: 0,
      nickname: "",
      profileImg: null,
      title: "",
      content: "",
      duration: "기간 미정",
      exchangeType: "온라인",
      giveTalents: [],
      receiveTalents: [],
      exchangePostNo: 0,
      status: "모집중",
      createdAt: "",
      favoriteCount: 0,
      isFavorite: false,
      imageUrls: [],
      count: 0,
    },
    {
      queryKey: QueryKeyFactory.matching.detail(postNo),
      queryFn: async () => await getMatchingArticleDetail(postNo),
      enabled: exchangePostNo !== undefined,
      ...CACHE_POLICIES.ARTICLE_DETAIL,
    }
  );
};

/**
 * useDeleteMatchingArticle
 * - 매칭 게시물 삭제를 수행합니다.
 * - 상세 캐시 제거 및 모든 리스트 캐시에서 항목을 낙관적으로 제거하고,
 *   실패 시 정확하게 롤백합니다.
 */
export const useDeleteMatchingArticle = () => {
  const { exchangePostNo } = useParams();
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setToast = useToastStore(state => state.setToast);

  const postNo = Number(exchangePostNo);

  return useMutation({
    mutationFn: () => deleteMatchingArticle(postNo),
    onMutate: async () => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.matching.all(),
      });

      /* [onMutate] 2) 스냅샷 저장: 상세/리스트 */
      const prevDetail = queryClient.getQueryData(
        QueryKeyFactory.matching.detail(postNo)
      );
      const listQueries = queryClient.getQueriesData<
        customAxiosResponseType<paginationType<matchingArticleType>>
      >({
        queryKey: QueryKeyFactory.matching.lists(),
      });
      const prevLists = listQueries.map(([key, data]) => [key, data] as const);

      /* [onMutate] 3-a) 상세 캐시 제거(삭제 후 상세 접근 방지) */
      queryClient.removeQueries({
        queryKey: QueryKeyFactory.matching.detail(postNo),
      });

      /* [onMutate] 3-b) 리스트에서 항목 낙관적 제거 + totalCount 보정 */
      listQueries.forEach(([key]) => {
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<matchingArticleType>>
        >(key, oldData => {
          if (!oldData) {
            return oldData;
          }

          /* 해당 아이템이 없으면 불변 유지 */
          if (
            !oldData.data.results.some(
              article => article.exchangePostNo === postNo
            )
          ) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.filter(
                article => article.exchangePostNo !== postNo
              ),
              pagination: {
                ...oldData.data.pagination,
                totalCount: Math.max(0, oldData.data.pagination.totalCount - 1),
              },
            },
          };
        });
      });

      /* [onMutate] 4) 반환: 롤백용 스냅샷 */
      return { prevDetail, prevLists };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 이전 스냅샷으로 정확히 롤백 */
      if (context?.prevDetail) {
        queryClient.setQueryData(
          QueryKeyFactory.matching.detail(postNo),
          context.prevDetail
        );
      }

      context?.prevLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      /* [onSuccess] 사용자 피드백 + 목록으로 이동 */
      setToast({ message: "게시물이 삭제되었습니다" });
      navigator("/matching");
    },
    onSettled: () =>
      /* [onSettled] 성공/실패와 무관하게 최종 재검증 */
      queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.matching.all(),
      }),
  });
};
