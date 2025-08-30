import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  postMatchingArticle,
  putEditMatchingArticle,
} from "@features/articles/writeMatchingArticle/writeMatchingArticle.api";

import { createQueryKey } from "@shared/utils/createQueryKey";
import { findTalentList } from "@shared/utils/findTalent";

import { useGetProfile } from "@features/user/profile/profile.hook";

import {
  useEditMatchingArticleDataStore,
  useWriteMatchingArticleStore,
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
    // - 활성 리스트 쿼리 취소 → 깜빡임 최소화
    // - 최신 리스트(1페이지)에 임시 아이템를 prepend → 사용자 체감 속도 향상
    onMutate: async ({
      title,
      content,
      giveTalents,
      receiveTalents,
      duration,
      exchangeType,
    }) => {
      await queryClient.cancelQueries({
        queryKey: createQueryKey([queryKeys.MATCHING], { isList: true }),
      });

      // 롤백을 위한 이전 리스트 스냅샷 수집
      const previous = queryClient.getQueriesData<
        customAxiosResponseType<paginationType<matchingArticleType>>
      >({
        queryKey: createQueryKey([queryKeys.MATCHING], { isList: true }),
      });

      if (previous.length > 0) {
        // 최신 리스트 캐시에 임시 아이템 추가(맨 앞)
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<matchingArticleType>>
        >(
          createQueryKey(
            [
              queryKeys.MATCHING,
              { giveTalents: [], receiveTalents: [], order: "recent", page: 1 },
            ],
            { isList: true }
          ),
          oldData => {
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
                // 총 개수 증가(임시 반영)
                pagination: {
                  ...oldData.data.pagination,
                  totalCount: oldData.data.pagination.totalCount + 1,
                },
              },
            };
          }
        );
      }

      // onError에서 원복할 수 있도록 스냅샷 전달
      return { previous };
    },
    // onError: 요청 실패 시, 이전 스냅샷으로 정확히 롤백
    onError: (_err, _variables, context) =>
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      }),
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
    onSettled: _data =>
      queryClient.invalidateQueries({
        queryKey: createQueryKey([queryKeys.MATCHING], { isList: true }),
      }),
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
      await queryClient.cancelQueries({
        queryKey: createQueryKey([queryKeys.MATCHING]),
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

      // 리스트 스냅샷 저장(롤백용)
      const listQueries = queryClient.getQueriesData<
        customAxiosResponseType<paginationType<matchingArticleType>>
      >({ queryKey: createQueryKey([queryKeys.MATCHING], { isList: true }) });
      const prevLists = listQueries.map(([key, data]) => [key, data] as const);

      // 모든 리스트 캐시에서 해당 아이템이 있으면 동일 위치에서 값만 교체
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

      // onError에서 복구할 스냅샷 반환
      return { prevDetail, prevLists };
    },
    // onError: 실패 시 상세/리스트 모두 스냅샷으로 롤백
    onError: (_err, _variables, context) => {
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
    // onSuccess: 편집 상태 해제 후 이전 화면으로 복귀
    onSuccess: (_data, { exchangePostNo }) => {
      setEditMatchingArticle(null);
      navigator(`matching-article/${exchangePostNo}`);
    },
    // onSettled: 상세/리스트 재검증 → 서버 정답으로 최종 일치
    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: detailQueryKey(variables.exchangePostNo),
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: createQueryKey([queryKeys.MATCHING], { isList: true }),
          refetchType: "active",
        }),
      ]);
    },
  });
};
