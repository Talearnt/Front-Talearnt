import { useNavigate, useParams } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteCommunityArticle,
  getCommunityArticleDetail,
} from "@features/articles/communityArticleDetail/communityArticleDetail.api";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useToastStore } from "@store/toast.store";

import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

/**
 * useGetCommunityArticleDetail
 * - 커뮤니티 게시글 상세 정보를 조회합니다.
 * - 초기 데이터를 제공하여 첫 렌더 깜빡임을 줄이고, 캐시 정책을 적용합니다.
 */
export const useGetCommunityArticleDetail = () => {
  const { communityPostNo } = useParams();

  const postNo = Number(communityPostNo);

  return useQueryWithInitial(
    {
      commentLastPage: 0,
      communityPostNo: 0,
      content: "",
      count: 0,
      createdAt: "",
      imageUrls: [],
      isLike: false,
      likeCount: 0,
      nickname: "",
      postType: "자유 게시판",
      profileImg: null,
      title: "",
      updatedAt: "",
      userNo: 0,
    },
    {
      queryKey: QueryKeyFactory.community.detail(postNo),
      queryFn: () => getCommunityArticleDetail(postNo),
      enabled: communityPostNo !== undefined,
      ...CACHE_POLICIES.ARTICLE_DETAIL,
    }
  );
};

/**
 * useDeleteCommunityArticle
 * - 커뮤니티 게시글 삭제를 수행합니다.
 * - 상세 캐시 제거 및 모든 리스트 캐시에서 항목을 낙관적으로 제거하고,
 *   실패 시 정확하게 롤백합니다.
 */
export const useDeleteCommunityArticle = () => {
  const { communityPostNo } = useParams();
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setToast = useToastStore(state => state.setToast);

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: () => deleteCommunityArticle(postNo),
    onMutate: async () => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.community.all(),
      });

      /* [onMutate] 2) 스냅샷 저장: 상세/댓글/리스트 */
      const prevDetail = queryClient.getQueryData(
        QueryKeyFactory.community.detail(postNo)
      );
      const prevComments = queryClient.getQueryData(
        QueryKeyFactory.comment.lists(postNo)
      );
      const listQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.community.lists(),
      });
      const prevLists = listQueries.map(([key, data]) => [key, data] as const);

      /* [onMutate] 3-a) 상세 캐시 제거(삭제 후 상세 접근 방지) */
      queryClient.removeQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });
      queryClient.removeQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });

      /* [onMutate] 3-b) 모든 리스트에서 해당 아이템 낙관적 제거 + totalCount 보정 */
      listQueries.forEach(([key]) => {
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<communityArticleType>>
        >(key, oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.filter(
                article => article.communityPostNo !== postNo
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
      return { prevDetail, prevLists, prevComments };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 이전 스냅샷으로 정확히 롤백 */
      if (context?.prevDetail) {
        queryClient.setQueryData(
          QueryKeyFactory.community.detail(postNo),
          context.prevDetail
        );
      }

      if (context?.prevComments) {
        queryClient.setQueryData(
          QueryKeyFactory.comment.lists(postNo),
          context.prevComments
        );
      }

      context?.prevLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      /* [onSuccess] 사용자 피드백 + 목록으로 이동 */
      setToast({ message: "게시물이 삭제되었습니다" });
      navigator("/community");
    },
    onSettled: () => {
      /* [onSettled] 성공/실패와 무관하게 최종 재검증 */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.lists(),
      });
    },
  });
};
