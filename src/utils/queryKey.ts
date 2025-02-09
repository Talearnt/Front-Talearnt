export const createAfterSignInQueryKey = (key: unknown[]) => [
  "AFTER_LOGIN",
  ...key
];
