# Talearnt 프로젝트 아키텍처 가이드

이 문서는 Talearnt 프론트엔드 프로젝트의 아키텍처, 기술 스택, 폴더 구조를 설명하여 새로운 참여자가 빠르게 프로젝트를 이해하고 일관된 개발을 할 수 있도록 돕습니다.

## 1. 프로젝트 개요

- **프로젝트명:** Talearnt
- **설명:** React와 TypeScript 기반의 웹 애플리케이션입니다.
- **핵심 아키텍처:** **피처 중심(Feature-Driven) 아키텍처**를 채택하여 기능별로 코드를 캡슐화하고, 유지보수성과 확장성을 높입니다.

## 2. 기술 스택

- **Core:** React 18, TypeScript, Vite
- **Routing:** React Router DOM v6
- **State Management:**
  - **Server State:** TanStack Query (React Query) v5
  - **Client State:** Zustand
- **Styling:** Tailwind CSS with PostCSS
- **Form:** React Hook Form with Yup for validation
- **Testing:** Vitest, React Testing Library
- **Linting & Formatting:** ESLint, Prettier
- **HTTP Client:** Axios

## 3. 핵심 아키텍처: 피처 중심 (Feature-Driven)

프로젝트는 기능 단위로 코드를 구성하며, 데이터와 의존성의 흐름은 일반적으로 아래 순서를 따릅니다.

**`routes` ➔ `pages` ➔ `features` ➔ `components`**

1.  **Routes (`src/routes`):** URL 경로에 따라 적절한 페이지를 렌더링하는 라우팅 설정.
2.  **Pages (`src/pages`):** 각 페이지의 진입점으로, 여러 피처와 공용 컴포넌트를 조합하여 UI를 구성하는 컨테이너 역할.
3.  **Features (`src/features`):** 애플리케이션의 핵심 두뇌. API 호출, 상태 관리, 비즈니스 로직 등 특정 기능에 대한 모든 코드가 이 디렉토리 안에 캡슐화됩니다.
4.  **Components (`src/components`):** 여러 기능에서 재사용되는 순수 UI 컴포넌트 (버튼, 모달 등).

## 4. 디렉토리 구조 및 역할

- **`/` (Root)**

  - `vite.config.ts`: Vite 빌드 설정
  - `tailwind.config.js`: Tailwind CSS 설정
  - `eslint.config.js`: ESLint 린팅 규칙 설정
  - `package.json`: 프로젝트 의존성 및 스크립트 관리

- **`src/`**
  - **`main.tsx`**: 애플리케이션의 최상위 진입점.
  - **`routes/`**: `react-router-dom`을 사용한 라우팅 설정 파일.
    - `PrivateRoute.tsx`: 인증 기반 라우트 가드.
  - **`pages/`**: URL과 매핑되는 페이지 컴포넌트.
    - 예: `MainPage.tsx`, `SignIn.tsx`
  - **`features/`**: 기능별 비즈니스 로직 및 상태 관리.
    - 각 피처 폴더는 `*.api.ts`, `*.hook.ts`, `*.store.ts`, `*.type.ts` 및 하위 컴포넌트로 구성됩니다.
    - 예: `features/auth/`, `features/articles/`
  - **`components/`**: 재사용 가능한 UI 컴포넌트.
    - `common/`: 범용적인 기본 컴포넌트 (e.g., `Button`, `Input`).
    - `shared/`: 여러 곳에서 공유되지만 조금 더 구체적인 컴포넌트 (e.g., `CommunityArticleCard`).
  - **`layout/`**: 헤더, 푸터 등 공통 페이지 레이아웃.
    - 예: `MainLayout.tsx`, `AuthLayout.tsx`
  - **`store/`**: Zustand를 사용한 전역 상태 관리 스토어.
    - 예: `user.store.ts`
  - **`shared/`**: 여러 모듈에서 공유되는 공용 코드.
    - `constants/`: 전역 상수 (e.g., `queryKeys`).
    - `hooks/`: 공용 커스텀 훅.
    - `utils/`: 공용 유틸리티 함수.
    - `type/`: 전역 TypeScript 타입.
  - **`test/`**: Vitest 테스트 설정 및 유틸리티.

## 5. 주요 스크립트

- **`npm run dev`**: 개발 서버 실행
- **`npm run build:prod`**: 프로덕션 빌드
- **`npm run lint`**: ESLint로 코드 검사
- **`npm run format`**: Prettier로 코드 포맷팅
- **`npm run vitest`**: 유닛/컴포넌트 테스트 실행

---

## 6. 실시간 알림(Notification) 아키텍처

- 전역 코디네이터(`useRealtimeNotifications`)가 레이아웃에서 한 번만 마운트됩니다.
  1. 웹소켓 연결
  2. 구독(버퍼링 모드) 선시작
  3. 초기 REST 스냅샷 동기화 → store 반영
  4. 버퍼 플러시 후 실시간 즉시 반영
- 단일 진실원본(SSOT): `useNotificationStore`. 최대 50개 유지, 중복 시 해당 항목을 앞쪽으로 bump
- UI(헤더 배지/팝오버)는 store만 구독, 액션(읽음/삭제)은 서버 변이 성공 후 store 동기화

### 설계 의도 및 장점

- 모달 열림/닫힘과 무관하게 안정적으로 실시간 수신
- 초기 동기화 중 유실 방지를 위한 버퍼링
- 목록 크기 제한으로 렌더/메모리 안전성 확보

### 관련 파일

- `src/features/notifications/notifications.hook.ts`
- `src/features/notifications/notifications.store.ts`
- `src/features/notifications/notifications.util.ts`
- `src/features/notifications/notifications.constants.ts`
- `src/components/layout/Notifications/Notifications.tsx`
