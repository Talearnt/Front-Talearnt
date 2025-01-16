import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { getAccessTokenUseRefreshToken } from "@pages/auth/auth.api";

import { classNames } from "@utils/classNames";

import { usePromptStore } from "@common/common.store";
import { useAuthStore } from "@pages/auth/auth.store";

import { Button } from "@components/Button/Button";
import { LogoIcon } from "@components/icons/LogoIcon/LogoIcon";
import { NotificationIcon } from "@components/icons/NotificationIcon/NotificationIcon";
import { Prompt } from "@components/Prompt/Prompt";
import { Toast } from "@components/Toast/Toast";

const linkArray = [
  {
    path: "talent",
    content: "재능교환"
  },
  {
    path: "community",
    content: "커뮤니티"
  },
  {
    path: "sign-up/agreements",
    content: "회원가입"
  }
];

function MainLayout() {
  const navigator = useNavigate();

  const accessToken = useAuthStore(state => state.accessToken);
  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const promptData = usePromptStore(state => state.promptData);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessToken === null) {
      getAccessTokenUseRefreshToken()
        .then(({ data }) => {
          setAccessToken(data.accessToken);
        })
        .catch((error: unknown) => console.error("Token refresh failed", error))
        .finally(() => setIsLoading(false));
    }
  }, [accessToken, setAccessToken]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <header
        className={classNames(
          "shadow-[inset_0_-1px_0_0] shadow-talearnt-Line_01"
        )}
      >
        <div
          className={classNames(
            "flex items-center justify-between",
            "mx-auto h-[98px] max-w-[1440px] px-[80px]"
          )}
        >
          <LogoIcon
            className={classNames("cursor-pointer")}
            onClick={() => navigator("/")}
          />
          <div className={"flex items-center gap-6"}>
            <div className={classNames("flex items-center gap-2", "h-[40px]")}>
              {linkArray.map(({ path, content }) => {
                if (content === "회원가입" && accessToken) {
                  return;
                }

                return (
                  <Link
                    className={classNames(
                      "flex items-center justify-center",
                      "h-[40px] w-[94px]",
                      "text-lg font-medium text-talearnt-Text_02"
                    )}
                    to={path}
                    key={path}
                  >
                    {content}
                  </Link>
                );
              })}
              <Button
                buttonStyle={"outlined"}
                className={classNames("h-[40px] w-[110px]", "text-lg")}
                onClick={() => navigator(accessToken ? "" : "sign-in")}
              >
                {accessToken ? "글쓰기" : "로그인"}
              </Button>
            </div>
            {accessToken && (
              <>
                <NotificationIcon />
                <div className={"flex items-center"}>
                  <div
                    className={classNames(
                      "rounded-full border border-talearnt-Icon_02 bg-talearnt-BG_Up_02",
                      "h-8 w-8"
                    )}
                  />
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.60482 5.69531H11.3952C11.5153 5.69582 11.6326 5.73193 11.7322 5.79908C11.8318 5.86623 11.9092 5.96141 11.9547 6.07258C12.0002 6.18374 12.0118 6.30591 11.9878 6.42362C11.9639 6.54134 11.9056 6.64932 11.8203 6.73391L8.43123 10.123C8.37477 10.1799 8.30759 10.2251 8.23358 10.256C8.15957 10.2868 8.08018 10.3027 8 10.3027C7.91982 10.3027 7.84043 10.2868 7.76642 10.256C7.69241 10.2251 7.62523 10.1799 7.56877 10.123L4.17966 6.73391C4.09438 6.64932 4.03609 6.54134 4.01217 6.42362C3.98824 6.30591 3.99977 6.18374 4.04527 6.07258C4.09078 5.96141 4.16823 5.86623 4.26783 5.79908C4.36743 5.73193 4.4847 5.69582 4.60482 5.69531Z"
                      fill="#414A4E"
                    />
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <main className={classNames("mx-auto mb-[120px] mt-[96px]")}>
        <Outlet />
      </main>
      <Toast />
      {promptData && <Prompt />}
    </>
  );
}

export default MainLayout;
