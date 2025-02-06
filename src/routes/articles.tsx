import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const WriteArticle = lazy(
  () => import("@pages/articles/WriteArticle/WriteArticle")
);

const articlesRouter: RouteObject[] = [
  {
    element: <WriteArticle />,
    path: "write-article"
  }
];

export default articlesRouter;
