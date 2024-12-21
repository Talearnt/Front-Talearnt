import { http, HttpResponse } from "msw";
import { PathParams } from "msw/src/core/utils/matching/matchRequestUrl";

import { accountType } from "@pages/auth/api/auth.type";

export const handlers = [
  http.post<PathParams, accountType>(
    "https://api.talearnt.net/v1/auth/login",
    async ({ request }) => {
      const { userId, pw } = await request.json();

      // 유효한 자격 증명
      if (userId === "test@test.com" && pw === "test") {
        return HttpResponse.json(
          {
            data: {
              accessToken: "valid_token"
            },
            errorCode: null,
            errorMessage: null,
            success: true
          },
          { status: 200 }
        );
      }

      // 무효한 자격 증명
      return HttpResponse.json(
        {
          data: null,
          errorCode: "USER_NOT_FOUND",
          errorMessage: "Invalid credentials",
          success: false
        },
        { status: 404 }
      );
    }
  ),
  http.get<PathParams>(
    "https://api.talearnt.net/v1/auth/users/nickname/random",
    () => {
      const randomNickName =
        "user" + Math.floor(Math.random() * 1000).toString();

      return HttpResponse.json(
        {
          data: randomNickName,
          success: true,
          errorCode: null,
          errorMessage: null
        },
        { status: 200 }
      );
    }
  )
];
