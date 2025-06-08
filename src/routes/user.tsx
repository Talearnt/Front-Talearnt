import { Suspense } from "react";
import { RouteObject } from "react-router-dom";

import UserLayout from "@layout/UserLayout";

const userRouter: RouteObject[] = [
  {
    element: (
      <Suspense>
        <UserLayout />
      </Suspense>
    ),
    path: "user",
  },
];

export default userRouter;
