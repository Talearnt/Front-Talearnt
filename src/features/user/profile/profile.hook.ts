import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postToGetPresignedURL } from "@features/articles/shared/writeArticle.api";
import {
  getActivityCounts,
  getProfile,
  putProfile,
} from "@features/user/profile/profile.api";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useAuthStore } from "@store/user.store";

import { profileType } from "@features/user/profile/profile.type";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

// 프로필 조회
export const useGetProfile = (enabled = true) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  return useQueryWithInitial(
    {
      giveTalents: [],
      nickname: "",
      profileImg: null,
      receiveTalents: [],
      userId: "",
      userNo: 0,
    },
    {
      queryKey: QueryKeyFactory.user.profile(),
      queryFn: async () => await getProfile(),
      enabled: enabled && isLoggedIn,
      ...CACHE_POLICIES.USER_PROFILE,
    }
  );
};

// 프로필 수정
export const usePutProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      profileImg,
      ...data
    }: Omit<profileType, "userId" | "userNo"> & {
      profileImg: string | null;
      file: File | null;
    }) => {
      if (!file) {
        return await putProfile({ ...data, profileImg });
      }

      const { data: presigned } = await postToGetPresignedURL([
        { fileName: file.name, fileType: file.type, fileSize: file.size },
      ]);

      await fetch(presigned[0], {
        method: "PUT",
        body: file,
        headers: new Headers({ "Content-Type": file.type }),
      });

      const { origin, pathname } = new URL(presigned[0]);

      return await putProfile({ ...data, profileImg: origin + pathname });
    },
    onSuccess: async data => {
      // 선택적 무효화로 개선 - 프로필 이미지/닉네임 변경만 영향
      await queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.user.profile(),
      });

      // 프로필 캐시 직접 업데이트
      queryClient.setQueryData(QueryKeyFactory.user.profile(), data);
    },
  });
};

// 활동 counts 조회
export const useGetActivityCounts = (enabled = true) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  return useQueryWithInitial(
    {
      favoritePostCount: 0,
      myPostCount: 0,
      myCommentCount: 0,
    },
    {
      queryKey: QueryKeyFactory.user.activityCounts(),
      queryFn: getActivityCounts,
      enabled: enabled && isLoggedIn,
      ...CACHE_POLICIES.USER_PROFILE,
    }
  );
};
