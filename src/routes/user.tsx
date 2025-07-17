import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

import PrivateRoute from "@routes/PrivateRoute";

import UserLayout from "@layout/UserLayout";

const Profile = lazy(() => import("@pages/user/Profile"));
const FavoriteMatchingArticleList = lazy(
  () => import("@pages/user/FavoriteMatchingArticleList")
);

const userRouter: RouteObject[] = [
  {
    element: (
      <PrivateRoute>
        <UserLayout />
      </PrivateRoute>
    ),
    path: "user",
    children: [
      {
        element: (
          <Suspense>
            <Profile />
          </Suspense>
        ),
        index: true,
      },
      {
        element: (
          <Suspense>
            <FavoriteMatchingArticleList />
          </Suspense>
        ),
        path: "favorites",
      },
    ],
  },
];

export default userRouter;
