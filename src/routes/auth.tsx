import { RouteObject } from "react-router-dom";

import Login from "@pages/auth/Login/Login";

const authRouter: RouteObject[] = [
  {
    element: <Login />,
    path: "login"
  }
];

export default authRouter;
