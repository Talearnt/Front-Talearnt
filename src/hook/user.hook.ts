import { getProfile } from "@api/user.api";

import { createQueryKey } from "@utils/createQueryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

import { useAuthStore } from "@pages/auth/core/auth.store";

import { queryKeys } from "@common/common.constants";

export const useGetProfile = (enabled = true) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  return useQueryWithInitial(
    {
      giveTalents: [],
      nickname: "",
      profileImg: null,
      receiveTalents: [],
      userNo: 0
    },
    {
      queryKey: createQueryKey([queryKeys.USER, "profile"], {
        isLoggedIn: true
      }),
      queryFn: async () => await getProfile(),
      enabled: enabled && isLoggedIn
    }
  );
};
