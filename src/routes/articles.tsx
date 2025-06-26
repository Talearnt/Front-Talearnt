import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

import PrivateRoute from "@routes/PrivateRoute";

import WriteArticleLayout from "@layout/WriteArticleLayout";

const MatchingArticleList = lazy(
  () => import("@pages/articles/MatchingArticleList")
);
const MatchingArticleDetail = lazy(
  () => import("@pages/articles/MatchingArticleDetail")
);
const CommunityArticleList = lazy(
  () => import("@pages/articles/CommunityArticleList")
);
const CommunityArticleDetail = lazy(
  () => import("@pages/articles/CommunityArticleDetail")
);
const WriteMatchingArticle = lazy(
  () => import("@pages/articles/WriteMatchingArticle")
);
const WriteCommunityArticle = lazy(
  () => import("@pages/articles/WriteCommunityArticle")
);

const articlesRouter: RouteObject[] = [
  {
    element: (
      <Suspense>
        <MatchingArticleList />
      </Suspense>
    ),
    path: "matching",
  },
  {
    element: (
      <Suspense>
        <MatchingArticleDetail />
      </Suspense>
    ),
    path: "matching-article/:exchangePostNo",
  },
  {
    element: (
      <Suspense>
        <CommunityArticleList />
      </Suspense>
    ),
    path: "community",
  },
  {
    element: (
      <Suspense>
        <CommunityArticleDetail />
      </Suspense>
    ),
    path: "community-article/:communityPostNo",
  },
  {
    element: (
      <PrivateRoute>
        <Suspense>
          <WriteArticleLayout />
        </Suspense>
      </PrivateRoute>
    ),
    path: "write-article",
    children: [
      { element: <WriteMatchingArticle />, path: "matching" },
      { element: <WriteCommunityArticle />, path: "community" },
    ],
  },
];

export default articlesRouter;
