import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const MatchingArticleList = lazy(
  () => import("@pages/articles/MatchingArticleList/MatchingArticleList")
);
const MatchingArticleDetail = lazy(
  () => import("@pages/articles/MatchingArticleDetail/MatchingArticleDetail")
);
const CommunityArticleList = lazy(
  () => import("@pages/articles/CommunityArticleList/CommunityArticleList")
);
const CommunityArticleDetail = lazy(
  () => import("@pages/articles/CommunityArticleDetail/CommunityArticleDetail")
);
const WriteArticle = lazy(
  () => import("@pages/articles/WriteArticle/WriteArticle")
);
const WriteMatchingArticle = lazy(
  () =>
    import(
      "@pages/articles/WriteArticle/WriteMatchingArticle/WriteMatchingArticle"
    )
);
const WriteCommunityArticle = lazy(
  () =>
    import(
      "@pages/articles/WriteArticle/WriteCommunityArticle/WriteCommunityArticle"
    )
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
        <MatchingArticleDetail />
      </Suspense>
    ),
    path: "matching-article/:exchangePostNo"
  },
  {
    element: (
      <Suspense>
        <CommunityArticleList />
      </Suspense>
    ),
    path: "community"
  },
  {
    element: (
      <Suspense>
        <CommunityArticleDetail />
      </Suspense>
    ),
    path: "community-article/:communityPostNo"
  },
  {
    element: (
      <Suspense>
        <WriteArticle />
      </Suspense>
    ),
    path: "write-article",
    children: [
      { element: <WriteMatchingArticle />, path: "match" },
      { element: <WriteCommunityArticle />, path: "community" }
    ]
  }
];

export default articlesRouter;
