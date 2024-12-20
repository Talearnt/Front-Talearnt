import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { getAccessTokenUseRefreshToken } from "@pages/auth/auth.api";

import { classNames } from "@utils/classNames";

import { useAuthStore } from "@pages/auth/auth.store";

import { Button } from "@components/Button/Button";
import { LogoIcon } from "@components/icons/LogoIcon/LogoIcon";
import { SearchIcon } from "@components/icons/SearchIcon/SearchIcon";
import { Input } from "@components/Input/Input";
import { Toast } from "@components/Toast/Toast";

function MainLayout() {
  const navigator = useNavigate();

  const { accessToken, setAccessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken === null) {
      getAccessTokenUseRefreshToken()
        .then(({ data }) => {
          setAccessToken(data.accessToken);
        })
        .catch((error: unknown) =>
          console.error("Token refresh failed", error)
        );
    }
  }, [accessToken, setAccessToken]);

  return (
    <>
      <header
        className={classNames(
          "flex items-center justify-center",
          "shadow-[inset_0_-1px_0_0] shadow-talearnt-Line_01",
          "h-[98px]"
        )}
      >
        <LogoIcon
          className={classNames("mr-[40px]", "cursor-pointer")}
          onClick={() => navigator("/")}
        />
        <Input
          className={classNames(
            "rounded-full border-talearnt-Primary_01 pr-[55px]",
            "h-[50px]"
          )}
          placeholder={"관심있는 재능 키워드를 입력해 주세요."}
          wrapperClassName={classNames("relative", "w-[31.25rem] mr-[358px]")}
        >
          <SearchIcon
            className={classNames(
              "absolute right-4 top-[10px]",
              "cursor-pointer"
            )}
          />
        </Input>
        <div className={classNames("flex items-center gap-[8px]", "h-[40px]")}>
          <Link
            className={classNames(
              "flex items-center justify-center",
              "h-[40px] w-[94px]",
              "text-lg font-medium text-talearnt-Text_02"
            )}
            to={"sign-up/agreements"}
          >
            회원가입
          </Link>
          <Button
            buttonStyle={"outlined"}
            className={classNames("h-[40px] w-[110px]", "text-lg")}
            onClick={() => navigator("sign-in")}
          >
            로그인
          </Button>
        </div>
      </header>
      <main
        className={classNames("mx-auto mb-[120px] mt-[96px]", "max-w-[848px]")}
      >
        <Outlet />
        <Toast />
      </main>
    </>
  );
}

export default MainLayout;
