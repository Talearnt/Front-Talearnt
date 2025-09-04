# 🏗️ 캐시 시스템 아키텍처 개선 제안

## 📊 **현재 문제점**

### ❌ **단일 파일의 한계**

- `cacheManager.ts`: **577줄** - 너무 거대함
- **5가지 책임** 혼재: 정책, 키, 팩토리, 무효화, 낙관적 업데이트
- **확장성 문제**: 새 도메인 추가 시 파일 크기 계속 증가
- **가독성 저하**: 특정 기능 찾기 어려움

## 🎯 **제안하는 새 구조**

### 📁 **1단계: 책임별 분리**

```
src/shared/cache/
├── index.ts                     # 통합 export
├── policies/
│   ├── index.ts                 # 정책 통합
│   ├── article.policies.ts      # 게시물 관련 정책
│   ├── user.policies.ts         # 사용자 관련 정책
│   ├── auth.policies.ts         # 인증 관련 정책
│   └── main.policies.ts         # 메인페이지 관련 정책
├── queryKeys/
│   ├── index.ts                 # 키 통합
│   ├── article.keys.ts          # 게시물 쿼리키
│   ├── user.keys.ts             # 사용자 쿼리키
│   ├── auth.keys.ts             # 인증 쿼리키
│   └── main.keys.ts             # 메인페이지 쿼리키
├── invalidation/
│   ├── index.ts                 # 무효화 통합
│   ├── article.invalidation.ts  # 게시물 무효화
│   ├── user.invalidation.ts     # 사용자 무효화
│   └── shared.invalidation.ts   # 공통 무효화
├── optimistic/
│   ├── index.ts                 # 낙관적 업데이트 통합
│   ├── article.optimistic.ts    # 게시물 낙관적 업데이트
│   └── shared.optimistic.ts     # 공통 낙관적 업데이트
└── manager/
    ├── index.ts                 # 매니저 통합
    └── CacheManager.ts          # 싱글톤 매니저
```

### 📁 **2단계: 도메인별 세분화**

```
src/shared/cache/
├── domains/
│   ├── articles/
│   │   ├── matching/
│   │   │   ├── matching.policies.ts
│   │   │   ├── matching.keys.ts
│   │   │   ├── matching.invalidation.ts
│   │   │   └── matching.optimistic.ts
│   │   ├── community/
│   │   │   ├── community.policies.ts
│   │   │   ├── community.keys.ts
│   │   │   ├── community.invalidation.ts
│   │   │   └── community.optimistic.ts
│   │   └── comments/
│   │       ├── comments.policies.ts
│   │       ├── comments.keys.ts
│   │       └── comments.invalidation.ts
│   ├── user/
│   │   ├── profile/
│   │   ├── activity/
│   │   └── preferences/
│   ├── auth/
│   │   ├── validation/
│   │   └── session/
│   └── main/
│       ├── banners/
│       ├── recommendations/
│       └── recent/
└── core/
    ├── types.ts                 # 공통 타입
    ├── utils.ts                 # 공통 유틸
    └── CacheManager.ts          # 중앙 관리자
```

## 🚀 **구현 계획**

### 🎯 **Phase 1: 기본 분리**

1. **캐시 정책 분리**: 도메인별 정책 파일
2. **쿼리키 분리**: 도메인별 키 관리
3. **무효화 로직 분리**: 도메인별 무효화 전략
4. **낙관적 업데이트 분리**: 재사용 가능한 패턴

### 🎯 **Phase 2: 고급 최적화**

1. **타입 안전성**: 각 도메인별 강타입 시스템
2. **플러그인 시스템**: 새 도메인 쉽게 추가
3. **성능 최적화**: 지연 로딩, 트리 쉐이킹
4. **개발자 도구**: 캐시 상태 시각화

## 💡 **예상 이점**

### 📈 **개발 효율성**

- **파일 크기**: 577줄 → 50-100줄/파일
- **개발자 경험**: 원하는 기능 빠르게 찾기
- **병렬 개발**: 여러 개발자가 다른 도메인 동시 작업

### 🔧 **유지보수성**

- **단일 책임**: 각 파일이 명확한 역할
- **테스트 용이성**: 도메인별 독립적 테스트
- **확장성**: 새 도메인 추가 시 기존 코드 영향 없음

### ⚡ **성능**

- **번들 크기**: 사용하지 않는 도메인 제외
- **메모리**: 필요한 캐시 로직만 로드
- **개발 빌드**: 변경된 도메인만 재컴파일

## 🎨 **구체적인 예시**

### 📝 **article.policies.ts**

```typescript
export const ARTICLE_CACHE_POLICIES = {
  MATCHING_LIST: {
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
  },
  MATCHING_DETAIL: {
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 10 * 60 * 1000, // 10분
  },
  COMMUNITY_LIST: {
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
  },
  COMMUNITY_DETAIL: {
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 10 * 60 * 1000, // 10분
  },
} as const;
```

### 🔑 **article.keys.ts**

```typescript
export const ArticleQueryKeys = {
  matching: {
    all: () => ["MATCHING"] as const,
    lists: () => ["MATCHING", "LIST"] as const,
    list: (filter: any) => ["MATCHING", "LIST", filter] as const,
    detail: (id: number) => ["MATCHING", "DETAIL", id] as const,
  },
  community: {
    all: () => ["COMMUNITY"] as const,
    lists: () => ["COMMUNITY", "LIST"] as const,
    list: (filter: any) => ["COMMUNITY", "LIST", filter] as const,
    detail: (id: number) => ["COMMUNITY", "DETAIL", id] as const,
  },
} as const;
```

### ❌ **article.invalidation.ts**

```typescript
export class ArticleInvalidationManager {
  constructor(private queryClient: QueryClient) {}

  invalidateMatchingArticle(postId: number) {
    // 매칭 게시물 관련 무효화
    this.queryClient.invalidateQueries({
      queryKey: ArticleQueryKeys.matching.all(),
    });

    // 댓글도 함께 무효화
    this.queryClient.invalidateQueries({
      queryKey: CommentQueryKeys.lists(postId),
    });
  }

  invalidateCommunityArticle(postId: number) {
    // 커뮤니티 게시물 관련 무효화
    this.queryClient.invalidateQueries({
      queryKey: ArticleQueryKeys.community.all(),
    });
  }
}
```

## 🔄 **마이그레이션 전략**

### 📋 **호환성 보장**

```typescript
// src/shared/cache/index.ts - 기존 API 유지
export * from "./legacy/cacheManager"; // 기존 코드
export * from "./domains/articles"; // 새로운 구조
export * from "./domains/user";
export * from "./domains/auth";

// 점진적 마이그레이션 지원
export const CacheManager = {
  // 기존 방식 (deprecated)
  getInstance: () => LegacyCacheManager.getInstance(),

  // 새로운 방식
  articles: ArticleCacheManager,
  user: UserCacheManager,
  auth: AuthCacheManager,
};
```

### 🚦 **단계별 적용**

1. **1주차**: 기본 구조 설정, 게시물 도메인 분리
2. **2주차**: 사용자, 인증 도메인 분리
3. **3주차**: 기존 코드 점진적 마이그레이션
4. **4주차**: 레거시 코드 제거, 최종 최적화

## 🎉 **최종 목표**

### 📊 **정량적 목표**

- **파일 크기**: 577줄 → 평균 50-100줄
- **번들 크기**: 사용하지 않는 도메인 제외로 20% 감소
- **개발 속도**: 특정 기능 찾는 시간 80% 단축

### 🎯 **정성적 목표**

- **개발자 경험**: 직관적이고 찾기 쉬운 구조
- **확장성**: 새 도메인 추가 시 기존 코드 영향 없음
- **유지보수성**: 각 파일의 명확한 책임과 역할
