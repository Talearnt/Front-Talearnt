import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

// 공통
const CompleteSignUp = lazy(
  () => import("@pages/auth/components/CompleteSignUp/CompleteSignUp")
);
// 계정 찾기
const ChangePassword = lazy(
  () => import("@pages/auth/FindAccount/ChangePassword/ChangePassword")
);
const FindAccount = lazy(() => import("@pages/auth/FindAccount/FindAccount"));
const FindId = lazy(() => import("@pages/auth/FindAccount/FindId/FindId"));
const FindPassword = lazy(
  () => import("@pages/auth/FindAccount/FindPassword/FindPassword")
);
// 카카오
const Kakao = lazy(() => import("@pages/auth/Kakao/Kakao"));
const KakaoExtraInfo = lazy(
  () => import("@pages/auth/Kakao/KakaoExtraInfo/KakaoExtraInfo")
);
const KakaoOauth = lazy(
  () => import("@pages/auth/Kakao/KakaoOauth/KakaoOauth")
);
// 로그인
const SignIn = lazy(() => import("@pages/auth/SignIn/SignIn"));
// 회원가입
const Agreements = lazy(
  () => import("@pages/auth/SignUp/Agreements/Agreements")
);
const InfoFields = lazy(
  () => import("@pages/auth/SignUp/InfoFields/InfoFields")
);
const SignUp = lazy(() => import("@pages/auth/SignUp/SignUp"));

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
        <Kakao />
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
        <SignUp />
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
        <FindAccount />
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
