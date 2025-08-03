import { classNames } from "@shared/utils/classNames";

import { useRealtimeNotifications } from "@features/notifications/notifications.hook";

/**
 * 개발 환경에서 알림 기능을 테스트하기 위한 디버그 패널
 * 실제 배포 시에는 제거하거나 개발 환경에서만 표시하도록 설정
 */
export function NotificationDebugPanel() {
  const { isConnected } = useRealtimeNotifications();

  // 개발 환경이 아니면 렌더링하지 않음
  if (import.meta.env.MODE === "production") {
    return null;
  }

  return (
    <div
      className={classNames(
        "fixed bottom-20 left-4 z-50",
        "w-80 rounded-lg border border-gray-300 bg-white p-4 shadow-lg"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">알림 디버그 패널</h3>
      </div>

      <div className="space-y-3">
        {/* 연결 상태 */}
        <div className="flex items-center justify-between">
          <span className="text-sm">WebSocket 연결:</span>
          <span
            className={classNames(
              "rounded-full px-2 py-1 text-xs",
              isConnected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {isConnected ? "연결됨" : "연결 안됨"}
          </span>
        </div>
      </div>
    </div>
  );
}
