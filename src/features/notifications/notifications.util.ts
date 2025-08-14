import dayjs from "dayjs";
/**
 * 상시 포맷터
 * - 1시간 미만: n분 전
 * - 1시간 이상 ~ 24시간 미만: n시간 전
 * - 24시간 이상: n일 전
 */
export function formatRelativeTime(createdAt: string): string {
  const target = dayjs(createdAt);
  const now = dayjs();
  const diffMinutes = Math.max(0, now.diff(target, "minute"));
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }
  const diffHours = now.diff(target, "hour");
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  const diffDays = now.diff(target, "day");
  return `${diffDays}일 전`;
}
