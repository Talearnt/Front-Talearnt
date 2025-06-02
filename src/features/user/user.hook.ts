import { getProfile } from "@features/user/user.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useAuthStore } from "@store/user.store";

import { queryKeys } from "@shared/constants/queryKeys.constants";

export const useGetProfile = (enabled = true) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  return useQueryWithInitial(
    {
      giveTalents: [],
      nickname: "",
      profileImg: null,
      receiveTalents: [],
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
