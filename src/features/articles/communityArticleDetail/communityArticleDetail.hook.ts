import { useNavigate, useParams } from "react-router-dom";

import type { InfiniteData } from "@tanstack/query-core";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import { useShallow } from "zustand/shallow";

import {
  deleteCommunityArticle,
  deleteCommunityArticleComment,
  deleteCommunityArticleReply,
  getCommunityArticleCommentList,
  getCommunityArticleDetail,
  getCommunityArticleReplyList,
  postCommunityArticleComment,
  postCommunityArticleReply,
  putEditCommunityArticleComment,
  putEditCommunityArticleReply,
} from "@features/articles/communityArticleDetail/communityArticleDetail.api";
import { getCommunityArticleList } from "@features/articles/communityArticleList/communityArticleList.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import {
  useCommunityArticleCommentDeletedAtStore,
  useCommunityArticleCommentPageStore,
} from "@features/articles/communityArticleDetail/communityArticleDetail.store";
import { useCommunityArticleListFilterStore } from "@features/articles/communityArticleList/communityArticleList.store";
import { useToastStore } from "@store/toast.store";

import { queryKeys } from "@shared/constants/queryKeys";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import {
  commentType,
  replyType,
} from "@features/articles/shared/articles.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

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
      userNo: 0,
    },
    {
      queryKey: createQueryKey([queryKeys.COMMUNITY, postNo]),
      queryFn: () => getCommunityArticleDetail(postNo),
      enabled: communityPostNo !== undefined,
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
      page: state.page,
    }))
  );
  const setToast = useToastStore(state => state.setToast);

  return useMutation({
    mutationFn: deleteCommunityArticle,
    onSuccess: async () => {
      // 모든 커뮤니티 게시물 목록 캐시 제거
      queryClient.removeQueries({
        queryKey: createQueryKey([queryKeys.COMMUNITY], { isList: true }),
      });
      // 커뮤니티 게시물 목록 프리패치
      await queryClient.prefetchQuery({
        queryKey: createQueryKey([queryKeys.COMMUNITY, filter], {
          isList: true,
        }),
        queryFn: async () => await getCommunityArticleList(filter),
      });
      navigator("/community");
      setToast({ message: "게시물이 삭제되었습니다" });
    },
  });
};

// ***********************
// 댓글 관련 hook
// ***********************
// 커뮤니티 게시글 댓글 작성
export const usePostCommunityArticleComment = () => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const {
    data: {
      data: { commentLastPage },
    },
  } = useGetCommunityArticleDetail();

  const setPage = useCommunityArticleCommentPageStore(state => state.setPage);

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: (content: string) =>
      postCommunityArticleComment({ communityPostNo: postNo, content }),
    onSuccess: data => {
      const {
        data: {
          pagination: { currentPage, totalPages },
        },
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
              commentLastPage: totalPages,
            },
          };
        });
      }

      // 댓글 목록 저장
      queryClient.setQueryData(
        createQueryKey([queryKeys.COMMUNITY_COMMENT, postNo, currentPage], {
          isList: true,
        }),
        data
      );

      setPage(totalPages);
    },
  });
};

// 커뮤니티 게시글 댓글 리스트
export const useGetCommunityArticleCommentList = () => {
  const { communityPostNo } = useParams();

  const page = useCommunityArticleCommentPageStore(state => state.page);
  const deletedAt = useCommunityArticleCommentDeletedAtStore(
    state => state.deletedAt
  );

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
        latestCreatedAt: "",
      },
    },
    {
      queryKey: createQueryKey([queryKeys.COMMUNITY_COMMENT, postNo, page], {
        isList: true,
      }),
      queryFn: () =>
        getCommunityArticleCommentList({
          communityPostNo: postNo,
          page,
          deletedAt,
        }),
      enabled: communityPostNo !== undefined && page !== 0,
    },
    createQueryKey([queryKeys.COMMUNITY_COMMENT, postNo], {
      isList: true,
    })
  );
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
          isList: true,
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
              ),
            },
          };
        }
      ),
  });
};

// 커뮤니티 게시글 댓글 삭제
export const useDeleteCommunityArticleComment = () => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const page = useCommunityArticleCommentPageStore(state => state.page);
  const setDeletedAt = useCommunityArticleCommentDeletedAtStore(
    state => state.setDeletedAt
  );

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: deleteCommunityArticleComment,
    onMutate: () => setDeletedAt(dayjs().toISOString()),
    onSuccess: (_, commentNo) =>
      // 삭제된 댓글 목록 저장
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<commentType>>
      >(
        createQueryKey([queryKeys.COMMUNITY_COMMENT, postNo, page], {
          isList: true,
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
                  ? { ...comment, isDeleted: true }
                  : comment
              ),
            },
          };
        }
      ),
  });
};

// ***********************
// 답글 관련 hook
// ***********************
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
      // 답글 이미 열린 경우
      if (isOpen) {
        queryClient.setQueryData<
          InfiniteData<customAxiosResponseType<paginationType<replyType>>>
        >(
          createQueryKey([queryKeys.COMMUNITY_REPLY, commentNo], {
            isList: true,
          }),
          oldData => {
            if (!oldData) {
              return oldData;
            }

            return {
              ...oldData,
              pages: oldData.pages.map((page, idx, array) => {
                // 제일 처음 호출된 쿼리에 새로 달린 답글 추가
                if (idx === array.length - 1) {
                  return {
                    ...page,
                    data: {
                      ...page.data,
                      results: [...page.data.results, reply],
                    },
                  };
                }
                return page;
              }),
            };
          }
        );
      }
    },
  });
};

// 커뮤니티 게시글 답글 리스트
export const useGetCommunityArticleReplyList = (
  commentNo: number,
  enabled: boolean
) =>
  useInfiniteQuery<
    customAxiosResponseType<paginationType<replyType>>, // queryFn 타입
    Error, // error 타입
    replyType[], // select 타입
    unknown[], // queryKey 타입
    number | undefined // pageParam 타입
  >({
    enabled,
    queryKey: createQueryKey([queryKeys.COMMUNITY_REPLY, commentNo], {
      isList: true,
    }),
    queryFn: ({ pageParam }) =>
      getCommunityArticleReplyList({ commentNo, lastNo: pageParam }),
    getPreviousPageParam: lastPage =>
      lastPage.data.pagination.hasNext
        ? lastPage.data.results[0].replyNo
        : undefined,
    getNextPageParam: () => undefined,
    select: data => data.pages.flatMap(page => page.data.results),
    initialPageParam: undefined,
  });

// 커뮤니티 게시글 답글 수정
export const usePutEditCommunityArticleReply = (
  commentNo: number,
  replyNo: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      putEditCommunityArticleReply({ replyNo, content }),
    onSuccess: (_, content) =>
      // 수정된 답글 목록 저장
      queryClient.setQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(
        createQueryKey([queryKeys.COMMUNITY_REPLY, commentNo], {
          isList: true,
        }),
        oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              data: {
                ...page.data,
                results: page.data.results.map(reply =>
                  reply.replyNo === replyNo ? { ...reply, content } : reply
                ),
              },
            })),
          };
        }
      ),
  });
};

// 커뮤니티 게시글 답글 삭제
export const useDeleteCommunityArticleReply = (
  commentNo: number,
  replyNo: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCommunityArticleReply(replyNo),
    onSuccess: () =>
      // 삭제된 답글 목록 저장
      queryClient.setQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(
        createQueryKey([queryKeys.COMMUNITY_REPLY, commentNo], {
          isList: true,
        }),
        oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              data: {
                ...page.data,
                results: page.data.results.map(reply =>
                  reply.replyNo === replyNo
                    ? { ...reply, isDeleted: true }
                    : reply
                ),
              },
            })),
          };
        }
      ),
  });
};
