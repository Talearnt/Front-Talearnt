import { useNavigate, useParams } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

import {
  deleteMatchingArticle,
  getMatchingArticleDetail,
} from "@features/articles/matchingArticleDetail/matchingArticleDetail.api";
import { getMatchingArticleList } from "@features/articles/matchingArticleList/matchingArticleList.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useMatchingArticleListFilterStore } from "@features/articles/matchingArticleList/matchingArticleList.store";
import { useToastStore } from "@store/toast.store";

import { queryKeys } from "@shared/constants/queryKeys.constants";

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
      queryKey: createQueryKey([queryKeys.MATCHING, postNo]),
      queryFn: async () => await getMatchingArticleDetail(postNo),
      enabled: exchangePostNo !== undefined,
    }
  );
};

export const useDeleteMatchingArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const filter = useMatchingArticleListFilterStore(
    useShallow(state => ({
      giveTalents: state.giveTalents,
      receiveTalents: state.receiveTalents,
      duration: state.duration,
      type: state.type,
      status: state.status,
      order: state.order,
      page: state.page,
    }))
  );
  const setToast = useToastStore(state => state.setToast);

  return useMutation({
    mutationFn: deleteMatchingArticle,
    onSuccess: async () => {
      // 모든 매칭 게시물 목록 캐시 제거
      queryClient.removeQueries({
        queryKey: createQueryKey([queryKeys.MATCHING], { isList: true }),
      });
      // 매칭 게시물 목록 프리패치
      await queryClient.prefetchQuery({
        queryKey: createQueryKey([queryKeys.MATCHING, filter], {
          isList: true,
        }),
        queryFn: async () => await getMatchingArticleList(filter),
      });
      navigator("/matching");
      setToast({ message: "게시물이 삭제되었습니다" });
    },
  });
};
