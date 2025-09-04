import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  postCommunityArticle,
  putEditCommunityArticle,
} from "@features/articles/writeCommunityArticle/writeCommunityArticle.api";

import { useGetProfile } from "@features/user/profile/profile.hook";

import {
  useEditCommunityArticleDataStore,
  useWriteCommunityArticleStore,
} from "@features/articles/shared/articles.store";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

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

  const firstPageListKey = QueryKeyFactory.community.list({
    postType: undefined,
    page: 1,
  });

  return useMutation({
    mutationFn: postCommunityArticle,
    // onMutate: 서버 요청 전, UI를 즉시 반응시키기 위한 낙관적 업데이트 수행
    onMutate: async ({ title, content, postType }) => {
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.community.lists(),
      });

      // 롤백을 위한 이전 리스트 스냅샷 수집
      const previous = queryClient.getQueriesData({
        queryKey: firstPageListKey,
      });

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
            // 총 개수 증가(임시 반영)
            pagination: {
              ...oldData.data.pagination,
              totalCount: oldData.data.pagination.totalCount + 1,
            },
          },
        };
      });

      return { previous };
    },
    // onError: 요청 실패 시, 이전 스냅샷으로 정확히 롤백
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(firstPageListKey, context.previous);
      }
    },
    // onSuccess: 서버가 발급한 실제 ID로 상세 캐시 정규화 + 애니메이션 타깃 저장 + 이동
    onSuccess: (
      { data: communityPostNo },
      { postType, title, content, imageUrls }
    ) => {
      // 상세 캐시를 서버 응답으로 정규화해 상세 페이지 진입 시 즉시 사용 가능
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

      // 목록 화면에서 새 게시물 애니메이션 타깃을 위해 ID 저장
      setWriteCommunityArticleId(communityPostNo);

      // 목록 화면으로 이동
      navigator("/community");
    },
    // onSettled: 성공/실패와 무관하게 한 번만 재검증 → 서버 정답으로 최종 동기화
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.all(),
      }),
  });
};

export const usePutEditCommunityArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setEditCommunityArticle = useEditCommunityArticleDataStore(
    state => state.setEditCommunityArticle
  );

  return useMutation({
    mutationFn: putEditCommunityArticle,
    // onMutate: 수정 전에 상세/리스트 스냅샷 저장 + 낙관적 반영(동일 위치에서 값 교체)
    onMutate: async ({
      communityPostNo,
      postType,
      title,
      content,
      imageUrls,
    }) => {
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.community.all(),
      });

      // 상세 스냅샷 저장(롤백용)
      const prevDetail = queryClient.getQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(detailQueryKey(communityPostNo));

      // 공통 변경 필드 구성(상세/리스트 모두 동일하게 적용)
      const common = {
        title,
        content,
        postType,
        updatedAt: new Date().toString(),
      };

      // 상세 낙관적 반영
      queryClient.setQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(detailQueryKey(communityPostNo), oldData => {
        if (!oldData) {
          return oldData;
        }

        return { ...oldData, data: { ...oldData.data, ...common, imageUrls } };
      });

      // 리스트 스냅샷 저장(롤백용)
      const listQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.community.lists(),
      });
      const prevLists = listQueries.map(([key, data]) => [key, data] as const);

      // 모든 리스트 캐시에서 해당 아이템이 있으면 동일 위치에서 값만 교체
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

      // onError에서 복구할 스냅샷 반환
      return { prevDetail, prevLists };
    },
    // onError: 실패 시 상세/리스트 모두 스냅샷으로 롤백
    onError: (_err, _variables, context) => {
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
    // onSuccess: 편집 상태 해제 후 이전 화면으로 복귀
    onSuccess: (_data, { communityPostNo }) => {
      setEditCommunityArticle(null);
      navigator(`community-article/${communityPostNo}`);
    },
    // onSettled: 상세/리스트 재검증 → 서버 정답으로 최종 일치
    onSettled: (_data, _error, { communityPostNo }) => {
      // 커뮤니티 게시물 목록들 무효화
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.all(),
      });

      // 댓글 무효화 (게시물 삭제 시)
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comment.lists(communityPostNo),
      });
    },
  });
};
