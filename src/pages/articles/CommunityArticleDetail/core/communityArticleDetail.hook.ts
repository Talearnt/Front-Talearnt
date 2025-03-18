import { useNavigate, useParams } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

import {
  deleteCommunityArticle,
  getCommunityArticleDetail
} from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.api";
import { getCommunityArticleList } from "@pages/articles/CommunityArticleList/core/communityArticleList.api";

import { createQueryKey } from "@utils/createQueryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

import { useToastStore } from "@common/common.store";
import { useCommunityArticleListFilterStore } from "@pages/articles/CommunityArticleList/core/communityArticleList.store";

import { queryKeys } from "@common/common.constants";

export const useGetCommunityArticleDetail = () => {
  const { communityPostNo } = useParams();

  const postNo = Number(communityPostNo);

  return useQueryWithInitial(
    {
      userNo: 0,
      nickname: "",
      profileImg: null,
      communityPostNo: 0,
      createdAt: "",
      title: "",
      content: "",
      imageUrls: [],
      postType: "자유 게시판",
      isLike: false,
      count: 0,
      commentCount: 0,
      likeCount: 0
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
        queryKey: createQueryKey([queryKeys.COMMUNITY], { isArticleList: true })
      });
      // 커뮤니티 게시물 목록 프리패치
      await queryClient.prefetchQuery({
        queryKey: createQueryKey([queryKeys.COMMUNITY, filter], {
          isArticleList: true
        }),
        queryFn: async () => await getCommunityArticleList(filter)
      });
      navigator("/community");
      setToast({ message: "게시물이 삭제되었습니다" });
    }
  });
};
