import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

import FindAccountLayout from "@layout/auth/FindAccountLayout";
import KakaoLayout from "@layout/auth/KakaoLayout";
import SignUpLayout from "@layout/auth/SignUpLayout";

// 공통
const CompleteSignUp = lazy(() => import("@pages/auth/CompleteSignUp"));

// 계정 찾기
const ChangePassword = lazy(() => import("@pages/auth/ChangePassword"));
const FindId = lazy(() => import("@pages/auth/FindId"));
const FindPassword = lazy(() => import("@pages/auth/FindPassword"));

// 카카오
const KakaoExtraInfo = lazy(() => import("@pages/auth/KakaoExtraInfo"));
const KakaoOauth = lazy(() => import("@pages/auth/KakaoOauth"));

// 로그인
const SignIn = lazy(() => import("@pages/auth/SignIn"));

// 회원가입
const Agreements = lazy(() => import("@pages/auth/Agreements"));
const InfoFields = lazy(() => import("@pages/auth/InfoFields"));

const authRouter: RouteObject[] = [
  {
    element: (
      <Suspense>
        <SignIn />
      </Suspense>
    ),
    path: "sign-in"
  },
  {
    element: (
      <Suspense>
        <KakaoLayout />
      </Suspense>
    ),
    path: "kakao",
    children: [
      { element: <KakaoOauth />, path: "oauth" },
      { element: <KakaoExtraInfo />, path: "info-fields" },
      { element: <CompleteSignUp />, path: "complete" }
    ]
  },
  {
    element: (
      <Suspense>
        <SignUpLayout />
      </Suspense>
    ),
    path: "sign-up",
    children: [
      { element: <Agreements />, path: "agreements" },
      { element: <InfoFields />, path: "info-fields" },
      { element: <CompleteSignUp />, path: "complete" }
    ]
  },
  {
    element: (
      <Suspense>
        <FindAccountLayout />
      </Suspense>
    ),
    path: "find-account",
    children: [
      { element: <FindId />, path: "id" },
      { element: <FindPassword />, path: "pw" },
      { element: <ChangePassword />, path: "change" }
    ]
  }
];

export default authRouter;
