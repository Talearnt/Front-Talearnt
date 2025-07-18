import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getKakaoAccessToken } from "@features/auth/signIn/signIn.api";

import { checkObjectType } from "@shared/utils/checkObjectType";

import { useKakaoAuthResponseStore } from "@features/auth/signUp/signUp.store";
import { usePromptStore } from "@store/prompt.store";
import { useAuthStore } from "@store/user.store";

function KakaoOauth() {
  const navigator = useNavigate();
  const [searchParams] = useSearchParams();

  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const setPrompt = usePromptStore(state => state.setPrompt);
  const setResponse = useKakaoAuthResponseStore(state => state.setResponse);

  const code = searchParams.get("code");

  useEffect(() => {
    if (code === null) {
      return;
    }

    getKakaoAccessToken(code)
      .then(({ data: { accessToken, isRegistered, ...data } }) => {
        if (isRegistered) {
          setAccessToken(accessToken);
          navigator("/");
        } else {
          setResponse(data);
          navigator("/kakao/info-fields");
        }
      })
      .catch((error: unknown) => {
        if (
          checkObjectType(error) &&
          "errorCode" in error &&
          error.errorCode === "409-USER-17"
        ) {
          setPrompt({
            title: "가입된 회원 정보",
            content:
              "이미 가입된 계정이 있습니다. 기존 아이디로 로그인 해주세요.",
          });
        } else {
          setPrompt({
            title: "카카오 연동 실패",
            content: "카카오로부터 연동이 실패하였습니다.",
          });
        }

        navigator("/sign-in");
      });
  }, [code, navigator, setAccessToken, setPrompt, setResponse]);

  return (
    <div className={"flex flex-col items-center gap-10"}>
      <h1 className={"text-center text-heading1_30_semibold"}>
        회원님의 정보를
        <br />
        가져오는 중이에요
      </h1>
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_3540_51413)">
          <rect width="240" height="240" rx="120" fill="#DEE1E3" />
          <path
            d="M181.055 72.5334C179.05 79.142 176.546 85.3512 173.651 91.1409C201.745 99.5453 224.273 122.831 230.089 153.521C238.405 197.397 209.412 239.757 165.31 248.115C125.051 255.746 86.1496 232.401 73.3415 194.881L73.3159 194.941L73.3552 142.619C77.6739 130.093 85.0056 118.776 94.6674 109.733C87.3829 99.3152 81.3223 86.7933 77.306 72.8013C74.9695 64.6565 73.4776 56.5901 72.7503 48.7642C72.3942 44.6479 73.2486 40.5958 75.0671 37.0583C79.0051 29.4308 88.4124 26.7303 95.8059 31.1092C99.236 33.1565 102.105 36.1359 103.983 39.8169C107.546 46.8484 110.56 54.4796 112.893 62.6068C116.027 73.4997 117.663 84.2729 117.924 94.4994C123.359 92.148 129.12 90.3406 135.188 89.1903C138.232 88.6135 141.259 88.2417 144.256 88.0039C144.874 79.8862 146.424 71.4269 149.015 62.917C151.241 55.5956 154.087 48.7255 157.389 42.4113C159.137 39.0889 161.785 36.4219 164.909 34.6186C171.64 30.7372 180.123 33.2764 183.578 40.2185C185.187 43.4551 185.9 47.1184 185.518 50.8424C184.758 57.9226 183.281 65.212 181.055 72.5334Z"
            fill="white"
          />
          <circle
            cx="150.545"
            cy="169.226"
            r="81.6913"
            transform="rotate(-10.732 150.545 169.226)"
            fill="white"
          />
          <path
            d="M101.578 104.016C104.501 101.829 107.574 99.8517 110.808 98.0459C111.382 90.7624 110.632 82.7205 108.275 74.5614C107.019 70.1751 105.392 66.0614 103.476 62.2774C102.454 60.2876 100.915 58.6891 99.0661 57.5899C95.0782 55.2263 90.0075 56.6828 87.8915 60.7905C86.9078 62.7018 86.4541 64.8797 86.6356 67.1023C87.0297 71.3214 87.8377 75.6823 89.0931 80.0685C91.806 89.5183 96.2553 97.7214 101.578 104.016Z"
            fill="#ECEEEF"
          />
          <path
            d="M167.436 89.5735C169.584 85.4413 171.353 80.8672 172.651 75.9421C173.741 71.7719 174.415 67.6439 174.693 63.6643C174.83 61.5649 174.348 59.5093 173.384 57.7286C171.295 53.9041 166.467 52.6539 162.761 54.9893C161.048 56.0664 159.61 57.6234 158.698 59.5212C156.967 63.1338 155.535 67.0569 154.445 71.227C152.958 76.9037 152.285 82.4993 152.295 87.8007C157.44 87.908 162.513 88.5063 167.453 89.5701L167.436 89.5735Z"
            fill="#ECEEEF"
          />
          <path
            d="M106.911 184.373C109.614 183.861 111.392 181.265 110.882 178.575C110.372 175.884 107.767 174.119 105.064 174.631C102.361 175.143 100.583 177.74 101.093 180.43C101.603 183.12 104.208 184.886 106.911 184.373Z"
            fill="#DEE1E3"
          />
          <path
            d="M156.813 174.92C159.516 174.408 161.294 171.812 160.784 169.121C160.274 166.431 157.67 164.666 154.967 165.178C152.264 165.69 150.486 168.286 150.996 170.977C151.505 173.667 154.11 175.433 156.813 174.92Z"
            fill="#DEE1E3"
          />
          <path
            d="M132.338 182.661L135.036 182.205C138.018 181.695 140.398 184.235 139.335 186.308L138.377 188.159C138.377 188.159 138.348 188.202 138.333 188.223L137.914 188.926C136.154 191.902 132.168 192.658 129.442 190.532L128.794 190.031C128.794 190.031 128.751 190.002 128.73 189.988L127.161 188.615C125.409 187.057 126.699 183.84 129.661 183.224L132.338 182.661Z"
            fill="#DEE1E3"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M93.5265 227.68C92.1811 226.359 90.8717 224.982 89.6013 223.55C79.819 212.524 73.5621 199.589 70.7481 186.126C70.0301 186.947 69.2534 187.729 68.4177 188.47C66.9001 189.817 65.254 190.964 63.5457 191.877C62.9486 192.214 62.3483 192.602 61.8063 193.083C58.0664 196.401 57.6977 202.126 61.012 205.862C61.5983 206.523 62.2826 207.049 63.0107 207.487L63.0075 207.538C73.655 213.251 83.8764 219.971 93.5265 227.68Z"
            fill="white"
          />
          <circle
            cx="103.049"
            cy="178.551"
            r="17.6834"
            stroke="#DEE1E3"
            strokeWidth="2.4"
          />
          <circle
            cx="159.175"
            cy="166.567"
            r="18.0939"
            stroke="#DEE1E3"
            strokeWidth="2.4"
          />
          <path
            d="M119.208 172.926C123.152 170.948 130.177 167.767 141.654 168.39"
            stroke="#DEE1E3"
            strokeWidth="2.4"
          />
        </g>
        <defs>
          <clipPath id="clip0_3540_51413">
            <rect width="240" height="240" rx="120" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default KakaoOauth;
