/**
 * @deprecated 이 파일은 더 이상 사용되지 않습니다.
 * 대신 @features/auth/auth.hook.ts를 사용하세요.
 */

// 기존 코드들을 새 통합 hook에서 re-export하여 호환성 유지
export {
  useCheckNickname,
  useCheckUserId,
  useGetRandomNickname,
  useSignUp,
} from "@features/auth/auth.hook";
