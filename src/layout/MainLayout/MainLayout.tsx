import { Outlet, useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { LogoIcon } from "@components/icons/LogoIcon/LogoIcon";
import { SearchIcon } from "@components/icons/SearchIcon/SearchIcon";
import { Input } from "@components/Input/Input";

function MainLayout() {
  const navigator = useNavigate();

  return (
    <div>
      <header
        className={classNames(
          "flex items-center justify-between",
          "px-20 shadow-[inset_0_-1px_0_0] shadow-talearnt-Line_01",
          "h-[88px]"
        )}
      >
        <LogoIcon className={"cursor-pointer"} onClick={() => navigator("/")} />
        <Input
          className={classNames(
            "rounded-full border-talearnt-Primary_01 pr-[55px]",
            "h-10"
          )}
          wrapperClassName={classNames("relative", "w-[31.25rem]")}
        >
          <SearchIcon
            className={classNames("absolute right-4 top-2", "cursor-pointer")}
          />
        </Input>
        <div className={classNames("flex gap-[16px]", "h-[40px]")}>
          <Button
            buttonStyle={"outlined"}
            className={"w-[6.875rem]"}
            onClick={() => navigator("sign-in")}
          >
            로그인
          </Button>
          <Button
            className={"w-[6.875rem]"}
            onClick={() => navigator("sign-up")}
          >
            회원가입
          </Button>
        </div>
      </header>
      <main
        className={classNames("mx-auto mb-[120px] mt-[94px]", "max-w-[848px]")}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
