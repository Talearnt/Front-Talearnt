import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getCommunityArticleList } from "@pages/articles/CommunityArticleList/core/communityArticleList.api";
import {
  postCommunityArticle,
  putEditCommunityArticle
} from "@pages/articles/WriteArticle/WriteCommunityArticle/core/writeCommunityArticle.api";

import { createQueryKey } from "@utils/createQueryKey";

import { useGetProfile } from "@hook/user.hook";

import { useCommunityArticleListFilterStore } from "@pages/articles/CommunityArticleList/core/communityArticleList.store";
import {
  useEditCommunityArticleDataStore,
  useHasNewCommunityArticleStore
} from "@pages/articles/core/articles.store";

import { queryKeys } from "@common/common.constants";

import { customAxiosResponseType, paginationType } from "@common/common.type";
import { communityArticleDetailType } from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.type";
import { communityArticleType } from "@pages/articles/CommunityArticleList/core/communityArticleList.type";

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
    { isArticleList: true }
  );

  return useMutation({
    mutationFn: postCommunityArticle,
    onMutate: () => {
      // 모든 커뮤니티 게시물 목록 캐시 제거
      queryClient.removeQueries({
        queryKey: createQueryKey([queryKeys.COMMUNITY], { isArticleList: true })
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
          userNo,
          nickname,
          profileImg,
          communityPostNo: data,
          title,
          createdAt: new Date().toString(),
          content,
          imageUrls,
          postType,
          isLike: false,
          count: 0,
          commentCount: 0,
          likeCount: 0
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
            isArticleList: true
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
