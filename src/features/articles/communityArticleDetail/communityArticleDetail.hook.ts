import { useNavigate, useParams } from "react-router-dom";

import type { InfiniteData } from "@tanstack/query-core";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";

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

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useCommunityArticleCommentPageStore } from "@features/articles/communityArticleDetail/communityArticleDetail.store";
import { useToastStore } from "@store/toast.store";

import { queryKeys } from "@shared/constants/queryKeys";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import {
  commentType,
  replyType,
} from "@features/articles/shared/articles.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

/**
 * useGetCommunityArticleDetail
 * - 커뮤니티 게시글 상세 정보를 조회합니다.
 * - 초기 데이터를 제공하여 첫 렌더 깜빡임을 줄이고, 캐시 정책을 적용합니다.
 */
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
      queryKey: QueryKeyFactory.community.detail(postNo),
      queryFn: () => getCommunityArticleDetail(postNo),
      enabled: communityPostNo !== undefined,
      ...CACHE_POLICIES.ARTICLE_DETAIL,
    }
  );
};

/**
 * useDeleteCommunityArticle
 * - 커뮤니티 게시글 삭제를 수행합니다.
 * - 상세 캐시 제거 및 모든 리스트 캐시에서 항목을 낙관적으로 제거하고,
 *   실패 시 정확하게 롤백합니다.
 */
export const useDeleteCommunityArticle = () => {
  const { communityPostNo } = useParams();
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setToast = useToastStore(state => state.setToast);

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: () => deleteCommunityArticle(postNo),
    onMutate: async () => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.community.all(),
      });

      /* [onMutate] 2) 스냅샷 저장: 상세/댓글/리스트 */
      const prevDetail = queryClient.getQueryData(
        QueryKeyFactory.community.detail(postNo)
      );
      const prevComments = queryClient.getQueryData(
        QueryKeyFactory.comment.lists(postNo)
      );
      const listQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.community.lists(),
      });
      const prevLists = listQueries.map(([key, data]) => [key, data] as const);

      /* [onMutate] 3-a) 상세 캐시 제거(삭제 후 상세 접근 방지) */
      queryClient.removeQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });
      queryClient.removeQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });

      /* [onMutate] 3-b) 모든 리스트에서 해당 아이템 낙관적 제거 + totalCount 보정 */
      listQueries.forEach(([key]) => {
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<communityArticleType>>
        >(key, oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.filter(
                article => article.communityPostNo !== postNo
              ),
              pagination: {
                ...oldData.data.pagination,
                totalCount: Math.max(0, oldData.data.pagination.totalCount - 1),
              },
            },
          };
        });
      });

      /* [onMutate] 4) 반환: 롤백용 스냅샷 */
      return { prevDetail, prevLists, prevComments };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 이전 스냅샷으로 정확히 롤백 */
      if (context?.prevDetail) {
        queryClient.setQueryData(
          QueryKeyFactory.community.detail(postNo),
          context.prevDetail
        );
      }

      if (context?.prevComments) {
        queryClient.setQueryData(
          QueryKeyFactory.comment.lists(postNo),
          context.prevComments
        );
      }

      context?.prevLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => {
      /* [onSuccess] 사용자 피드백 + 목록으로 이동 */
      setToast({ message: "게시물이 삭제되었습니다" });
      navigator("/community");
    },
    onSettled: () => {
      /* [onSettled] 성공/실패와 무관하게 최종 재검증 */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.lists(),
      });
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

  const setPage = useCommunityArticleCommentPageStore(state => state.setPage);

  const {
    data: {
      data: { commentLastPage },
    },
  } = useGetCommunityArticleDetail();

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
