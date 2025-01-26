import { RouteObject } from "react-router-dom";

// 글쓰기
import { WriteArticle } from "@pages/articles/WriteArticle/WriteArticle";

const articlesRouter: RouteObject[] = [
  {
    element: <WriteArticle />,
    path: "write-article"
  }
];

export default articlesRouter;
