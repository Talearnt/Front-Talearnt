# Talearnt — Talent Exchange Platform

> **[ARCHIVED]** This project is no longer actively maintained. The team dissolved before completing all planned features, and the production server has been shut down. The codebase is preserved here as a portfolio reference.

> 재능 교환 플랫폼. 자신의 재능을 나누고, 원하는 재능을 얻는 서비스.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/status-archived-lightgrey)](.)

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Technical Decisions](#technical-decisions)
6. [Performance](#performance)
7. [CI/CD](#cicd)
8. [Code Conventions](#code-conventions)

---

## Overview

Talearnt is a web platform where users exchange skills — you teach what you know, and learn what you want. The concept was inspired by the idea that teaching others is one of the most effective ways to learn.

**Core features built:**
- Matching board to post and discover talent exchange offers
- Community board for free discussion
- Real-time notifications via WebSocket
- Kakao OAuth + standard email authentication
- Event and announcement pages

**What wasn't finished:**  
The project wound down organically as team members moved on. Some detail pages and edge-case flows were left unpolished. The backend API is no longer running.

> 팀원들이 각자의 길을 가면서 자연스럽게 마무리된 프로젝트입니다. 일부 기능은 미완성 상태로 남아있습니다.

---

## Tech Stack

| Area | Technology |
|---|---|
| **Core** | React 18, TypeScript 5 |
| **Build** | Vite 6 + SWC |
| **Routing** | React Router v6 (`createBrowserRouter`, `lazy`) |
| **Server State** | TanStack Query v5 |
| **Client State** | Zustand |
| **HTTP** | Axios |
| **Real-time** | STOMP + SockJS (WebSocket) |
| **Forms** | React Hook Form + Yup |
| **Styling** | TailwindCSS 3, CVA, clsx, tailwind-merge |
| **Editor** | react-quill-new |
| **Testing** | Vitest, Testing Library, MSW |
| **DevOps** | GitHub Actions, AWS S3, CloudFront |
| **Package Manager** | Bun |

---

## Architecture

We adopted a **domain-based Feature-Sliced** architecture. Each domain owns its API calls, hooks, and types. Page components are intentionally thin — they only compose features together.

```
src/
├── components/      # Reusable UI components (common / shared / layout)
├── features/        # Domain business logic (api, hook, store, type)
│   ├── auth/
│   ├── articles/
│   ├── user/
│   └── notifications/
├── pages/           # Route entry points — composition only, no logic
├── layout/          # Layout components (MainLayout, AuthLayout, etc.)
├── routes/          # Route definitions, PrivateRoute / PublicRoute
├── store/           # Global Zustand stores (user, toast, prompt)
└── shared/          # Shared utilities, hooks, types, cache policies
    ├── utils/       # apiMethods, websocket, classNames
    ├── hooks/       # useQueryWithInitial, useDebounce, useCarousel
    ├── type/        # Common API response types
    └── cache/       # QueryKey Factory, cache policies
```

**Key principles:**

- Each domain in `features/` is self-contained with its own `api.ts`, `hook.ts`, and types
- `pages/` just wires layouts and features together — no business logic
- Relative imports from `src/` are banned via ESLint; all imports use path aliases (`@components/`, `@features/`, etc.)
- Route-level code splitting with `lazy()` + Vite `manualChunks` to minimize initial bundle

---

## Features

### Authentication
- Email sign-up with a step-by-step flow (agreements → info → complete)
- Kakao OAuth social login
- Find account ID / reset password
- `PrivateRoute` / `PublicRoute` guards

### Matching Board (재능 교환 게시판)
- Post talent exchange offers using a Quill-based rich text editor
- Filter by talent category and keyword
- Bookmark posts and view a personal favorites list

### Community Board (커뮤니티 게시판)
- Create / edit / delete free-form posts
- Comments and nested replies

### Real-time Notifications (실시간 알림)
- WebSocket push notifications (STOMP + SockJS)
- Alerts for keyword matches, comments, and replies
- Per-notification-type toggle settings

### User Profile (마이페이지)
- View and edit profile (avatar upload included)
- View own posts, comments, and bookmarks
- Account settings, account deletion

### Event & Notice (이벤트 / 공지)
- List and detail pages for events and announcements

---

## Technical Decisions

### 1. Token Security Strategy

| Token | Storage | Reason |
|---|---|---|
| Access Token | Zustand (memory) | Never persisted to disk — invisible to XSS |
| Refresh Token | httpOnly cookie | No JS access, mitigates CSRF |

On page reload, `getAccessTokenUseRefreshToken()` silently reissues the access token. On logout, both the server session and client state are cleared.

### 2. Separating Server State from Client State

- **Server data** → TanStack Query: handles caching, background refetching, and deduplication automatically
- **UI / auth state** → Zustand: simple, synchronous state that doesn't belong to the server

Domain-scoped `QueryKeyFactory` and `CACHE_POLICIES` centralize staleTime and other cache settings, so cache behavior is consistent and easy to change.

### 3. WebSocket Notification Buffer

A race condition exists between WebSocket subscription and the initial REST data fetch. To avoid losing messages that arrive during the gap:

1. Messages received immediately after STOMP subscription are stored in a local buffer
2. The REST API fetches the initial notification list
3. Once the fetch completes, the buffer is flushed and merged

From that point on, incoming WebSocket messages are handled directly.

### 4. Centralized API Layer (`apiMethods.ts`)

All HTTP calls go through `getAPI`, `postAPI`, `putAPI`, `patchAPI`, and `deleteAPI` wrappers built on top of Axios.

- Automatically reads the access token from Zustand and attaches `Authorization: Bearer`
- `withCredentials: true` ensures the refresh token cookie is sent on every request
- Axios response interceptor normalizes errors into `{ ...data, status }` so callers get a consistent shape

---

## Performance

### Bundle Splitting (Vite `manualChunks`)

| Chunk | Contents |
|---|---|
| `react-vendor` | React, React DOM, React Router |
| `query-vendor` | TanStack Query |
| `ui-vendor` | Embla Carousel |
| `editor-vendor` | react-quill-new |
| `state-vendor` | Zustand |
| `websocket-vendor` | stompjs, sockjs-client |
| `utils-vendor` | dayjs, clsx, tailwind-merge |

### Code Splitting

Every page component is wrapped in `React.lazy()` so only the current route's code is loaded initially.

### Custom Hook Optimizations

- `useQueryWithInitial` — uses previous cached data as `initialData` to eliminate loading flicker during navigation
- `useDebounce` — applied to search inputs to reduce unnecessary API requests

### Cache Headers (CloudFront)

| Resource | Cache Policy |
|---|---|
| `index.html` | `no-cache` — always fetches the latest deployment |
| JS / CSS / images | `max-age=31536000, immutable` — cached for 1 year |

---

## CI/CD

```
feature/<issue> ──► develop ──► main
                      │           │
                      ▼           ▼
                  Dev Deploy   Prod Deploy
               (CloudFront)  (talearnt.net)
```

| Trigger | Environment | Notes |
|---|---|---|
| `develop` push | Development | Auto-deploys to dev CloudFront |
| `main` push | Production | Auto-tags + deploys to prod |
| `hotfix/*` → `main` | Production | Auto-backport PR created to `develop` |

**GitHub Actions workflows:**

1. `test_pr.yml` — ESLint + Vitest + build check on every PR
2. `deploy-dev.yml` — deploy to S3 + CloudFront invalidation on `develop` push
3. `deploy-prod.yml` — tag creation + deploy on `main` push
4. `backport-main-to-develop.yml` — auto-creates backport PR after hotfixes

---

## Code Conventions

### Naming

| Target | Rule | Example |
|---|---|---|
| Components / files | PascalCase | `MatchingArticleCard.tsx` |
| Functions / variables | camelCase | `useArticleList` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE` |
| Folders | kebab-case | `matching-article/` |

### Commit Messages

```
[TYPE] description | TALEARNT-<issue>

e.g. [FEAT] Add bookmark toggle to matching post | TALEARNT-42
```

| Type | When to use |
|---|---|
| `FEAT` | New feature |
| `FIX` | Bug fix |
| `REFACTOR` | Code restructure without behavior change |
| `STYLE` | Formatting, whitespace |
| `CHORE` | Build config, package updates |
| `DOCS` | Documentation only |
| `TEST` | Tests |

### TypeScript Config

- Strict mode: `strict`, `noImplicitAny`, `strictNullChecks`
- `noUnusedLocals` and `noUnusedParameters` to keep dead code out
- Path aliases: `@components/*`, `@features/*`, `@pages/*`, `@shared/*`, `@store/*`

### ESLint

- `simple-import-sort` — auto-sorts imports by group
- `no-relative-import-paths` — bans relative imports from within `src/`
- `react-hooks` — enforces hook dependency rules
- Naming convention rules for camelCase, PascalCase, and UPPER_CASE applied project-wide
