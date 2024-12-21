import { useQuery } from "@tanstack/react-query";

import { getCheckNickName, getCheckUserId } from "@pages/auth/auth.api";

export const useCheckNickname = (
  debounceNickname: string | undefined,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["nicknameCheck", debounceNickname],
    queryFn: async () =>
      await getCheckNickName(encodeURIComponent(debounceNickname as string)),
    enabled,
    staleTime: 1000 * 60
  });
};

export const useCheckUserId = (
  debounceUserId: string | undefined,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["userIdCheck", debounceUserId],
    queryFn: async () => await getCheckUserId(debounceUserId as string),
    enabled,
    staleTime: 1000 * 60
  });
};
