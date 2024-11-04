import { Outlet, useNavigate } from "react-router-dom";

import { Button } from "@components/Button/Button";
import { LogoIcon } from "@components/icons/LogoIcon/LogoIcon";
import { SearchIcon } from "@components/icons/SearchIcon/SearchIcon";
import { Input } from "@components/Input/Input";

function MainLayout() {
  const navigator = useNavigate();

  return (
    <div>
      <header
        className={
          "flex h-[88px] items-center justify-between px-20 shadow-[inset_0_-1px_0_0] shadow-talearnt-Line_01"
        }
      >
        <LogoIcon />
        <Input
          className={"h-10 rounded-full border-talearnt-Primary_01 pr-[55px]"}
          wrapperClassName={"w-[31.25rem]"}
        >
          <SearchIcon className={"absolute right-4 top-2 cursor-pointer"} />
        </Input>
        <div className={"flex h-[40px] gap-[16px]"}>
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
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
