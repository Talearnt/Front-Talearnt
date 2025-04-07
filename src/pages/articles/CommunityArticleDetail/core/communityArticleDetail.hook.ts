import { useNavigate, useParams } from "react-router-dom";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

import {
  deleteCommunityArticle,
  getCommunityArticleCommentList,
  getCommunityArticleDetail,
  getCommunityArticleReplyList
} from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.api";
import { getCommunityArticleList } from "@pages/articles/CommunityArticleList/core/communityArticleList.api";

import { createQueryKey } from "@utils/createQueryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

import { useToastStore } from "@common/common.store";
import { useCommunityArticleCommentPageStore } from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.store";
import { useCommunityArticleListFilterStore } from "@pages/articles/CommunityArticleList/core/communityArticleList.store";

import { queryKeys } from "@common/common.constants";

import { customAxiosResponseType, paginationType } from "@common/common.type";
import { replyType } from "@pages/articles/core/articles.type";

export const useGetCommunityArticleDetail = () => {
  const { communityPostNo } = useParams();

  const postNo = Number(communityPostNo);

  return useQueryWithInitial(
    {
      commentCount: 0,
      commentLastPage: 0,
      communityPostNo: 0,
      content: "",
      count: 0,
      createdAt: "",
      imageUrls: [],
      isLike: false,
      likeCount: 0,
      nickname: "",
      postType: "자유 게시판",
      profileImg: null,
      title: "",
      updatedAt: "",
      userNo: 0
    },
    {
      queryKey: createQueryKey([queryKeys.COMMUNITY, postNo]),
      queryFn: async () => await getCommunityArticleDetail(postNo),
      enabled: communityPostNo !== undefined
    }
  );
};

export const useDeleteCommunityArticle = () => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const filter = useCommunityArticleListFilterStore(
    useShallow(state => ({
      postType: state.postType,
      page: state.page
    }))
  );
  const setToast = useToastStore(state => state.setToast);

  return useMutation({
    mutationFn: deleteCommunityArticle,
    onSuccess: async () => {
      // 모든 커뮤니티 게시물 목록 캐시 제거
      queryClient.removeQueries({
        queryKey: createQueryKey([queryKeys.COMMUNITY], { isList: true })
      });
      // 커뮤니티 게시물 목록 프리패치
      await queryClient.prefetchQuery({
        queryKey: createQueryKey([queryKeys.COMMUNITY, filter], {
          isList: true
        }),
        queryFn: async () => await getCommunityArticleList(filter)
      });
      navigator("/community");
      setToast({ message: "게시물이 삭제되었습니다" });
    }
  });
};

export const useGetCommunityArticleCommentList = () => {
  const { communityPostNo } = useParams();

  const page = useCommunityArticleCommentPageStore(state => state.page);

  const postNo = Number(communityPostNo);
  const queryKey = createQueryKey([queryKeys.COMMUNITY_COMMENT, postNo, page], {
    isList: true
  });

  return useQueryWithInitial(
    {
      results: [],
      pagination: {
        hasNext: false,
        hasPrevious: false,
        totalPages: 1,
        currentPage: 1,
        totalCount: 0,
        latestCreatedAt: ""
      }
    },
    {
      queryKey,
      queryFn: async () =>
        await getCommunityArticleCommentList({ communityPostNo: postNo, page }),
      enabled: communityPostNo !== undefined && page !== 0
    },
    queryKey
  );
};

export const useGetCommunityArticleReplyList = (
  commentNo: number,
  enabled: boolean
) => {
  return useInfiniteQuery<
    customAxiosResponseType<paginationType<replyType>>, // queryFn 타입
    Error, // error 타입
    replyType[], // select 타입
    unknown[], // queryKey 타입
    number | undefined // pageParam 타입
  >({
    enabled,
    queryKey: createQueryKey([queryKeys.COMMUNITY_REPLY, commentNo], {
      isList: true
    }),
    queryFn: async ({ pageParam }) =>
      await getCommunityArticleReplyList({ commentNo, lastNo: pageParam }),
    getNextPageParam: lastPage => {
      const lastIndex = lastPage.data.results.length;

      return lastPage.data.pagination.hasNext
        ? lastPage.data.results[lastIndex - 1].replyNo
        : undefined;
    },
    select: data => data.pages.flatMap(page => page.data.results),
    initialPageParam: undefined
  });
};
