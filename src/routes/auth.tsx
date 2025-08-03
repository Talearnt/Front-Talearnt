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
    path: "sign-in",
  },
  {
    element: <KakaoLayout />,
    path: "kakao",
    children: [
      {
        element: (
          <Suspense>
            <KakaoOauth />
          </Suspense>
        ),
        path: "oauth",
      },
      {
        element: (
          <Suspense>
            <KakaoExtraInfo />
          </Suspense>
        ),
        path: "info-fields",
      },
      {
        element: (
          <Suspense>
            <CompleteSignUp />
          </Suspense>
        ),
        path: "complete",
      },
    ],
  },
  {
    element: <SignUpLayout />,
    path: "sign-up",
    children: [
      {
        element: (
          <Suspense>
            <Agreements />
          </Suspense>
        ),
        path: "agreements",
      },
      {
        element: (
          <Suspense>
            <InfoFields />
          </Suspense>
        ),
        path: "info-fields",
      },
      {
        element: (
          <Suspense>
            <CompleteSignUp />
          </Suspense>
        ),
        path: "complete",
      },
    ],
  },
  {
    element: <FindAccountLayout />,
    path: "find-account",
    children: [
      {
        element: (
          <Suspense>
            <FindId />
          </Suspense>
        ),
        path: "id",
      },
      {
        element: (
          <Suspense>
            <FindPassword />
          </Suspense>
        ),
        path: "pw",
      },
      {
        element: (
          <Suspense>
            <ChangePassword />
          </Suspense>
        ),
        path: "change",
      },
    ],
  },
];

export default authRouter;
