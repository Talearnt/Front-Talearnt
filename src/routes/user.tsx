import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

import UserLayout from "@layout/UserLayout";

const Profile = lazy(() => import("@pages/user/Profile"));

const userRouter: RouteObject[] = [
  {
    element: (
      <Suspense>
        <UserLayout />
      </Suspense>
    ),
    path: "user",
    children: [
      {
        element: <Profile />,
        index: true,
      },
    ],
  },
];

export default userRouter;
