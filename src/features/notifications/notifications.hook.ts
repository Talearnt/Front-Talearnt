import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { IMessage } from "@stomp/stompjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
} from "@features/notifications/notifications.api";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import {
  connectWebSocket,
  disconnectWebSocket,
  isWebSocketConnected,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "@shared/utils/websocket";

import { useNotificationStore } from "@features/notifications/notifications.store";
import { useAuthStore } from "@store/user.store";

import { notificationType } from "@features/notifications/notifications.type";

const WEBSOCKET_ENDPOINT = "https://api.talearnt.net/ws";

/**
 * 실시간 알림 + 초기 동기화 코디네이터 (버퍼링 포함)
 * - 연결
 * - 구독(버퍼링)
 * - 초기 REST 동기화 → store 반영
 * - 버퍼 플러시 → 이후 실시간은 즉시 반영
 */
export const useRealtimeNotifications = () => {
  const { pathname } = useLocation();
  const subscriptionIdRef = useRef<string | null>(null);
  const isSyncingRef = useRef<boolean>(true);
  const bufferRef = useRef<notificationType[]>([]);
  const pathnameRef = useRef<string>(pathname);

  const queryClient = useQueryClient();

  const { isLoggedIn } = useAuthStore();
  const { addNotification, setLoading, setNotifications, reset } =
    useNotificationStore();

  // 실시간 알림 메시지 처리: 동기화 중에는 버퍼, 이후에는 즉시 반영
  const handleNotificationMessage = useCallback(
    (message: IMessage) => {
      try {
        const data: notificationType = JSON.parse(message.body);

        if (isSyncingRef.current) {
          bufferRef.current.push(data);
          console.log("📦 동기화 중: 수신 알림을 버퍼에 적재", data);
        } else {
          console.log("📩 실시간 알림 수신", data);
          addNotification(data);

          const { notificationType, targetNo } = data;

          if (notificationType === "관심 키워드") {
            void queryClient.invalidateQueries({
              predicate: ({ queryKey }) =>
                QueryKeyFactory.matching
                  .lists()
                  .every(key => queryKey.includes(key)),
            });
          } else if (notificationType === "댓글") {
            void queryClient.invalidateQueries({
              queryKey: QueryKeyFactory.comment.lists(targetNo),
            });
          } else {
            void queryClient.invalidateQueries({
              queryKey: QueryKeyFactory.reply.lists(targetNo),
            });
          }
        }
      } catch (error) {
        console.error("⚠️ 알림 메시지 파싱 실패", error);
      }
    },
    [addNotification, queryClient]
  );

  // WebSocket 연결 + 구독(버퍼) + 초기 동기화 + 버퍼 플러시
  const connectToWebSocket = useCallback(async () => {
    if (!isLoggedIn) {
      console.log("ℹ️ 로그인 상태가 아니어서 웹소켓 연결을 건너뜀");
      return;
    }

    if (isWebSocketConnected()) {
      console.log("ℹ️ 이미 웹소켓에 연결되어 있음");
      return;
    }

    try {
      setLoading(true);
      console.log("🔌 웹소켓 연결 시도...");

      // 1) 연결 (resolve는 onConnect에서 호출됨)
      await connectWebSocket({
        endpoint: WEBSOCKET_ENDPOINT,
        onConnect: () => {
          console.log("✅ 웹소켓 연결 완료");
        },
        onDisconnect: () => {
          console.log("🔕 웹소켓 연결 해제");
          subscriptionIdRef.current = null;
          isSyncingRef.current = true;
          bufferRef.current = [];
        },
        onError: error => {
          console.error("⚠️ 웹소켓 연결 오류", error);
        },
        // debug: true,
      });

      // 2) 구독을 먼저 시작(버퍼링)
      if (isWebSocketConnected()) {
        const subscriptionId = subscribeToTopic({
          destination: "/user/queue/notifications",
          callback: handleNotificationMessage,
        });
        subscriptionIdRef.current = subscriptionId;
        console.log("🔔 토픽 구독 시작 (버퍼링 모드)");
      }

      // 3) 초기 REST 동기화 → store 반영
      console.log("🌐 초기 알림 동기화 시작...");
      try {
        const { data } = await getNotifications();
        setNotifications(data);
        console.log(`🌐 초기 알림 동기화 완료 (${data.length}건)`);
      } catch (error) {
        console.error("❌ 초기 알림 동기화 실패", error);
      }

      // 4) 버퍼 플러시
      if (bufferRef.current.length > 0) {
        console.log(`📬 버퍼 플러시 (${bufferRef.current.length}건)`);
        for (const item of bufferRef.current) {
          addNotification(item);
        }
        bufferRef.current = [];
      }
      isSyncingRef.current = false;
      console.log("✅ 실시간 반영 모드 전환");
    } catch (error) {
      console.error("❌ 웹소켓 연결 실패", error);
    } finally {
      setLoading(false);
    }
  }, [
    isLoggedIn,
    setLoading,
    setNotifications,
    addNotification,
    handleNotificationMessage,
  ]);

  // WebSocket 연결 해제 함수
  const disconnectFromWebSocket = useCallback(() => {
    if (subscriptionIdRef.current) {
      unsubscribeFromTopic(subscriptionIdRef.current);
      subscriptionIdRef.current = null;
      console.log("🔕 토픽 구독 해제");
    }
    disconnectWebSocket();
    isSyncingRef.current = true;
    bufferRef.current = [];
  }, []);

  // 로그인 상태 변화에 따른 WebSocket 연결/해제
  useEffect(() => {
    if (isLoggedIn) {
      void connectToWebSocket();
    } else {
      disconnectFromWebSocket();
      reset();
    }

    return () => disconnectFromWebSocket();
  }, [isLoggedIn, connectToWebSocket, disconnectFromWebSocket, reset]);
  // pathname 변경에 따른 pathnameRef 업데이트
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
};

/**
 * 알림 액션 전용 훅 (읽음/삭제)
 */
export const useNotifications = () => {
  const { markAsRead, removeNotification } = useNotificationStore();

  // 알림 읽음 처리
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationNos) => markAsRead(notificationNos),
  });

  // 알림 삭제
  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, notificationNos) => removeNotification(notificationNos),
  });

  return {
    markAsRead: markAsReadMutation,
    deleteNotification: deleteNotificationMutation,
  };
};
