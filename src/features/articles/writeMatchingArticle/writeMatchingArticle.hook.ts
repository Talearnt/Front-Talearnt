import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  postMatchingArticle,
  putEditMatchingArticle,
} from "@features/articles/writeMatchingArticle/writeMatchingArticle.api";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { findTalentList } from "@shared/utils/findTalent";

import { useGetProfile } from "@features/user/profile/profile.hook";

import {
  useEditMatchingArticleDataStore,
  useWriteMatchingArticleStore,
} from "@features/articles/shared/articles.store";

import { matchingArticleDetailType } from "@features/articles/matchingArticleDetail/matchingArticleDetail.type";
import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

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

  /* 1페이지(최신순) 리스트 키: 낙관적 업데이트/정규화에 사용 */
  const firstPageListKey = QueryKeyFactory.matching.list({
    giveTalents: [],
    receiveTalents: [],
    order: "recent",
    page: 1,
  });

  return useMutation({
    mutationFn: postMatchingArticle,
    onMutate: async ({
      title,
      content,
      giveTalents,
      receiveTalents,
      duration,
      exchangeType,
    }) => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.matching.lists(),
      });

      /* [onMutate] 2) 스냅샷 저장: 리스트 */
      const previous = queryClient.getQueriesData({
        queryKey: firstPageListKey,
      });

      /* [onMutate] 3) 낙관적 항목 구성(-1 임시 ID) */
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<matchingArticleType>>
      >(firstPageListKey, oldData => {
        if (!oldData) {
          return oldData;
        }

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
        const recentListKey = QueryKeyFactory.matching.list({
          giveTalents: [],
          receiveTalents: [],
          order: "recent",
          page: 1,
        });
        queryClient.setQueryData(recentListKey, context.previous);
      }
    },
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
      /* [onSuccess] 서버 발급 ID로 상세 캐시 정규화 */
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

      /* [onSuccess] 목록의 임시 항목(-1)을 실제 ID로 교체 */
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<matchingArticleType>>
      >(firstPageListKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            results: oldData.data.results.map(article =>
              article.exchangePostNo === -1
                ? { ...article, exchangePostNo }
                : article
            ),
          },
        };
      });

      /* [onSuccess] 목록 화면에서 새 게시물 애니메이션 타깃을 위해 ID 저장 */
      setWriteMatchingArticleId(exchangePostNo);

      /* [onSuccess] 목록 화면으로 이동 */
      navigator("/matching");
    },
    onSettled: () =>
      /* [onSettled] 성공/실패와 무관하게 최종 재검증 */
      queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.matching.all(),
      }),
  });
};

/**
 * usePutEditMatchingArticle
 * - 매칭 게시물 수정 요청을 담당하는 훅입니다.
 * - 상세/리스트 캐시를 낙관적 업데이트로 동기화하고, 실패 시 스냅샷으로 롤백합니다.
 */
export const usePutEditMatchingArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setEditMatchingArticle = useEditMatchingArticleDataStore(
    state => state.setEditMatchingArticle
  );

  return useMutation({
    mutationFn: putEditMatchingArticle,
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
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.matching.all(),
      });

      /* [onMutate] 2) 스냅샷 저장: 상세/리스트 */
      const prevDetail = queryClient.getQueryData<
        customAxiosResponseType<matchingArticleDetailType>
      >(detailQueryKey(exchangePostNo));
      const listQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.matching.lists(),
      });
      const prevLists = listQueries.map(([key, data]) => [key, data] as const);

      /* [onMutate] 3) 공통 데이터 구성 */
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

      /* [onMutate] 4) 상세 캐시 업데이트 */
      queryClient.setQueryData<
        customAxiosResponseType<matchingArticleDetailType>
      >(detailQueryKey(exchangePostNo), oldData => {
        if (!oldData) {
          return oldData;
        }

        return { ...oldData, data: { ...oldData.data, ...common, imageUrls } };
      });

      /* [onMutate] 5) 리스트 캐시 업데이트 */
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
              results: oldData.data.results.map(article =>
                article.exchangePostNo === exchangePostNo
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
          detailQueryKey(context.prevDetail.data.exchangePostNo),
          context.prevDetail
        );
      }

      context?.prevLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: (_data, { exchangePostNo }) => {
      /* [onSuccess] 폼 상태 초기화 및 상세 페이지로 이동 */
      setEditMatchingArticle(null);
      navigator(`/matching-article/${exchangePostNo}`);
    },
    onSettled: () =>
      /* [onSettled] 성공/실패와 무관하게 최종 재검증 */
      queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.matching.all(),
      }),
  });
};
