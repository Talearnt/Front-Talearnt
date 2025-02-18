export const createQueryKey = (
  key: unknown[],
  {
    isLoggedIn,
    isArticleList
  }: { isLoggedIn?: boolean; isArticleList?: boolean } = {}
) => [
  isLoggedIn ? "AFTER_LOGIN" : "BEFORE_LOGIN",
  ...(isArticleList ? ["ARTICLE_LIST"] : []),
  ...key
];
