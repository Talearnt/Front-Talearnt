# 재능 교환 플랫폼 “Talearnt!”

인터넷 강의로 혼자 배우고, 복습하는 것 지겨우셨나요? 😥   
남을 알려주는 것보다 훌륭한 학습 방법은 없다는 것을 알고 계실 거예요! 🧐  
자신이 가진 탁월한 재능을 다른 사람에게 제공하고, 다른 사람의 우수한 재능을 받아보세요! 😍  
자신의 제자이자 스승인 대상을 만들어 재능을 교환하고 더 나은 커리어와 미래를 향해 갑니다. 🧲  

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Zustand, Tanstack Query, Vite, TailwindCSS, ESLint, Prettier
- **DevOps**: AWS(S3, Cloudfront), GitHub Action, Git, Jira

## ✨ 기술적 특징 (Technical Highlights)

- **모듈화된 구조**  
  도메인별로 `features/`, 공통 UI는 `components/`, 페이지 라우팅은 `pages/`로 분리
  `shared/` 폴더에 유틸리티, 타입, 상수 등 공통 코드 집중 관리
  유지보수성과 확장성을 고려한 폴더 설계

  ```text
  src/
    components/      # 공통 UI 컴포넌트
    features/        # 도메인별 기능 모듈
    pages/           # 라우트별 페이지 컴포넌트
    layout/          # 레이아웃 컴포넌트
    store/           # 글로벌 상태관리(zustand)
    shared/          # 공통 유틸리티, 타입, 상수 등
    main.tsx         # 엔트리 포인트
    index.css        # 글로벌 스타일
  ```

- **보안 중심의 토큰 관리**  
  액세스 토큰은 메모리에만 저장하여 XSS/CSRF 공격에 강함
  리프레시 토큰은 httpOnly 쿠키에 저장, 자바스크립트 접근 차단
  새로고침 시 액세스 토큰이 소멸되면, 리프레시 토큰으로 자동 재발급
  로그아웃 시 서버와 클라이언트 모두 토큰 완전 삭제

- **상태 및 데이터 관리 최적화**  
  글로벌 상태는 `zustand`로 관리, 비즈니스 로직과 UI 상태 분리
  서버 데이터는 `tanstack-query`로 캐싱 및 동기화, 불필요한 네트워크 요청 최소화
  커스텀 훅(`useQueryWithInitial`, `useDebounce` 등)으로 데이터 패칭, 입력 최적화 등 공통 로직 재사용

- **유틸리티/헬퍼 함수 적극 활용**  
  `apiMethods`로 API 요청 공통화 및 에러 핸들링 일원화
  `classNames` 등 유틸 함수로 코드 가독성 및 생산성 향상

- **코드 품질 및 일관성**  
  ESLint, Prettier, GitHub Actions로 코드 스타일 자동화 및 CI/CD 적용
  커밋, 네이밍, 폴더 구조 등 팀 컨벤션 엄격 준수

- **최신 프론트엔드 생태계 적극 도입**  
  Vite 기반의 빠른 개발 환경
  TailwindCSS로 생산적이고 일관된 UI 개발
  타입 안정성을 위한 Typescript 사용

## 🧑‍💻 코드 품질 및 설정

### TypeScript(tsconfig.json)

- **엄격한 타입 검사**: `strict`, `noImplicitAny`, `strictNullChecks` 등으로 타입 안정성 극대화
- **불필요한 코드 방지**: `noUnusedLocals`, `noUnusedParameters`로 미사용 변수/파라미터 방지
- **모듈/경로 관리**: `baseUrl`, `paths`로 절대경로 import 지원(`@components/*`, `@features/*` 등)
- **최신 JS/TS 지원**: `target: ES2015`, `module: ESNext`, `jsx: react-jsx`
- **빌드 최적화**: `incremental`, `declaration`, `skipLibCheck` 등으로 빠른 빌드와 타입 선언 파일 관리
- **파일명 대소문자 일치 강제**: `forceConsistentCasingInFileNames: true`

### ESLint(코드 스타일/품질 관리)

- **import 순서 자동 정렬**: `simple-import-sort`로 그룹별 import 순서 자동 정렬
- **상대경로 import 금지**: `eslint-plugin-no-relative-import-paths`로 src 외부 상대경로 import 방지, 절대경로만 허용
- **React Hooks 규칙 엄격 적용**: `eslint-plugin-react-hooks`로 useEffect 등 훅 사용 규칙 강제
- **Prettier 연동**: 코드 스타일 자동화 및 포맷팅 일관성 유지
- **네이밍 컨벤션**: 변수, 함수, 타입, 파라미터 등 각각에 맞는 네이밍 규칙 적용(camelCase, PascalCase, UPPER_CASE 등)
- **불필요한 코드 방지**: 미사용 변수/파라미터, 중복 import, object shorthand, prefer-destructuring 등 다양한 코드 품질 룰 적용

## 📄 코드 컨벤션

- **컴포넌트/파일명** : PascalCase
- **함수/변수명** : camelCase
- **상수** : 대문자 + 언더스코어
- **폴더명** : 소문자 + 케밥케이스
- **주석** : 한글/영문 혼용, 명확한 의도 전달

## 📃 GIT Convention

GIT Flow브랜치 전략을 따릅니다.  
커밋 메시지 양식 및 예시
```
양식)
type : 어떤 타입의 작업인지
body : 커밋 내용
footer : #이슈번호

예제)
[FEAT] 테스트 커밋 | Test commit TALEARNT-XXX

타입 종류
- FEAT : 새로운 기능 추가
- STYLE : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- CHORE : 빌드 업무 수정, 패키지 매니저 수정, 잡다한 수정
```

## 기타

- **코드 리뷰** : PR 단위로 코드 리뷰 진행
