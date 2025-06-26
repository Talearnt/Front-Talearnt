import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

import PrivateRoute from "@routes/PrivateRoute";

import UserLayout from "@layout/UserLayout";

const Profile = lazy(() => import("@pages/user/Profile"));

const userRouter: RouteObject[] = [
  {
    element: (
      <PrivateRoute>
        <Suspense>
          <UserLayout />
        </Suspense>
      </PrivateRoute>
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
