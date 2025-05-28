import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getCommunityArticleList } from "@features/articles/communityArticleList/communityArticleList.api";
import {
  postCommunityArticle,
  putEditCommunityArticle
} from "@features/articles/writeCommunityArticle/writeCommunityArticle.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useGetProfile } from "@features/user/user.hook";

import { useCommunityArticleListFilterStore } from "@features/articles/communityArticleList/communityArticleList.store";
import {
  useEditCommunityArticleDataStore,
  useHasNewCommunityArticleStore
} from "@features/articles/shared/articles.store";

import { queryKeys } from "@shared/constants/queryKeys.constants";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

const detailQueryKey = (communityPostNo: number) =>
  createQueryKey([queryKeys.COMMUNITY, communityPostNo]);

export const usePostCommunityArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: {
      data: { profileImg, nickname, userNo }
    }
  } = useGetProfile();

  const resetFilters = useCommunityArticleListFilterStore(
    state => state.resetFilters
  );
  const setHasNewCommunityArticle = useHasNewCommunityArticleStore(
    state => state.setHasNewCommunityArticle
  );

  // 커뮤니티 게시물 목록 초기 쿼리 키
  const queryKey = createQueryKey(
    [queryKeys.COMMUNITY, { postType: undefined, page: 1 }],
    { isList: true }
  );

  return useMutation({
    mutationFn: postCommunityArticle,
    onMutate: () => {
      // 모든 커뮤니티 게시물 목록 캐시 제거
      queryClient.removeQueries({
        queryKey: createQueryKey([queryKeys.COMMUNITY], { isList: true })
      });
      // 필터 초기화
      resetFilters();
    },
    onSuccess: async ({ data }, { postType, title, content, imageUrls }) => {
      // 필터링 되지 않은 커뮤니티 게시물 목록 프리패치
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: async () =>
          await getCommunityArticleList({
            postType: undefined,
            page: 1
          })
      });

      // 게시물 상세 페이지 저장
      queryClient.setQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(detailQueryKey(data), {
        data: {
          commentLastPage: 0,
          communityPostNo: data,
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
          userNo
        },
        errorCode: null,
        errorMessage: null,
        success: true,
        status: 200
      });
      setHasNewCommunityArticle(true);
      navigator("/community");
    }
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
    onSuccess: (
      _,
      { communityPostNo, postType, title, content, imageUrls }
    ) => {
      // 상세페이지 들어오기 전 호출했던 목록의 쿼리키
      const queries = queryClient
        .getQueriesData<
          customAxiosResponseType<paginationType<communityArticleType>>
        >({
          queryKey: createQueryKey([queryKeys.COMMUNITY], {
            isList: true
          })
        })
        .reverse();
      const commonCommunityArticleData = {
        title,
        content,
        imageUrls,
        postType
      };

      if (queries.length > 0) {
        // 새롭게 작성된 게시물 저장
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<communityArticleType>>
        >(queries[0][0], oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.map(article =>
                article.communityPostNo === communityPostNo
                  ? { ...article, ...commonCommunityArticleData }
                  : article
              )
            }
          };
        });
      }

      // 게시물 상세 페이지 저장
      queryClient.setQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(detailQueryKey(communityPostNo), oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...commonCommunityArticleData
          }
        };
      });
      setEditCommunityArticle(null);
      navigator(-1);
    }
  });
};
