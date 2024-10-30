import { Link, Outlet } from "react-router-dom";

import { LogoIcon } from "@components/icons/LogoIcon/LogoIcon";
import { SearchIcon } from "@components/icons/SearchIcon/SearchIcon";

function MainLayout() {
  return (
    <div>
      <header
        className={
          "flex h-[90px] gap-[127px] justify-center items-center shadow-[inset_0_-1px_0_0] shadow-talearnt-gray-200"
        }
      >
        <LogoIcon />
        <div className={"relative w-[500px] h-[40px]"}>
          <input
            className={
              "w-full border border-talearnt-primary rounded-full focus:outline-none py-[9px] pl-[15px] pr-[55px] text-sm leading-[22px] placeholder:text-gray-500"
            }
            placeholder={"관심있는 재능 키워드를 입력해 주세요."}
          />
          <SearchIcon className={"absolute top-2 right-4 cursor-pointer"} />
        </div>
        <div className={"flex gap-[16px] h-[40px]"}>
          <Link
            className={
              "flex justify-center items-center w-[100px] rounded-[12px] bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
            }
            to={"sign-in"}
          >
            로그인
          </Link>
          <Link
            className={
              "flex justify-center items-center w-[120px] rounded-[12px] bg-talearnt-primary text-white hover:bg-button-hover"
            }
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
