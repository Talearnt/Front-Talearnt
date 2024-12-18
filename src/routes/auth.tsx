import { RouteObject } from "react-router-dom";

// 공통
import CompleteSignUp from "@pages/auth/components/CompleteSignUp/CompleteSignUp";
// 계정 찾기
import ChangePassword from "@pages/auth/FindAccount/components/ChangePassword/ChangePassword";
import FindId from "@pages/auth/FindAccount/components/FindId/FindId";
import FindPassword from "@pages/auth/FindAccount/components/FindPassword/FindPassword";
import FindAccount from "@pages/auth/FindAccount/FindAccount";
// 카카오
import KaKaoExtraInfo from "@pages/auth/KaKao/KaKaoExtraInfo/KaKaoExtraInfo";
import KaKaoOauth from "@pages/auth/KaKao/KaKaoOauth/KaKaoOauth";
// 로그인
import SignIn from "@pages/auth/SignIn/SignIn";
// 회원가입
import Agreements from "@pages/auth/SignUp/components/Agreements/Agreements";
import InfoFields from "@pages/auth/SignUp/components/InfoFields/InfoFields";
import SignUp from "@pages/auth/SignUp/SignUp";

const authRouter: RouteObject[] = [
  {
    element: <SignIn />,
    path: "sign-in"
  },
  {
    path: "kakao",
    children: [
      {
        element: <KaKaoOauth />,
        path: "oauth"
      },
      {
        element: <KaKaoExtraInfo />,
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
