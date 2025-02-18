import { getProfile } from "@api/user.api";

import { createQueryKey } from "@utils/queryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

import { useAuthStore } from "@pages/auth/auth.store";

export const useGetProfile = (enabled = true) => {
  const accessToken = useAuthStore(state => state.accessToken);

  return useQueryWithInitial(
    {
      giveTalents: [],
      nickname: "",
      profileImg: null,
      receiveTalents: [],
      userNo: 0
    },
    {
      queryKey: createQueryKey(["profile"], { isLoggedIn: true }),
      queryFn: async () => await getProfile(),
      enabled: enabled && !!accessToken
    }
  );
};
