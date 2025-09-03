import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  postCommunityArticle,
  putEditCommunityArticle,
} from "@features/articles/writeCommunityArticle/writeCommunityArticle.api";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useGetProfile } from "@features/user/profile/profile.hook";

import {
  useEditCommunityArticleDataStore,
  useWriteCommunityArticleStore,
} from "@features/articles/shared/articles.store";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

const detailQueryKey = (communityPostNo: number) =>
  QueryKeyFactory.community.detail(communityPostNo);

export const usePostCommunityArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setWriteCommunityArticleId = useWriteCommunityArticleStore(
    state => state.setWriteCommunityArticleId
  );

  const {
    data: {
      data: { profileImg, nickname, userNo },
    },
  } = useGetProfile();

  /* 1페이지(최신순) 리스트 키: 낙관적 업데이트/정규화에 사용 */
  const firstPageListKey = QueryKeyFactory.community.list({
    postType: undefined,
    page: 1,
  });

  return useMutation({
    mutationFn: postCommunityArticle,
    onMutate: async ({ title, content, postType }) => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.community.lists(),
      });

      /* [onMutate] 2) 스냅샷 저장: 리스트 */
      const previous = queryClient.getQueriesData({
        queryKey: firstPageListKey,
      });

      /* [onMutate] 3) 낙관적 항목 구성(-1 임시 ID) */
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<communityArticleType>>
      >(firstPageListKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        const optimisticItem = {
          nickname,
          profileImg,
          communityPostNo: -1,
          createdAt: new Date().toString(),
          title,
          content,
          postType,
          isLike: false,
          likeCount: 0,
          commentCount: 0,
          count: 0,
        };

        return {
          ...oldData,
          data: {
            ...oldData.data,
            results: [optimisticItem, ...oldData.data.results],
            pagination: {
              ...oldData.data.pagination,
              totalCount: oldData.data.pagination.totalCount + 1,
            },
          },
        };
      });

      /* [onMutate] 4) 반환: 롤백용 스냅샷 */
      return { previous };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 이전 스냅샷으로 정확히 롤백 */
      if (context?.previous) {
        queryClient.setQueryData(firstPageListKey, context.previous);
      }
    },
    onSuccess: (
      { data: communityPostNo },
      { postType, title, content, imageUrls }
    ) => {
      /* [onSuccess] 서버가 발급한 실제 ID로 상세 캐시 정규화 */
      queryClient.setQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(detailQueryKey(communityPostNo), {
        data: {
          commentLastPage: 0,
          communityPostNo,
          count: 0,
          content,
          createdAt: new Date().toString(),
          imageUrls,
          isLike: false,
          likeCount: 0,
          nickname,
          postType,
          profileImg,
          title,
          updatedAt: "",
          userNo,
        },
        errorCode: null,
        errorMessage: null,
        success: true,
        status: 200,
      });

      /* [onSuccess] 목록의 임시 항목(-1)을 실제 ID로 교체 */
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<communityArticleType>>
      >(firstPageListKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            results: oldData.data.results.map(article =>
              article.communityPostNo === -1
                ? { ...article, communityPostNo }
                : article
            ),
          },
        };
      });

      /* [onSuccess] 목록 화면에서 새 게시물 애니메이션 타깃을 위해 ID 저장 */
      setWriteCommunityArticleId(communityPostNo);

      /* [onSuccess] 목록 화면으로 이동 */
      navigator("/community");
    },
    /* [onSettled] 성공/실패와 무관하게 한 번만 재검증 → 서버 정답으로 최종 동기화 */
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.all(),
      }),
  });
};

/**
 * usePutEditCommunityArticle
 * - 커뮤니티 게시물 수정 요청을 담당하는 훅입니다.
 * - 상세/리스트 캐시를 낙관적 업데이트로 동기화하고, 실패 시 스냅샷으로 롤백합니다.
 */
export const usePutEditCommunityArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setEditCommunityArticle = useEditCommunityArticleDataStore(
    state => state.setEditCommunityArticle
  );

  return useMutation({
    mutationFn: putEditCommunityArticle,
    onMutate: async ({
      communityPostNo,
      postType,
      title,
      content,
      imageUrls,
    }) => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.community.all(),
      });

      /* [onMutate] 2) 스냅샷 저장: 상세/리스트 */
      const prevDetail = queryClient.getQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(detailQueryKey(communityPostNo));
      const listQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.community.lists(),
      });
      const prevLists = listQueries.map(([key, data]) => [key, data] as const);

      /* [onMutate] 3) 공통 데이터 구성 */
      const common = {
        title,
        content,
        postType,
        updatedAt: new Date().toString(),
      };

      /* [onMutate] 4) 상세 캐시 업데이트 */
      queryClient.setQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(detailQueryKey(communityPostNo), oldData => {
        if (!oldData) {
          return oldData;
        }

        return { ...oldData, data: { ...oldData.data, ...common, imageUrls } };
      });

      /* [onMutate] 5) 리스트 캐시 업데이트 */
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
              results: oldData.data.results.map(article =>
                article.communityPostNo === communityPostNo
                  ? { ...article, ...common }
                  : article
              ),
            },
          };
        });
      });

      /* [onMutate] 6) 반환: 롤백용 스냅샷 */
      return { prevDetail, prevLists };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 이전 스냅샷으로 정확히 롤백 */
      if (context?.prevDetail) {
        queryClient.setQueryData(
          detailQueryKey(context.prevDetail.data.communityPostNo),
          context.prevDetail
        );
      }

      context?.prevLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: (_data, { communityPostNo }) => {
      /* [onSuccess] 편집 상태 해제 후 이전 화면으로 복귀 */
      setEditCommunityArticle(null);
      navigator(`community-article/${communityPostNo}`);
    },
    onSettled: (_data, _error, { communityPostNo }) => {
      /* [onSettled] 성공/실패와 무관하게 최종 재검증 */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.all(),
      });

      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comment.lists(communityPostNo),
      });
    },
  });
};
