# 🔔 실시간 알림 기능 구현 가이드

이 문서는 @stomp/stompjs와 sockjs-client를 사용하여 구현된 실시간 알림 기능에 대한 가이드입니다.

## 📦 구조 개요

### 1. 공통 WebSocket 유틸리티

- **파일**: `src/shared/utils/websocket.ts`
- **목적**: SockJS/STOMP 연결 및 공통 메시지 핸들링
- **주요 기능**:
  - WebSocket 연결/해제 관리
  - 토픽 구독/해제
  - 메시지 전송
  - 자동 재연결 (최대 5회 시도)
  - 토큰 기반 인증

### 2. 알림 상태 관리

- **Store**: `src/features/notifications/notifications.store.ts`
- **타입**: `src/features/notifications/notifications.type.ts`
- **API**: `src/features/notifications/notifications.api.ts`

### 3. 알림 훅

- **파일**: `src/features/notifications/notifications.hook.ts`
- **제공하는 훅**:
  - `useRealtimeNotifications`: 실시간 알림 연결 관리
  - `useNotifications`: 알림 목록 관리
  - `useNotificationPermission`: 브라우저 알림 권한 관리

### 4. UI 컴포넌트

- **알림 카드**: `src/components/notifications/NotificationCard/NotificationCard.tsx`
- **알림 페이지**: `src/pages/notifications/Notifications.tsx`
- **디버그 패널**: `src/components/notifications/NotificationDebugPanel/NotificationDebugPanel.tsx`

## 🚀 사용법

### 1. 기본 설정

실시간 알림 기능은 `MainLayout`에서 자동으로 초기화됩니다:

```tsx
import {
  useRealtimeNotifications,
  useNotificationPermission,
} from "@features/notifications/notifications.hook";

function YourComponent() {
  // 실시간 알림 기능 (로그인 후 자동 연결)
  const { unreadCount, isConnected } = useRealtimeNotifications();

  // 브라우저 알림 권한 (로그인 후 자동 요청)
  const { hasPermission, requestPermission } = useNotificationPermission();

  return (
    <div>
      {/* 알림 아이콘과 뱃지 */}
      <div className="relative">
        <NotificationIcon />
        {unreadCount > 0 && (
          <div className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 2. 알림 목록 사용

```tsx
import { useNotifications } from "@features/notifications/notifications.hook";

function NotificationList() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  return (
    <div>
      <h2>알림 목록 ({unreadCount}개의 읽지 않은 알림)</h2>
      {notifications.map(notification => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          <button onClick={() => markAsRead(notification.id)}>읽음 처리</button>
        </div>
      ))}
    </div>
  );
}
```

## 🔧 설정 및 환경

### 1. WebSocket 엔드포인트

현재 설정된 엔드포인트: `https://api.talearnt.net/ws`

변경이 필요한 경우 `src/features/notifications/notifications.hook.ts`에서 수정:

```tsx
const WEBSOCKET_ENDPOINT = "https://your-api-domain.com/ws";
```

### 2. 토큰 인증

WebSocket 연결 시 `Authorization: Bearer {accessToken}` 헤더를 사용합니다.
토큰은 Zustand store (`useAuthStore`)에서 자동으로 가져옵니다.

### 3. 구독 토픽

현재 구독 토픽: `/user/queue/notifications`

## 📋 알림 타입

시스템에서 지원하는 알림 타입들:

| 타입                | 설명               | 색상     |
| ------------------- | ------------------ | -------- |
| `COMMENT`           | 댓글 알림          | 파란색   |
| `REPLY`             | 답글 알림          | 초록색   |
| `ARTICLE_LIKE`      | 게시글 좋아요 알림 | 빨간색   |
| `MATCHING_REQUEST`  | 매칭 요청 알림     | 보라색   |
| `MATCHING_ACCEPTED` | 매칭 수락 알림     | 에메랄드 |
| `MATCHING_REJECTED` | 매칭 거절 알림     | 회색     |
| `SYSTEM`            | 시스템 알림        | 노란색   |
| `EVENT`             | 이벤트 알림        | 분홍색   |

## 🔍 백엔드 메시지 형식

백엔드에서 전송해야 하는 메시지 형식:

```json
{
  "notification": {
    "id": "notification-uuid",
    "type": "COMMENT",
    "title": "새로운 댓글이 달렸습니다",
    "message": "회원님의 글에 새로운 댓글이 달렸습니다.",
    "status": "UNREAD",
    "createdAt": "2024-01-01T00:00:00Z",
    "data": {
      "articleId": "article-123",
      "commentId": "comment-456",
      "url": "/community/article/123"
    }
  },
  "unreadCount": 5
}
```

## 🛠️ 개발 및 테스트

### 1. 디버그 패널

개발 환경에서는 화면 좌측 하단에 "🔔 알림 디버그" 버튼이 표시됩니다.
이를 통해 다양한 테스트 알림을 생성할 수 있습니다.

### 2. 브라우저 알림 테스트

1. 브라우저에서 알림 권한 허용
2. 디버그 패널에서 테스트 알림 생성
3. 브라우저 알림이 표시되는지 확인

### 3. WebSocket 연결 확인

- 디버그 패널에서 연결 상태 확인
- 브라우저 개발자 도구 Network 탭에서 WebSocket 연결 확인
- 콘솔에서 연결 로그 확인

## 🚨 주의사항

### 1. 로그인 상태 의존성

- WebSocket 연결은 로그인 후에만 시도됩니다
- 로그아웃 시 자동으로 연결이 해제됩니다
- 토큰이 없거나 만료된 경우 연결이 실패합니다

### 2. 재연결 로직

- 연결이 끊어지면 자동으로 재연결을 시도합니다 (최대 5회)
- 재연결 간격은 점진적으로 증가합니다 (3초, 6초, 9초...)
- 최대 재연결 횟수에 도달하면 재연결을 포기합니다

### 3. 메모리 관리

- 컴포넌트 언마운트 시 WebSocket 연결과 구독이 자동 해제됩니다
- 중복 알림은 자동으로 필터링됩니다

## 🔮 확장 가능성

### 1. 채팅 기능 추가

기존 WebSocket 유틸리티를 재사용하여 채팅 기능을 쉽게 추가할 수 있습니다:

```tsx
// 채팅방 구독
const chatSubscriptionId = subscribeToTopic({
  destination: `/topic/chat/${chatRoomId}`,
  callback: handleChatMessage,
});

// 채팅 메시지 전송
sendWebSocketMessage(`/app/chat/${chatRoomId}`, {
  message: "안녕하세요!",
  sender: "user123",
});
```

### 2. 실시간 상태 업데이트

다른 실시간 기능들도 같은 방식으로 구현 가능:

- 온라인 사용자 상태
- 실시간 좋아요/조회수 업데이트
- 실시간 협업 기능

## 📞 문제 해결

### 연결 문제

1. 토큰 확인: `useAuthStore`에서 `accessToken` 값 확인
2. 네트워크 확인: 방화벽, CORS 설정
3. 백엔드 상태 확인: WebSocket 서버 실행 여부

### 알림이 표시되지 않는 경우

1. 브라우저 알림 권한 확인
2. WebSocket 연결 상태 확인
3. 콘솔 에러 메시지 확인
4. 백엔드 메시지 형식 확인

이 가이드를 통해 실시간 알림 기능을 효과적으로 활용하고 확장할 수 있습니다. 추가 질문이나 개선사항이 있으면 언제든 말씀해 주세요! 🚀
