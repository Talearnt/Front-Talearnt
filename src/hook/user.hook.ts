import { getProfile } from "@api/user.api";

import { createAfterSignInQueryKey } from "@utils/queryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

export const useGetProfile = (enabled = true) =>
  useQueryWithInitial(
    {
      giveTalents: [],
      nickname: "",
      profileImg: null,
      receiveTalents: [],
      userNo: 0
    },
    {
      queryKey: createAfterSignInQueryKey(["profile"]),
      queryFn: async () => await getProfile(),
      enabled
    }
  );
