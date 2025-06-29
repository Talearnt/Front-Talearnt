import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getMatchingArticleList } from "@features/articles/matchingArticleList/matchingArticleList.api";
import {
  postMatchingArticle,
  putEditMatchingArticle,
} from "@features/articles/writeMatchingArticle/writeMatchingArticle.api";

import { createQueryKey } from "@shared/utils/createQueryKey";
import { findTalentList } from "@shared/utils/findTalent";

import { useGetProfile } from "@features/user/user.hook";

import { useMatchingArticleListFilterStore } from "@features/articles/matchingArticleList/matchingArticleList.store";
import {
  useEditMatchingArticleDataStore,
  useHasNewMatchingArticleStore,
} from "@features/articles/shared/articles.store";

import { queryKeys } from "@shared/constants/queryKeys";

import { matchingArticleDetailType } from "@features/articles/matchingArticleDetail/matchingArticleDetail.type";
import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

const detailQueryKey = (exchangePostNo: number) =>
  createQueryKey([queryKeys.MATCHING, exchangePostNo]);

export const usePostMatchingArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: {
      data: { profileImg, nickname, userNo },
    },
  } = useGetProfile();

  const resetFilters = useMatchingArticleListFilterStore(
    state => state.resetFilters
  );
  const setHasNewMatchingArticle = useHasNewMatchingArticleStore(
    state => state.setHasNewMatchingArticle
  );

  // 매칭 게시물 목록 초기 쿼리 키
  const queryKey = createQueryKey(
    [
      queryKeys.MATCHING,
      { giveTalents: [], receiveTalents: [], order: "recent", page: 1 },
    ],
    { isList: true }
  );

  return useMutation({
    mutationFn: postMatchingArticle,
    onMutate: () => {
      // 모든 매칭 게시물 목록 캐시 제거
      queryClient.removeQueries({
        queryKey: createQueryKey([queryKeys.MATCHING], { isList: true }),
      });
      // 필터 초기화
      resetFilters();
    },
    onSuccess: async (
      { data },
      {
        title,
        content,
        duration,
        exchangeType,
        giveTalents,
        receiveTalents,
        imageUrls,
      }
    ) => {
      // 필터링 되지 않은 매칭 게시물 목록 프리패치
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: async () =>
          await getMatchingArticleList({
            giveTalents: [],
            receiveTalents: [],
            order: "recent",
            page: 1,
          }),
      });

      // 게시물 상세 페이지 저장
      queryClient.setQueryData<
        customAxiosResponseType<matchingArticleDetailType>
      >(detailQueryKey(data), {
        data: {
          profileImg,
          nickname,
          duration,
          exchangeType,
          giveTalents: findTalentList(giveTalents).map(
            ({ talentName }) => talentName
          ),
          receiveTalents: findTalentList(receiveTalents).map(
            ({ talentName }) => talentName
          ),
          exchangePostNo: data,
          status: "모집중" as "모집중" | "모집 완료",
          title,
          createdAt: new Date().toString(),
          favoriteCount: 0,
          isFavorite: false,
          content,
          userNo,
          imageUrls,
          count: 0,
        },
        errorCode: null,
        errorMessage: null,
        success: true,
        status: 200,
      });
      // 애니메이션을 위한 새로운 게시물 플래그
      setHasNewMatchingArticle(true);
      navigator("/matching");
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
    onSuccess: (
      _,
      {
        exchangePostNo,
        title,
        content,
        imageUrls,
        giveTalents,
        receiveTalents,
        duration,
        exchangeType,
      }
    ) => {
      // 상세페이지 들어오기 전 호출했던 목록의 쿼리키
      const queries = queryClient
        .getQueriesData<
          customAxiosResponseType<paginationType<matchingArticleType>>
        >({
          queryKey: createQueryKey([queryKeys.MATCHING], {
            isList: true,
          }),
        })
        .reverse();
      const commonMatchingArticleData = {
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
        imageUrls,
      };

      if (queries.length > 0) {
        // 새롭게 작성된 게시물 저장
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<matchingArticleType>>
        >(queries[0][0], oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.map(article =>
                article.exchangePostNo === exchangePostNo
                  ? { ...article, ...commonMatchingArticleData }
                  : article
              ),
            },
          };
        });
      }

      // 게시물 상세 페이지 저장
      queryClient.setQueryData<
        customAxiosResponseType<matchingArticleDetailType>
      >(detailQueryKey(exchangePostNo), oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...commonMatchingArticleData,
          },
        };
      });
      setEditMatchingArticle(null);
      navigator(-1);
    },
  });
};
