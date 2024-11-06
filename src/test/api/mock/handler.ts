import "broadcast-channel";

if (typeof globalThis.BroadcastChannel === "undefined") {
  globalThis.BroadcastChannel = BroadcastChannel;
}

import { http, HttpResponse } from "msw";
import { PathParams } from "msw/src/core/utils/matching/matchRequestUrl";

import { accountType } from "@pages/auth/api/auth.type";

export const handlers = [
  http.post<PathParams, accountType>(
    "http://3.35.198.221/v1/api/auth/login",
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
  )
];
