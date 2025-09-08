import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

import PrivateRoute from "@routes/PrivateRoute";

import UserLayout from "@layout/UserLayout";

const Profile = lazy(() => import("@pages/user/Profile"));
const FavoriteMatchingArticleList = lazy(
  () => import("@pages/user/FavoriteMatchingArticleList")
);
const WrittenArticleList = lazy(() => import("@pages/user/WrittenArticleList"));
const WrittenCommentAndReplyList = lazy(
  () => import("@pages/user/WrittenCommentAndReplyList")
);
const AccountSetting = lazy(() => import("@pages/user/AccountSetting"));
const WithdrawAccount = lazy(() => import("@pages/user/WithdrawAccount"));
const WithdrawComplete = lazy(() => import("@pages/user/WithdrawComplete"));
const NotificationSetting = lazy(
  () => import("@pages/user/NotificationSetting")
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
      {
        element: (
          <Suspense>
            <WrittenArticleList />
          </Suspense>
        ),
        path: "articles",
      },
      {
        element: (
          <Suspense>
            <WrittenCommentAndReplyList />
          </Suspense>
        ),
        path: "comments",
      },
      {
        element: (
          <Suspense>
            <AccountSetting />
          </Suspense>
        ),
        path: "account",
      },
      {
        element: (
          <Suspense>
            <NotificationSetting />
          </Suspense>
        ),
        path: "notification",
      },
    ],
  },
  {
    element: (
      <Suspense>
        <PrivateRoute>
          <WithdrawAccount />
        </PrivateRoute>
      </Suspense>
    ),
    path: "withdrawal",
  },
  {
    element: (
      <Suspense>
        <WithdrawComplete />
      </Suspense>
    ),
    path: "withdrawal-complete",
  },
];

export default userRouter;
