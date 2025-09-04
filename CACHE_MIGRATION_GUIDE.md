# 🔄 캐시 시스템 마이그레이션 가이드

## 📋 **마이그레이션 개요**

기존의 단일 파일 `cacheManager.ts` (577줄)를 **도메인별로 분리된 모듈화 시스템**으로 전환합니다.

### 🎯 **마이그레이션 목표**

- **단일 책임 원칙** 준수
- **확장성** 향상
- **유지보수성** 개선
- **기존 코드 호환성** 유지

---

## 🏗️ **새로운 구조**

### 📁 **Before (기존 구조)**

```
src/shared/utils/
└── cacheManager.ts (577줄)
    ├── CACHE_POLICIES
    ├── queryKeys enum
    ├── QueryKeyFactory
    ├── CacheInvalidationManager
    ├── OptimisticUpdateManager
    └── CacheManager (singleton)
```

### 📁 **After (새로운 구조)**

```
src/shared/cache/
├── policies/
│   ├── article.policies.ts    (27줄)
│   ├── user.policies.ts       (18줄)
│   ├── auth.policies.ts       (9줄)
│   ├── main.policies.ts       (21줄)
│   └── index.ts               (통합)
├── queryKeys/
│   ├── types.ts               (공통 타입)
│   ├── article.keys.ts        (41줄)
│   ├── user.keys.ts           (60줄)
│   ├── auth.keys.ts           (15줄)
│   ├── main.keys.ts           (35줄)
│   └── index.ts               (통합)
├── invalidation/
│   ├── article.invalidation.ts (98줄)
│   ├── user.invalidation.ts    (63줄)
│   └── index.ts                (통합 + 호환성)
├── optimistic/
│   ├── article.optimistic.ts   (87줄)
│   ├── shared.optimistic.ts    (76줄)
│   └── index.ts                (통합 + 호환성)
├── manager/
│   ├── CacheManager.ts         (78줄)
│   └── index.ts
├── examples/
│   └── usage-examples.ts       (사용 예시)
└── index.ts                    (전체 통합)
```

---

## 📋 **단계별 마이그레이션 계획**

### 🚦 **Phase 1: 기존 코드 호환성 확보** ✅

- [x] 새로운 모듈화 시스템 구축
- [x] 기존 API와 동일한 인터페이스 제공
- [x] 레거시 import 경로 지원

### 🚦 **Phase 2: 점진적 마이그레이션** 🔄

- [ ] 주요 hook들 새로운 시스템으로 전환
- [ ] 테스트 케이스 추가
- [ ] 성능 검증

### 🚦 **Phase 3: 레거시 정리** ⏳

- [ ] 기존 `cacheManager.ts` 제거
- [ ] import 경로 완전 전환
- [ ] 문서 업데이트

---

## 🔄 **import 변경 가이드**

### 📝 **기존 방식**

```typescript
// Before
import {
  CACHE_POLICIES,
  QueryKeyFactory,
  getCacheManager,
} from "@shared/utils/cacheManager";
```

### 📝 **새로운 방식 (권장)**

```typescript
// After - 새로운 모듈화 시스템
import { CACHE_POLICIES, QueryKeyFactory, CacheManager } from "@shared/cache";

// 더 구체적인 import (트리 쉐이킹 최적화)
import { ARTICLE_CACHE_POLICIES } from "@shared/cache/policies/article.policies";
import { ArticleQueryKeys } from "@shared/cache/queryKeys/article.keys";
import { CacheManager } from "@shared/cache/manager";
```

### 📝 **호환성 방식 (마이그레이션 중)**

```typescript
// 기존 코드는 그대로 작동
import {
  LegacyCachePolicies as CACHE_POLICIES,
  LegacyQueryKeyFactory as QueryKeyFactory,
  legacyGetCacheManager as getCacheManager,
} from "@shared/cache";
```

---

## 🎯 **API 변경 사항**

### 🔧 **캐시 관리자 사용법**

#### **Before**

```typescript
const cacheManager = getCacheManager();

// 무효화
cacheManager.invalidation.invalidateMatchingArticle(postId);

// 낙관적 업데이트
const snapshot = cacheManager.optimistic.addOptimisticArticle(
  newArticle,
  queryKeyGetter
);
```

#### **After (새로운 방식)**

```typescript
const cacheManager = CacheManager.getInstance(queryClient);

// 도메인별 무효화
cacheManager.invalidation.article.invalidateMatchingArticle(postId);
cacheManager.invalidation.user.invalidateUserProfile();

// 도메인별 낙관적 업데이트
const snapshot = cacheManager.optimistic.article.addOptimisticArticle(
  newArticle,
  queryKeyGetter
);
```

### 🗂️ **쿼리키 팩토리 변경**

#### **Before**

```typescript
QueryKeyFactory.matching.list(filter);
QueryKeyFactory.user.profile();
QueryKeyFactory.auth.nicknameCheck(nickname);
```

#### **After (더 구체적)**

```typescript
// 통합 방식 (기존과 동일)
QueryKeyFactory.matching.list(filter);
QueryKeyFactory.user.profile();
QueryKeyFactory.auth.nicknameCheck(nickname);

// 도메인별 방식 (새로운 옵션)
ArticleQueryKeys.matching.list(filter);
UserQueryKeys.profile();
AuthQueryKeys.nicknameCheck(nickname);
```

---

## 🚀 **성능 개선 효과**

### 📊 **파일 크기 비교**

| 구분          | Before | After | 개선율        |
| ------------- | ------ | ----- | ------------- |
| 단일 파일     | 577줄  | -     | -             |
| 도메인별 평균 | -      | 50줄  | **90% 감소**  |
| 정책 파일     | -      | 18줄  | **매우 작음** |
| 쿼리키 파일   | -      | 42줄  | **관리 용이** |

### ⚡ **번들 크기 최적화**

```typescript
// 트리 쉐이킹으로 사용하지 않는 도메인 제외
import { ArticleQueryKeys } from "@shared/cache/queryKeys/article.keys";
// ↳ 다른 도메인(user, auth, main)은 번들에서 제외됨
```

### 🎯 **개발자 경험 개선**

- **찾기 쉬운 구조**: 게시물 관련 기능은 `article.*.ts`에서
- **병렬 개발**: 여러 개발자가 다른 도메인 동시 작업
- **타입 안전성**: 도메인별 강타입 시스템

---

## 🧪 **테스트 전략**

### 📋 **호환성 테스트**

```typescript
describe("Cache Migration Compatibility", () => {
  it("기존 API가 그대로 작동해야 함", () => {
    // 기존 방식
    const legacyManager = getCacheManager();
    legacyManager.invalidation.invalidateMatchingArticle(123);

    // 새로운 방식
    const newManager = CacheManager.getInstance(queryClient);
    newManager.invalidation.article.invalidateMatchingArticle(123);

    // 동일한 결과를 보장
    expect(/* 캐시 상태 비교 */).toBeTruthy();
  });
});
```

### 📋 **성능 테스트**

```typescript
describe("Performance Improvements", () => {
  it("번들 크기가 감소해야 함", () => {
    // 특정 도메인만 import 시 다른 도메인 제외
  });

  it("메모리 사용량이 최적화되어야 함", () => {
    // 필요한 캐시 로직만 로드
  });
});
```

---

## 💡 **마이그레이션 팁**

### ✅ **점진적 전환 권장**

1. **새 프로젝트**: 바로 새로운 시스템 사용
2. **기존 프로젝트**: 호환성 모드로 시작, 점진적 전환
3. **레거시 정리**: 모든 전환 완료 후 기존 파일 제거

### ✅ **import 최적화**

```typescript
// ❌ 비효율적 - 전체 import
import { CACHE_POLICIES } from "@shared/cache";

// ✅ 효율적 - 필요한 것만 import
import { ARTICLE_CACHE_POLICIES } from "@shared/cache/policies/article.policies";
```

### ✅ **IDE 지원 활용**

- **자동완성**: 도메인별로 정리된 API
- **타입 체크**: 컴파일 타임 검증 강화
- **리팩토링**: 안전한 이름 변경 지원

---

## 🎉 **마이그레이션 완료 후 이점**

### 📈 **개발 효율성**

- **파일 찾기**: 577줄 파일 → 평균 50줄 파일들
- **기능 추가**: 해당 도메인 파일만 수정
- **코드 리뷰**: 변경 영향도 명확

### 🔧 **유지보수성**

- **단일 책임**: 각 파일이 명확한 역할
- **확장성**: 새 도메인 쉽게 추가
- **테스트**: 도메인별 독립적 테스트

### ⚡ **성능**

- **번들 크기**: 사용하지 않는 도메인 제외
- **메모리**: 필요한 로직만 로드
- **빌드 시간**: 변경된 도메인만 재컴파일

---

## 🚨 **주의사항**

### ⚠️ **Breaking Changes 없음**

- 기존 API는 모두 호환성 유지
- import 경로만 변경 권장
- 기능상 변화 없음

### ⚠️ **점진적 적용 필수**

- 한 번에 모든 코드 변경 금지
- 도메인별 순차적 마이그레이션
- 충분한 테스트 후 전환

### ⚠️ **팀 협업 고려**

- 마이그레이션 계획 사전 공유
- 혼재 기간 중 일관성 유지
- 문서 업데이트 필수

---

## 📞 **문의 및 지원**

마이그레이션 과정에서 문제가 발생하면:

1. **호환성 모드** 먼저 시도
2. **예시 코드** 참조 (`src/shared/cache/examples/`)
3. **기존 방식** 일시적 사용 가능
4. **점진적 전환** 권장
