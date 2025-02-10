import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@api/user.api";

import { createAfterSignInQueryKey } from "@utils/queryKey";

export const useGetProfile = () =>
  useQuery({
    queryKey: createAfterSignInQueryKey(["profile"]),
    queryFn: async () => await getProfile(),
    initialData: {
      data: {
        giveTalentCodes: [],
        nickname: "",
        profileImg: null,
        receiveTalentCodes: [],
        userNo: 0
      },
      errorCode: null,
      errorMessage: null,
      success: true,
      status: 0
    }
  });
