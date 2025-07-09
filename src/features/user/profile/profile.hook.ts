import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postToGetPresignedURL } from "@features/articles/shared/writeArticle.api";
import {
  getActivityCounts,
  getProfile,
  putProfile,
} from "@features/user/profile/profile.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useAuthStore } from "@store/user.store";

import { queryKeys } from "@shared/constants/queryKeys";

import { profileType } from "@features/user/profile/profile.type";

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
      queryKey: createQueryKey([queryKeys.USER, "profile"], {
        isLoggedIn: true,
      }),
      queryFn: async () => await getProfile(),
      enabled: enabled && isLoggedIn,
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
      await queryClient.invalidateQueries({
        queryKey: createQueryKey([queryKeys.COMMUNITY], { isList: true }),
      });
      await queryClient.invalidateQueries({
        queryKey: createQueryKey([queryKeys.MATCHING], { isList: true }),
      });
      await queryClient.invalidateQueries({
        queryKey: createQueryKey([queryKeys.COMMUNITY_COMMENT], {
          isList: true,
        }),
      });
      await queryClient.invalidateQueries({
        queryKey: createQueryKey([queryKeys.COMMUNITY_REPLY], {
          isList: true,
        }),
      });

      queryClient.setQueryData(
        createQueryKey([queryKeys.USER, "profile"], {
          isLoggedIn: true,
        }),
        data
      );
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
      queryKey: createQueryKey([queryKeys.USER, "activity-counts"], {
        isLoggedIn: true,
      }),
      queryFn: getActivityCounts,
      enabled: enabled && isLoggedIn,
    }
  );
};
