import { RouteObject } from "react-router-dom";

// 공통
import CompleteSignUp from "@pages/auth/components/CompleteSignUp/CompleteSignUp";
// 계정 찾기
import ChangePassword from "@pages/auth/FindAccount/ChangePassword/ChangePassword";
import FindAccount from "@pages/auth/FindAccount/FindAccount";
import FindId from "@pages/auth/FindAccount/FindId/FindId";
import FindPassword from "@pages/auth/FindAccount/FindPassword/FindPassword";
// 카카오
import Kakao from "@pages/auth/Kakao/Kakao";
import KakaoExtraInfo from "@pages/auth/Kakao/KakaoExtraInfo/KakaoExtraInfo";
import KakaoOauth from "@pages/auth/Kakao/KakaoOauth/KakaoOauth";
// 로그인
import SignIn from "@pages/auth/SignIn/SignIn";
// 회원가입
import Agreements from "@pages/auth/SignUp/Agreements/Agreements";
import InfoFields from "@pages/auth/SignUp/InfoFields/InfoFields";
import SignUp from "@pages/auth/SignUp/SignUp";

const authRouter: RouteObject[] = [
  {
    element: <SignIn />,
    path: "sign-in"
  },
  {
    element: <Kakao />,
    path: "kakao",
    children: [
      {
        element: <KakaoOauth />,
        path: "oauth"
      },
      {
        element: <KakaoExtraInfo />,
        path: "info-fields"
      },
      {
        element: <CompleteSignUp />,
        path: "complete"
      }
    ]
  },
  {
    element: <SignUp />,
    path: "sign-up",
    children: [
      {
        element: <Agreements />,
        path: "agreements"
      },
      {
        element: <InfoFields />,
        path: "info-fields"
      },
      {
        element: <CompleteSignUp />,
        path: "complete"
      }
    ]
  },
  {
    element: <FindAccount />,
    path: "find-account",
    children: [
      {
        element: <FindId />,
        path: "id"
      },
      {
        element: <FindPassword />,
        path: "pw"
      },
      {
        element: <ChangePassword />,
        path: "change"
      }
    ]
  }
];

export default authRouter;
