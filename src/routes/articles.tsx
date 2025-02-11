import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const WriteArticle = lazy(
  () => import("@pages/articles/WriteArticle/WriteArticle")
);

const articlesRouter: RouteObject[] = [
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
