import { RouteObject } from "react-router-dom";

import FindId from "@pages/auth/FindAccount/components/FindId/FindId";
import FindPassword from "@pages/auth/FindAccount/components/FindPassword/FindPassword";
import FindAccount from "@pages/auth/FindAccount/FindAccount";
import SignIn from "@pages/auth/SignIn/SignIn";
import SignUp from "@pages/auth/SignUp/SignUp";

const authRouter: RouteObject[] = [
  {
    element: <SignIn />,
    path: "sign-in"
  },
  {
    element: <SignUp />,
    path: "sign-up"
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
      }
    ]
  }
];

export default authRouter;
