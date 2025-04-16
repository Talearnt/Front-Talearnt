import { useNavigate, useParams } from "react-router-dom";

import type { InfiniteData } from "@tanstack/query-core";
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
  getCommunityArticleReplyList,
  postCommunityArticleComment,
  postCommunityArticleReply,
  putEditCommunityArticleComment
} from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.api";
import { getCommunityArticleList } from "@pages/articles/CommunityArticleList/core/communityArticleList.api";

import { createQueryKey } from "@utils/createQueryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

import { useToastStore } from "@common/common.store";
import { useCommunityArticleCommentPageStore } from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.store";
import { useCommunityArticleListFilterStore } from "@pages/articles/CommunityArticleList/core/communityArticleList.store";

import { queryKeys } from "@common/common.constants";

import { customAxiosResponseType, paginationType } from "@common/common.type";
import { communityArticleDetailType } from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.type";
import { commentType, replyType } from "@pages/articles/core/articles.type";

// 커뮤니티 게시글 상세 정보
export const useGetCommunityArticleDetail = () => {
  const { communityPostNo } = useParams();

  const postNo = Number(communityPostNo);

  return useQueryWithInitial(
    {
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
      queryFn: () => getCommunityArticleDetail(postNo),
      enabled: communityPostNo !== undefined
    }
  );
};

// 커뮤니티 게시글 제거
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

// 커뮤니티 게시글 댓글 리스트
export const useGetCommunityArticleCommentList = () => {
  const { communityPostNo } = useParams();

  const page = useCommunityArticleCommentPageStore(state => state.page);

  const postNo = Number(communityPostNo);

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
      queryKey: createQueryKey([queryKeys.COMMUNITY_COMMENT, postNo, page], {
        isList: true
      }),
      queryFn: () =>
        getCommunityArticleCommentList({ communityPostNo: postNo, page }),
      enabled: communityPostNo !== undefined && page !== 0
    },
    createQueryKey([queryKeys.COMMUNITY_COMMENT, postNo], {
      isList: true
    })
  );
};

// 커뮤니티 게시글 특정 댓글의 답글 리스트
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
    queryFn: ({ pageParam }) =>
      getCommunityArticleReplyList({ commentNo, lastNo: pageParam }),
    getPreviousPageParam: lastPage =>
      lastPage.data.pagination.hasNext
        ? lastPage.data.results[0].replyNo
        : undefined,
    getNextPageParam: () => undefined,
    select: data => data.pages.flatMap(page => page.data.results),
    initialPageParam: undefined
  });
};

// 커뮤니티 게시글 댓글 작성
export const usePostCommunityArticleComment = () => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const {
    data: {
      data: { commentLastPage }
    }
  } = useGetCommunityArticleDetail();

  const setPage = useCommunityArticleCommentPageStore(state => state.setPage);

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: (content: string) =>
      postCommunityArticleComment({ communityPostNo: postNo, content }),
    onSuccess: data => {
      const {
        data: {
          pagination: { currentPage, totalPages }
        }
      } = data;

      if (commentLastPage !== totalPages) {
        // 커뮤니티 상세 정보에 댓글 마지막 페이지 저장
        queryClient.setQueryData<
          customAxiosResponseType<communityArticleDetailType>
        >(createQueryKey([queryKeys.COMMUNITY, postNo]), oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              commentLastPage: totalPages
            }
          };
        });
      }

      // 댓글 목록 저장
      queryClient.setQueryData(
        createQueryKey([queryKeys.COMMUNITY_COMMENT, postNo, currentPage], {
          isList: true
        }),
        data
      );

      setPage(totalPages);
    }
  });
};

// 커뮤니티 게시글 댓글 수정
export const usePutEditCommunityArticleComment = () => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const page = useCommunityArticleCommentPageStore(state => state.page);

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: putEditCommunityArticleComment,
    onSuccess: (_, { commentNo, content }) =>
      // 수정된 댓글 목록 저장
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<commentType>>
      >(
        createQueryKey([queryKeys.COMMUNITY_COMMENT, postNo, page], {
          isList: true
        }),
        oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.map(comment =>
                comment.commentNo === commentNo
                  ? { ...comment, content }
                  : comment
              )
            }
          };
        }
      )
  });
};

// 커뮤니티 게시글 답글 작성
export const usePostCommunityArticleReply = (
  commentNo: number,
  isOpen: boolean
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) =>
      await postCommunityArticleReply({ commentNo, content }),
    onSuccess: ({ data: reply }) => {
      if (isOpen) {
        queryClient.setQueryData<
          InfiniteData<customAxiosResponseType<paginationType<replyType>>>
        >(
          createQueryKey([queryKeys.COMMUNITY_REPLY, commentNo], {
            isList: true
          }),
          oldData => {
            if (!oldData) {
              return oldData;
            }

            const { pageParams, pages } = oldData;
            pages[pages.length - 1].data.results.push(reply);

            return { pageParams, pages };
          }
        );
      }
    }
  });
};
