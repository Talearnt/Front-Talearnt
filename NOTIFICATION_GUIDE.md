# 🔔 실시간 알림 기능 가이드

이 문서는 @stomp/stompjs와 sockjs-client를 사용하여 구현된 실시간 알림 기능의 구조와 사용법을 설명합니다.

## 📦 구조 개요

### 1) 공통 WebSocket 유틸리티

- 파일: `src/shared/utils/websocket.ts`
- 역할: SockJS/STOMP 연결, 구독/해제, 메시지 전송, (유틸 내부 재연결 로직 포함)

### 2) 알림 상태(SSOT)

- 파일: `src/features/notifications/notifications.store.ts`
- 역할: 전역 단일 진실원본(SSOT)
  - 최대 50개 유지
  - 중복 알림 시 해당 항목을 갱신하고 목록 제일 앞으로 이동(bump-to-front)
  - 읽음 처리/삭제 액션 제공

### 3) 알림 훅

- 파일: `src/features/notifications/notifications.hook.ts`
- 제공
  - `useRealtimeNotifications`: 레이아웃에서 한 번만 마운트. 연결 → 구독(버퍼) → 초기 REST 동기화 → 버퍼 플러시 → 실시간 반영
  - `useNotifications`: 읽음/삭제 액션 훅(서버 변이 성공 시 store 동기화)

### 4) 유틸/상수

- `src/features/notifications/notifications.util.ts`: 상대시간 포맷(`n분/시간/일 전`)
- `src/features/notifications/notifications.constants.ts`: 알림 타입 카테고리 매핑(예: "관심 키워드" → keyword)

### 5) UI

- 팝오버: `src/components/layout/Notifications/Notifications.tsx`
  - 탭(전체/댓글/관심 키워드) 필터
  - 탭 변경 시 스크롤 최상단 이동
  - 미읽음 점(Dot) 표시(absolute, 텍스트 오른쪽 2px)
  - 알림 항목은 `button` 요소(접근성/시멘틱)
  - 상대시간 표시, 긴 텍스트 줄바꿈 처리
- 헤더 배지: `src/layout/MainLayout.tsx` 아이콘 오른쪽 상단에 absolute 배지(99+ 처리)

---

## 🔄 동작 흐름(버퍼링 포함)

1. 레이아웃에서 `useRealtimeNotifications()` 마운트
2. 웹소켓 연결
3. 구독 선시작(버퍼링 모드)
4. 초기 REST(`getNotifications`)로 스냅샷 동기화 → `setNotifications`
5. 버퍼 플러시(동기화 중 수신한 알림 반영)
6. 실시간 즉시 반영 모드로 전환

이렇게 하면 초기 동기화 중 유실을 방지하고, 모달 열림/닫힘과 무관하게 안정적으로 수신합니다.

---

## 🧩 사용 예시

### 레이아웃

```tsx
// src/layout/MainLayout.tsx
useRealtimeNotifications(); // 반환값 사용 불필요(오케스트레이션 전용)
```

### 팝오버

```tsx
const { notifications, isLoading } = useNotificationStore(state => ({
  notifications: state.notifications,
  isLoading: state.isLoading,
}));

const { markAsRead, deleteNotification } = useNotifications();
```

---

## ⚙️ 서버 연동 팁

- WebSocket 엔드포인트: `https://api.talearnt.net/ws`
- 구독 토픽: `/user/queue/notifications`
- 권장: 서버에서 lastId/since를 지원하면 onConnect 직후 lastId 이후만 재전송하여 클라이언트 버퍼 제거 가능

---

## ✅ 베스트 프랙티스

- SSOT를 store 하나로 유지(목록/배지/팝오버 동기)
- 목록 최대 50개로 컷하여 렌더/메모리 안정성 확보
- 실시간 수신 중 중복은 갱신 + 맨 앞으로 이동(bump)
- 액션은 서버 변이 성공 시 store 반영(낙관 업데이트도 가능)
- 모달은 표시/액션만 담당, 동기화/연결은 전역 오케스트레이션에서 한 번만

---

## 🧪 테스트 체크리스트

- 로그인 후 연결/구독/초기 동기화/플러시 순서 확인
- 모달 닫힌 상태에서도 아이콘 배지 증가 확인
- 탭 필터/모두 읽기/모두 삭제 동작 확인(필터 대상에만 적용)
- 긴 숫자/단어 줄바꿈, 상대시간 포맷 검증
