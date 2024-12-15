import { expect, test } from "vitest";

import { getRandomNickName, postSignIn } from "@pages/auth/api/auth.api";

import { apiErrorType } from "@common/common.type";

test("should allow users to login with valid credentials", async () => {
  const { status } = await postSignIn({
    userId: "test@test.com",
    pw: "test"
  });

  expect(status).toBe(200);
});

test("should not allow users to login with invalid credentials", async () => {
  try {
    await postSignIn({
      userId: "invalid_user",
      pw: "invalid_password"
    });
  } catch (e) {
    const { status } = e as apiErrorType;

    expect(status).toBe(404);
  }
});

test("should return a string for data when status is 200", async () => {
  const { data, status } = await getRandomNickName();

  if (status === 200) {
    expect(typeof data).toBe("string");
  } else {
    expect(data).toBeUndefined();
  }
});
