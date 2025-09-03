import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  postCommunityArticle,
  putEditCommunityArticle,
} from "@features/articles/writeCommunityArticle/writeCommunityArticle.api";

import { getCacheManager, QueryKeyFactory } from "@shared/utils/cacheManager";

import { useGetProfile } from "@features/user/profile/profile.hook";

import {
  useEditCommunityArticleDataStore,
  useWriteCommunityArticleStore,
} from "@features/articles/shared/articles.store";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import { customAxiosResponseType } from "@shared/type/api.type";

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

  return useMutation({
    mutationFn: postCommunityArticle,
    // onMutate: 서버 요청 전, UI를 즉시 반응시키기 위한 낙관적 업데이트 수행
    onMutate: async ({ title, content, postType }) => {
      const cacheManager = getCacheManager(queryClient);

      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.community.lists(),
      });

      // 전체 리스트에 추가할 임시 아이템 생성
      const optimisticItem: communityArticleType = {
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

      // 전체 리스트(1페이지)에 임시 아이템 추가
      const allListKey = QueryKeyFactory.community.list({
        postType: undefined,
        page: 1,
      });

      const previous = cacheManager.optimistic.addOptimisticArticle(
        allListKey,
        optimisticItem,
        "prepend"
      );

      return { previous };
    },
    // onError: 요청 실패 시, 이전 스냅샷으로 정확히 롤백
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        const allListKey = QueryKeyFactory.community.list({
          postType: undefined,
          page: 1,
        });
        queryClient.setQueryData(allListKey, context.previous);
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

      // 목록 화면에서 새 게시물 애니메이션 타깃을 위해 ID 저장
      setWriteCommunityArticleId(communityPostNo);

      // 목록 화면으로 이동
      navigator("/community");
    },
    // onSettled: 성공/실패와 무관하게 한 번만 재검증 → 서버 정답으로 최종 동기화
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateCommunityArticle();
    },
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
      const cacheManager = getCacheManager(queryClient);

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

      // 리스트 낙관적 업데이트
      const prevLists =
        cacheManager.optimistic.updateOptimisticArticle<communityArticleType>(
          QueryKeyFactory.community.lists(),
          communityPostNo,
          "communityPostNo",
          common
        );

      return { prevDetail, prevLists };
    },
    // onError: 실패 시 상세/리스트 모두 스냅샷으로 롤백
    onError: (_err, _variables, context) => {
      const cacheManager = getCacheManager(queryClient);

      if (context?.prevDetail) {
        queryClient.setQueryData(
          detailQueryKey(context.prevDetail.data.communityPostNo),
          context.prevDetail
        );
      }

      if (context?.prevLists) {
        cacheManager.optimistic.rollbackToSnapshot(context.prevLists);
      }
    },
    // onSuccess: 편집 상태 해제 후 이전 화면으로 복귀
    onSuccess: (_data, { communityPostNo }) => {
      setEditCommunityArticle(null);
      navigator(`community-article/${communityPostNo}`);
    },
    // onSettled: 상세/리스트 재검증 → 서버 정답으로 최종 일치
    onSettled: async (_data, _error, variables) => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateCommunityArticle(
        variables.communityPostNo
      );
    },
  });
};
