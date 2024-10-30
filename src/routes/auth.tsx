import { RouteObject } from "react-router-dom";

import SignIn from "@pages/auth/SignIn/SignIn";

const authRouter: RouteObject[] = [
  {
    element: <SignIn />,
    path: "sign-in"
  }
];

export default authRouter;
