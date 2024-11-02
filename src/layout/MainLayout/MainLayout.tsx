import { Link, Outlet } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { LogoIcon } from "@components/icons/LogoIcon/LogoIcon";
import { SearchIcon } from "@components/icons/SearchIcon/SearchIcon";
import { Input } from "@components/Input/Input";

function MainLayout() {
  const linkStyle =
    "rounded-lg flex w-[6.875rem] items-center justify-center text-[1.125rem] font-medium";

  return (
    <div>
      <header
        className={
          "flex h-[88px] items-center justify-between px-20 shadow-[inset_0_-1px_0_0] shadow-talearnt-Line_01"
        }
      >
        <LogoIcon />
        <Input
          className={
            "h-10 w-[31.25rem] rounded-full border-talearnt-Primary_01 pr-[55px]"
          }
        >
          <SearchIcon className={"absolute right-4 top-2 cursor-pointer"} />
        </Input>
        <div className={"flex h-[40px] gap-[16px]"}>
          <Link
            className={classNames(
              linkStyle,
              "border border-talearnt-Icon_02 text-talearnt-Text_02"
            )}
            to={"sign-in"}
          >
            로그인
          </Link>
          <Link
            className={classNames(
              linkStyle,
              "bg-talearnt-Primary_01 text-talearnt-BG_Background hover:bg-talearnt-PrimaryBG_02"
            )}
            to={"sign-up"}
          >
            회원가입
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
