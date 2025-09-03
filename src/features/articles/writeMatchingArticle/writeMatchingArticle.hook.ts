import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  postMatchingArticle,
  putEditMatchingArticle,
} from "@features/articles/writeMatchingArticle/writeMatchingArticle.api";

import { getCacheManager, QueryKeyFactory } from "@shared/utils/cacheManager";
import { findTalentList } from "@shared/utils/findTalent";

import { useGetProfile } from "@features/user/profile/profile.hook";

import {
  useEditMatchingArticleDataStore,
  useWriteMatchingArticleStore,
} from "@features/articles/shared/articles.store";

import { matchingArticleDetailType } from "@features/articles/matchingArticleDetail/matchingArticleDetail.type";
import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";
import { customAxiosResponseType } from "@shared/type/api.type";

const detailQueryKey = (exchangePostNo: number) =>
  QueryKeyFactory.matching.detail(exchangePostNo);

export const usePostMatchingArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setWriteMatchingArticleId = useWriteMatchingArticleStore(
    state => state.setWriteMatchingArticleId
  );

  const {
    data: {
      data: { profileImg, nickname, userNo },
    },
  } = useGetProfile();

  return useMutation({
    mutationFn: postMatchingArticle,
    // onMutate: 서버 요청 전, UI를 즉시 반응시키기 위한 낙관적 업데이트 수행
    onMutate: async ({
      title,
      content,
      giveTalents,
      receiveTalents,
      duration,
      exchangeType,
    }) => {
      const cacheManager = getCacheManager(queryClient);

      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.matching.lists(),
      });

      // 최신 리스트에 추가할 임시 아이템 생성
      const optimisticItem: matchingArticleType = {
        nickname,
        profileImg,
        exchangePostNo: -1,
        createdAt: new Date().toString(),
        title,
        content,
        giveTalents: findTalentList(giveTalents).map(
          ({ talentName }) => talentName
        ),
        receiveTalents: findTalentList(receiveTalents).map(
          ({ talentName }) => talentName
        ),
        duration,
        exchangeType,
        status: "모집중",
        isFavorite: false,
        favoriteCount: 0,
      };

      // 최신 리스트(1페이지)에 임시 아이템 추가
      const recentListKey = QueryKeyFactory.matching.list({
        giveTalents: [],
        receiveTalents: [],
        order: "recent",
        page: 1,
      });

      const previous = cacheManager.optimistic.addOptimisticArticle(
        recentListKey,
        optimisticItem,
        "prepend"
      );

      return { previous };
    },
    // onError: 요청 실패 시, 이전 스냅샷으로 정확히 롤백
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        const recentListKey = QueryKeyFactory.matching.list({
          giveTalents: [],
          receiveTalents: [],
          order: "recent",
          page: 1,
        });
        queryClient.setQueryData(recentListKey, context.previous);
      }
    },
    // onSuccess: 서버가 발급한 실제 ID로 상세 캐시 정규화 + 애니메이션 타깃 저장 + 이동
    onSuccess: (
      { data: exchangePostNo },
      {
        title,
        content,
        giveTalents,
        receiveTalents,
        duration,
        exchangeType,
        imageUrls,
      }
    ) => {
      // 상세 캐시를 서버 응답으로 정규화해 상세 페이지 진입 시 즉시 사용 가능
      queryClient.setQueryData<
        customAxiosResponseType<matchingArticleDetailType>
      >(detailQueryKey(exchangePostNo), {
        data: {
          userNo,
          nickname,
          profileImg,
          exchangePostNo,
          createdAt: new Date().toString(),
          title,
          content,
          imageUrls,
          giveTalents: findTalentList(giveTalents).map(
            ({ talentName }) => talentName
          ),
          receiveTalents: findTalentList(receiveTalents).map(
            ({ talentName }) => talentName
          ),
          duration,
          exchangeType,
          status: "모집중" as "모집중" | "모집 완료",
          isFavorite: false,
          count: 0,
          favoriteCount: 0,
        },
        errorCode: null,
        errorMessage: null,
        success: true,
        status: 200,
      });

      // 목록 화면에서 새 게시물 애니메이션 타깃을 위해 ID 저장
      setWriteMatchingArticleId(exchangePostNo);

      // 목록 화면으로 이동
      navigator("/matching");
    },
    // onSettled: 성공/실패와 무관하게 한 번만 재검증 → 서버 정답으로 최종 동기화
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateMatchingArticle();
    },
  });
};

export const usePutEditMatchingArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setEditMatchingArticle = useEditMatchingArticleDataStore(
    state => state.setEditMatchingArticle
  );

  return useMutation({
    mutationFn: putEditMatchingArticle,
    // onMutate: 수정 전에 상세/리스트 스냅샷 저장 + 낙관적 반영(동일 위치에서 값 교체)
    onMutate: async ({
      exchangePostNo,
      duration,
      exchangeType,
      giveTalents,
      receiveTalents,
      title,
      content,
      imageUrls,
    }) => {
      const cacheManager = getCacheManager(queryClient);

      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.matching.all(),
      });

      // 상세 스냅샷 저장(롤백용)
      const prevDetail = queryClient.getQueryData<
        customAxiosResponseType<matchingArticleDetailType>
      >(detailQueryKey(exchangePostNo));

      // 공통 변경 필드 구성(상세/리스트 모두 동일하게 적용)
      const common = {
        duration,
        exchangeType,
        giveTalents: findTalentList(giveTalents).map(
          ({ talentName }) => talentName
        ),
        receiveTalents: findTalentList(receiveTalents).map(
          ({ talentName }) => talentName
        ),
        title,
        content,
        updatedAt: new Date().toString(),
      };

      // 상세 낙관적 반영
      queryClient.setQueryData<
        customAxiosResponseType<matchingArticleDetailType>
      >(detailQueryKey(exchangePostNo), oldData => {
        if (!oldData) {
          return oldData;
        }

        return { ...oldData, data: { ...oldData.data, ...common, imageUrls } };
      });

      // 리스트 낙관적 업데이트
      const prevLists =
        cacheManager.optimistic.updateOptimisticArticle<matchingArticleType>(
          QueryKeyFactory.matching.lists(),
          exchangePostNo,
          "exchangePostNo",
          common
        );

      return { prevDetail, prevLists };
    },
    // onError: 실패 시 상세/리스트 모두 스냅샷으로 롤백
    onError: (_err, _variables, context) => {
      const cacheManager = getCacheManager(queryClient);

      if (context?.prevDetail) {
        queryClient.setQueryData(
          detailQueryKey(context.prevDetail.data.exchangePostNo),
          context.prevDetail
        );
      }

      if (context?.prevLists) {
        cacheManager.optimistic.rollbackToSnapshot(context.prevLists);
      }
    },
    // onSuccess: 편집 상태 해제 후 이전 화면으로 복귀
    onSuccess: (_data, { exchangePostNo }) => {
      setEditMatchingArticle(null);
      navigator(`matching-article/${exchangePostNo}`);
    },
    // onSettled: 상세/리스트 재검증 → 서버 정답으로 최종 일치
    onSettled: async (_data, _error, variables) => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateMatchingArticle(
        variables.exchangePostNo
      );
    },
  });
};
