export const createQueryKey = (
  key: unknown[],
  { isLoggedIn, isList }: { isLoggedIn?: boolean; isList?: boolean } = {}
) => [
  isLoggedIn ? "AFTER_LOGIN" : "BEFORE_LOGIN",
  ...(isList ? ["LIST"] : []),
  ...key
];
