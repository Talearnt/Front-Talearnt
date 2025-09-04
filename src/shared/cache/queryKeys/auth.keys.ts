import {
  createQueryKey,
  QueryKeyEnum,
} from "@shared/cache/queryKeys/queryKeyFactory";

/**
 * 인증 관련 쿼리키
 */
export const AuthQueryKeys = {
  /**
   * 중복 체크
   */
  nicknameCheck: (nickname?: string) =>
    createQueryKey([QueryKeyEnum.AUTH, "nicknameCheck", nickname]),

  userIdCheck: (userId?: string) =>
    createQueryKey([QueryKeyEnum.AUTH, "userIdCheck", userId]),

  /**
   * 랜덤 닉네임
   */
  randomNickname: () => createQueryKey([QueryKeyEnum.AUTH, "randomNickname"]),
} as const;
