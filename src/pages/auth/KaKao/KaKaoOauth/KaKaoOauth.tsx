import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getKakaoAccessToken } from "@pages/auth/api/auth.api";

import { useKakaoAuthResponseStore } from "@pages/auth/api/auth.store";

import { kakaoAuthResponseType } from "@pages/auth/api/auth.type";

function KaKaoOauth() {
  const navigator = useNavigate();
  const [searchParams] = useSearchParams();

  const { setResponse } = useKakaoAuthResponseStore();

  const code = searchParams.get("code");

  useEffect(() => {
    if (code === null) {
      return;
    }

    getKakaoAccessToken(code)
      .then(({ data }) => {
        setResponse(data as kakaoAuthResponseType);
        navigator("/kakao/info-fields");
      })
      .catch((error: unknown) => {
        // TODO 에러 핸들링
        console.log(error);
      });
  }, [code, navigator, setResponse]);

  // TODO 로딩 화면
  return null;
}

export default KaKaoOauth;
