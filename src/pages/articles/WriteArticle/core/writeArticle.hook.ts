import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getMatchingArticleList } from "@pages/articles/MatchingArticleList/core/matchingArticleList.api";
import {
  postMatchingArticle,
  putMatchingArticle
} from "@pages/articles/WriteArticle/core/writeArticle.api";

import { createQueryKey } from "@utils/createQueryKey";
import { filteredTalents } from "@utils/filteredTalents";

import { useGetProfile } from "@hook/user.hook";

import {
  useEditMatchingArticleDataStore,
  useHasNewMatchingArticleStore
} from "@pages/articles/core/articles.store";

import { queryKeys } from "@common/common.constants";

import { customAxiosResponseType, paginationType } from "@common/common.type";
import { matchingArticleDetailType } from "@pages/articles/MatchingArticleDetail/core/matchingArticleDetail.type";
import { matchingArticleType } from "@pages/articles/MatchingArticleList/core/matchingArticleList.type";
import {
  editMatchingArticleDataType,
  matchingArticleBodyType
} from "@pages/articles/WriteArticle/core/writeArticle.type";

const detailQueryKey = (exchangePostNo: number) =>
  createQueryKey([queryKeys.MATCH, exchangePostNo]);

export const usePostMatchingArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: {
      data: { profileImg, nickname, userNo }
    }
  } = useGetProfile();

  const setHasNewMatchingArticle = useHasNewMatchingArticleStore(
    state => state.setHasNewMatchingArticle
  );

  // 매칭 게시물 목록 초기 쿼리 키
  const queryKey = createQueryKey(
    [
      queryKeys.MATCH,
      { giveTalents: [], receiveTalents: [], order: "recent", page: 1 }
    ],
    { isArticleList: true }
  );

  return useMutation({
    mutationFn: async (data: matchingArticleBodyType) =>
      await postMatchingArticle(data),
    onMutate: async () => {
      // 모든 매칭 게시물 목록 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: createQueryKey([queryKeys.MATCH], { isArticleList: true })
      });
      // 필터링 되지 않은 매칭 게시물 목록 프리패치
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: async () =>
          await getMatchingArticleList({
            giveTalents: [],
            receiveTalents: [],
            order: "recent",
            page: 1
          })
      });
    },
    onSuccess: (
      { data },
      {
        title,
        content,
        duration,
        exchangeType,
        giveTalents,
        receiveTalents,
        imageUrls
      }
    ) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      const commonMatchingArticleData = {
        profileImg,
        nickname,
        duration,
        exchangeType,
        giveTalents: filteredTalents(giveTalents).map(
          ({ talentName }) => talentName
        ),
        receiveTalents: filteredTalents(receiveTalents).map(
          ({ talentName }) => talentName
        ),
        exchangePostNo: data,
        status: "모집중" as "모집중" | "모집 완료",
        title,
        createdAt: new Date().toString(),
        favoriteCount: 0,
        isFavorite: false
      };

      // 새롭게 작성된 게시물 저장
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<matchingArticleType>>
      >(queryKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            results: [
              {
                ...commonMatchingArticleData,
                content: doc.body.textContent ?? ""
              },
              ...oldData.data.results.slice(0, -1)
            ]
          }
        };
      });
      // 게시물 상세 페이지 저장
      queryClient.setQueryData<
        customAxiosResponseType<matchingArticleDetailType>
      >(detailQueryKey(data), {
        data: {
          ...commonMatchingArticleData,
          content,
          userNo,
          imageUrls,
          count: 0
        },
        errorCode: null,
        errorMessage: null,
        success: true,
        status: 200
      });
      // 애니메이션을 위한 새로운 게시물 플래그
      setHasNewMatchingArticle(true);
      navigator("/matching");
    }
  });
};

export const usePutEditMatchingArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const editMatchingArticle = useEditMatchingArticleDataStore(
    state => state.editMatchingArticle
  );
  const setEditMatchingArticle = useEditMatchingArticleDataStore(
    state => state.setEditMatchingArticle
  );

  return useMutation({
    mutationFn: async (data: matchingArticleBodyType) =>
      await putMatchingArticle({
        exchangePostNo: (editMatchingArticle as editMatchingArticleDataType)
          .exchangePostNo,
        ...data
      }),
    onSuccess: async (
      _,
      {
        title,
        content,
        duration,
        exchangeType,
        giveTalents,
        receiveTalents,
        imageUrls
      }
    ) => {
      // 모든 매칭 게시물 목록 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: createQueryKey([queryKeys.MATCH], { isArticleList: true })
      });

      const {
        profileImg,
        nickname,
        userNo,
        favoriteCount,
        isFavorite,
        exchangePostNo
      } = editMatchingArticle as editMatchingArticleDataType;

      // 게시물 상세 페이지 저장
      queryClient.setQueryData<
        customAxiosResponseType<matchingArticleDetailType>
      >(detailQueryKey(exchangePostNo), {
        data: {
          profileImg,
          nickname,
          duration,
          exchangeType,
          giveTalents: filteredTalents(giveTalents).map(
            ({ talentName }) => talentName
          ),
          receiveTalents: filteredTalents(receiveTalents).map(
            ({ talentName }) => talentName
          ),
          exchangePostNo,
          status: "모집중" as "모집중" | "모집 완료",
          title,
          createdAt: new Date().toString(),
          favoriteCount,
          isFavorite,
          content,
          userNo,
          imageUrls,
          count: 0
        },
        errorCode: null,
        errorMessage: null,
        success: true,
        status: 200
      });
      setEditMatchingArticle(null);
      navigator(-1);
    }
  });
};
