import { useNavigate, useParams } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteMatchingArticle,
  getMatchingArticleDetail,
} from "@features/articles/matchingArticleDetail/matchingArticleDetail.api";

import {
  CACHE_POLICIES,
  getCacheManager,
  QueryKeyFactory,
} from "@shared/utils/cacheManager";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useToastStore } from "@store/toast.store";

import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";

export const useGetMatchingArticleDetail = () => {
  const { exchangePostNo } = useParams();

  const postNo = Number(exchangePostNo);

  // 상세 조회
  // - 초기 데이터로 첫 렌더 깜빡임을 줄입니다
  // - staleTime/gcTime으로 신선도/메모리 사용을 균형 있게 관리합니다
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
      staleTime: CACHE_POLICIES.ARTICLE_DETAIL.staleTime,
      gcTime: CACHE_POLICIES.ARTICLE_DETAIL.gcTime,
    }
  );
};

export const useDeleteMatchingArticle = () => {
  const { exchangePostNo } = useParams();
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setToast = useToastStore(state => state.setToast);

  const postNo = Number(exchangePostNo);

  // 삭제 낙관적 업데이트 흐름 - 새로운 캐시 관리자 사용
  return useMutation({
    mutationFn: () => deleteMatchingArticle(postNo),
    onMutate: async () => {
      const cacheManager = getCacheManager(queryClient);

      // 1) 활성 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.matching.all(),
      });

      // 2) 스냅샷 저장 및 3) 낙관적 제거
      const prevDetail = queryClient.getQueryData(
        QueryKeyFactory.matching.detail(postNo)
      );

      const prevLists =
        cacheManager.optimistic.removeOptimisticArticle<matchingArticleType>(
          QueryKeyFactory.matching.lists(),
          postNo,
          "exchangePostNo"
        );

      // 3-a) 상세 캐시 제거(삭제 후 상세 접근 방지)
      queryClient.removeQueries({
        queryKey: QueryKeyFactory.matching.detail(postNo),
      });

      return { prevDetail, prevLists };
    },
    onError: (_err, _variables, context) => {
      const cacheManager = getCacheManager(queryClient);

      // 실패 시 상세/리스트 모두 정확히 원복
      if (context?.prevDetail) {
        queryClient.setQueryData(
          QueryKeyFactory.matching.detail(postNo),
          context.prevDetail
        );
      }

      if (context?.prevLists) {
        cacheManager.optimistic.rollbackToSnapshot(context.prevLists);
      }
    },
    onSuccess: () => {
      // 사용자 피드백 + 목록으로 이동
      setToast({ message: "게시물이 삭제되었습니다" });
      navigator("/matching");
    },
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateMatchingArticle(postNo);
    },
  });
};
