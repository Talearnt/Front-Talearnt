import { expect, test } from "vitest";

import { signInApi } from "@pages/auth/SignIn/hook/signIn.api";

import { apiErrorType } from "@type/apiMethods.type";

test("should allow users to login with valid credentials", async () => {
  const { status } = await signInApi({
    userId: "test@test.com",
    pw: "test"
  });

  expect(status).toBe(200);
});

test("should not allow users to login with invalid credentials", async () => {
  try {
    await signInApi({
      userId: "invalid_user",
      pw: "invalid_password"
    });
  } catch (e) {
    const { status } = e as apiErrorType;
    expect(status).toBe(404);
  }
});
