import { useNavigate, useParams } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteMatchingArticle,
  getMatchingArticleDetail,
} from "@features/articles/matchingArticleDetail/matchingArticleDetail.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useToastStore } from "@store/toast.store";

import { queryKeys } from "@shared/constants/queryKeys";

import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

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
      queryKey: createQueryKey([queryKeys.MATCHING, postNo]),
      queryFn: async () => await getMatchingArticleDetail(postNo),
      enabled: exchangePostNo !== undefined,
      staleTime: 2 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    }
  );
};

export const useDeleteMatchingArticle = () => {
  const { exchangePostNo } = useParams();
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setToast = useToastStore(state => state.setToast);

  const postNo = Number(exchangePostNo);

  // 삭제 낙관적 업데이트 흐름
  // 1) 활성 쿼리 취소 → 깜빡임/경합 최소화
  // 2) 상세/리스트 스냅샷 저장 → 실패 시 정확히 롤백
  // 3) 상세 캐시 제거 + 모든 리스트에서 해당 아이템 낙관적 제거
  // 4) 성공 시 안내 후 목록으로 이동, onSettled에서 최종 재검증
  return useMutation({
    mutationFn: () => deleteMatchingArticle(postNo),
    onMutate: async () => {
      // 1) 활성 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: createQueryKey([queryKeys.MATCHING]),
      });

      // 2) 스냅샷 저장
      const prevDetail = queryClient.getQueryData(
        createQueryKey([queryKeys.MATCHING, postNo])
      );
      const listQueries = queryClient.getQueriesData({
        queryKey: createQueryKey([queryKeys.MATCHING], { isList: true }),
      });
      const prevLists = listQueries.map(([key, data]) => [key, data] as const);

      // 3-a) 상세 캐시 제거(삭제 후 상세 접근 방지)
      queryClient.removeQueries({
        queryKey: createQueryKey([queryKeys.MATCHING, postNo]),
      });

      // 3-b) 모든 리스트에서 해당 아이템 낙관적 제거 + totalCount 보정
      listQueries.forEach(([key]) => {
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<matchingArticleType>>
        >(key, oldData => {
          if (!oldData) {
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

      // 2)에서 저장한 스냅샷 반환 → onError에서 롤백에 사용
      return { prevDetail, prevLists };
    },
    onError: (_err, exchangePostNo, context) => {
      // 실패 시 상세/리스트 모두 정확히 원복
      if (context?.prevDetail) {
        queryClient.setQueryData(
          createQueryKey([queryKeys.MATCHING, exchangePostNo]),
          context.prevDetail
        );
      }

      context?.prevLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      // 사용자 피드백 + 목록으로 이동
      setToast({ message: "게시물이 삭제되었습니다" });
      navigator("/matching");
    },
    onSettled: async exchangePostNo => {
      // 상세/리스트를 한 번 더 재검증하여 서버 정답으로 최종 동기화
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: createQueryKey([queryKeys.MATCHING, exchangePostNo]),
        }),
        queryClient.invalidateQueries({
          queryKey: createQueryKey([queryKeys.MATCHING], { isList: true }),
        }),
      ]);
    },
  });
};
