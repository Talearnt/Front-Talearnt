import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const MatchingArticleList = lazy(
  () => import("@pages/articles/MatchingArticleList/MatchingArticleList")
);
const WriteArticle = lazy(
  () => import("@pages/articles/WriteArticle/WriteArticle")
);

const articlesRouter: RouteObject[] = [
  {
    element: (
      <Suspense>
        <MatchingArticleList />
      </Suspense>
    ),
    path: "matching"
  },
  {
    element: (
      <Suspense>
        <WriteArticle />
      </Suspense>
    ),
    path: "write-article"
  }
];

export default articlesRouter;
