# 캐시 관리 전략 가이드

## 개요

이 문서는 Talearnt 프로젝트의 통합 캐시 관리 전략을 설명합니다. React Query를 기반으로 한 체계적인 캐시 관리 시스템을 통해 **일관성**, **정확성**, **성능**을 모두 향상시키는 것이 목표입니다.

## 🎯 주요 개선 사항

### Before (기존 문제점)

- ❌ 쿼리 키 구조가 일관성 없음
- ❌ 무효화 전략이 엔티티별로 분산됨
- ❌ 낙관적 업데이트 로직이 중복됨
- ❌ 캐시 정책이 파일별로 상이함
- ❌ 엔티티 간 관계성 고려 부족

### After (개선된 시스템)

- ✅ 통합 캐시 관리자 (`CacheManager`)
- ✅ 일관된 쿼리 키 팩토리 (`QueryKeyFactory`)
- ✅ 체계적인 캐시 정책 (`CACHE_POLICIES`)
- ✅ 재사용 가능한 낙관적 업데이트 유틸리티
- ✅ 엔티티 관계 기반 무효화 전략

---

## 📋 엔티티 및 주요 트리거

### 엔티티 범위

- **게시물** (매칭 게시물)
- **커뮤니티 게시물**
- **댓글**
- **답글**

### 주요 트리거 (사건)

| 트리거                         | 영향받는 캐시              | 무효화 전략                    |
| ------------------------------ | -------------------------- | ------------------------------ |
| 게시물 작성/수정/삭제          | 게시물 목록, 메인 페이지   | `invalidateMatchingArticle()`  |
| 커뮤니티 게시물 작성/수정/삭제 | 커뮤니티 목록, 메인 페이지 | `invalidateCommunityArticle()` |
| 댓글 작성/수정/삭제            | 댓글 목록, 게시물 상세     | `invalidateComment()`          |
| 답글 작성/수정/삭제            | 답글 목록, 댓글 목록       | `invalidateReply()`            |
| 프로필 수정                    | 사용자 관련 모든 캐시      | `invalidateUserProfile()`      |

---

## 🏗️ 아키텍처

### 캐시 관리자 구조

```typescript
CacheManager (싱글톤)
├── invalidation: CacheInvalidationManager
│   ├── invalidateMatchingArticle()
│   ├── invalidateCommunityArticle()
│   ├── invalidateComment()
│   ├── invalidateReply()
│   └── invalidateUserProfile()
└── optimistic: OptimisticUpdateManager
    ├── addOptimisticArticle()
    ├── removeOptimisticArticle()
    ├── updateOptimisticArticle()
    └── rollbackToSnapshot()
```

### 쿼리 키 팩토리

```typescript
QueryKeyFactory
├── matching: 매칭 게시물
│   ├── all() → ['MATCHING']
│   ├── lists() → ['MATCHING', { isList: true }]
│   ├── list(filter) → ['MATCHING', filter, { isList: true }]
│   └── detail(id) → ['MATCHING', id]
├── community: 커뮤니티 게시물
├── comments: 댓글
├── replies: 답글
└── main: 메인 페이지
```

---

## ⚙️ 캐시 정책

### 정책 상수

| 엔티티              | staleTime | gcTime | 설명                               |
| ------------------- | --------- | ------ | ---------------------------------- |
| `ARTICLE_LIST`      | 30초      | 5분    | 자주 변하는 게시물 목록            |
| `ARTICLE_DETAIL`    | 1분       | 10분   | 댓글/좋아요 등이 자주 변함         |
| `COMMENT_LIST`      | 30초      | 5분    | 실시간성 중요                      |
| `REPLY_LIST`        | 20초      | 3분    | 가장 실시간성 중요한 대화형 컨텐츠 |
| `MAIN_PERSONALIZED` | 3분       | 15분   | 개인화된 추천                      |
| `MAIN_RECENT`       | 2분       | 10분   | 최신 글                            |
| `MAIN_BEST`         | 5분       | 15분   | 인기 글                            |

### 정책 설계 원칙

- **실시간성**: 더 자주 변하는 데이터는 짧은 staleTime
- **메모리 효율**: staleTime < gcTime 유지
- **사용자 경험**: 재방문 가능성 고려한 gcTime 설정

---

## 🔄 낙관적 업데이트 패턴

### 기본 플로우

```typescript
// 1. 활성 쿼리 취소
await queryClient.cancelQueries({ queryKey });

// 2. 스냅샷 저장
const prevData = queryClient.getQueryData(queryKey);

// 3. 낙관적 업데이트 수행
cacheManager.optimistic.addOptimisticArticle(queryKey, item);

// 4. 컨텍스트 반환 (onError에서 롤백용)
return { prevData };
```

### onError 롤백

```typescript
onError: (err, variables, context) => {
  if (context?.prevData) {
    cacheManager.optimistic.rollbackToSnapshot(context.prevData);
  }
};
```

### onSuccess 정규화

```typescript
onSuccess: response => {
  // 서버 응답으로 임시 데이터를 실제 데이터로 교체
  queryClient.setQueryData(detailKey, response.data);
};
```

---

## 📖 사용법

### 1. 기본 사용

```typescript
import {
  getCacheManager,
  QueryKeyFactory,
  CACHE_POLICIES,
} from "@shared/utils/cacheManager";

// 훅에서 사용
export const useGetArticleList = () => {
  return useQueryWithInitial(
    initialData,
    {
      queryKey: QueryKeyFactory.matching.list(filter),
      queryFn: () => getArticleList(filter),
      staleTime: CACHE_POLICIES.ARTICLE_LIST.staleTime,
      gcTime: CACHE_POLICIES.ARTICLE_LIST.gcTime,
    },
    QueryKeyFactory.matching.lists()
  );
};
```

### 2. 뮤테이션에서 캐시 관리

```typescript
export const usePostArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postArticle,
    onMutate: async data => {
      const cacheManager = getCacheManager(queryClient);

      // 낙관적 업데이트
      const previous = cacheManager.optimistic.addOptimisticArticle(
        QueryKeyFactory.matching.list({ page: 1 }),
        optimisticItem
      );

      return { previous };
    },
    onError: (err, variables, context) => {
      // 롤백
      if (context?.previous) {
        const cacheManager = getCacheManager(queryClient);
        cacheManager.optimistic.rollbackToSnapshot(context.previous);
      }
    },
    onSettled: async () => {
      // 무효화
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateMatchingArticle();
    },
  });
};
```

### 3. 프로필 업데이트

```typescript
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      // 선택적 무효화 (기존의 과도한 전체 무효화 개선)
      await cacheManager.invalidation.invalidateUserProfile();
    },
  });
};
```

---

## 🧪 테스트 전략

### 단위 테스트

- `CacheManager` 각 메서드의 동작 검증
- `QueryKeyFactory` 키 생성 일관성 확인
- `CACHE_POLICIES` 정책 유효성 검증

### 통합 테스트

- 실제 훅들과 캐시 관리자 연동 테스트
- 낙관적 업데이트 → 에러 → 롤백 플로우 검증
- 무효화 체인 동작 확인

### 테스트 파일

- `src/test/utils/cacheManager.test.ts`
- `src/test/hooks/cacheIntegration.test.tsx`

---

## 🚀 성능 최적화

### 메모리 효율성

- **적절한 gcTime**: 재방문 가능성과 메모리 사용량 균형
- **선택적 무효화**: 필요한 캐시만 무효화하여 불필요한 재요청 방지

### 네트워크 효율성

- **staleTime 정책**: 실시간성 요구사항에 맞는 차등 설정
- **낙관적 업데이트**: 사용자 체감 속도 향상

### 사용자 경험

- **깜빡임 최소화**: 초기 데이터와 이전 캐시 활용
- **일관된 상태**: 엔티티 간 관계 고려한 무효화

---

## 🔧 마이그레이션 가이드

### 1. 기존 코드 교체

**Before:**

```typescript
import { createQueryKey } from "@shared/utils/createQueryKey";
import { queryKeys } from "@shared/constants/queryKeys";

const queryKey = createQueryKey([queryKeys.MATCHING, filter], { isList: true });
```

**After:**

```typescript
import { QueryKeyFactory } from "@shared/utils/cacheManager";

const queryKey = QueryKeyFactory.matching.list(filter);
```

### 2. 캐시 정책 적용

**Before:**

```typescript
staleTime: 30 * 1000,
gcTime: 5 * 60 * 1000,
```

**After:**

```typescript
import { CACHE_POLICIES } from '@shared/utils/cacheManager';

staleTime: CACHE_POLICIES.ARTICLE_LIST.staleTime,
gcTime: CACHE_POLICIES.ARTICLE_LIST.gcTime,
```

### 3. 무효화 로직 통합

**Before:**

```typescript
onSettled: () => {
  void queryClient.invalidateQueries({ queryKey: ... });
  void queryClient.invalidateQueries({ queryKey: ... });
  void queryClient.invalidateQueries({ queryKey: ... });
}
```

**After:**

```typescript
onSettled: async () => {
  const cacheManager = getCacheManager(queryClient);
  await cacheManager.invalidation.invalidateMatchingArticle();
};
```

---

## 📊 모니터링 및 디버깅

### React Query DevTools

- 쿼리 상태 실시간 모니터링
- 캐시 히트/미스 패턴 분석
- staleTime/gcTime 효과 확인

### 로깅 전략

```typescript
// 개발 환경에서 캐시 변경 로깅
if (process.env.NODE_ENV === "development") {
  console.log("[Cache] Invalidating:", queryKey);
}
```

### 성능 메트릭

- 캐시 히트율
- 평균 응답 시간
- 메모리 사용량
- 네트워크 요청 횟수

---

## 🎯 베스트 프랙티스

### DO ✅

- 새로운 훅 작성 시 `CacheManager` 사용
- 엔티티별 무효화 메서드 활용
- 정의된 캐시 정책 준수
- 낙관적 업데이트에서 에러 핸들링 구현

### DON'T ❌

- 직접 `queryClient.invalidateQueries` 호출 (무효화 관리자 사용)
- 하드코딩된 staleTime/gcTime 값 사용
- 무분별한 전체 캐시 무효화
- 낙관적 업데이트 없이 롤백 로직 누락

---

## 🔮 향후 확장 계획

### Phase 2: 고급 기능

- **배치 무효화**: 여러 뮤테이션의 무효화를 배치로 처리
- **캐시 워밍**: 사용자 행동 예측 기반 사전 캐시 로딩
- **오프라인 지원**: 네트워크 상태에 따른 캐시 정책 조정

### Phase 3: 자동화

- **캐시 정책 자동 조정**: 사용 패턴 분석 기반 정책 최적화
- **에러 자동 복구**: 캐시 손상 시 자동 복구 메커니즘
- **성능 대시보드**: 실시간 캐시 성능 모니터링

---

## 📚 참고 자료

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [캐시 무효화 전략](https://react-query.tanstack.com/guides/invalidations-from-mutations)
- [낙관적 업데이트 패턴](https://react-query.tanstack.com/guides/optimistic-updates)

---

**작성일**: 2024년 12월
**버전**: 1.0.0
**담당자**: 프론트엔드 개발팀
