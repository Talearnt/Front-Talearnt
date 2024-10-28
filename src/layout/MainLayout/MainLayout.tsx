import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <header
        className={
          "flex h-[90px] gap-[127px] justify-center items-center shadow-[inset_0_-1px_0_0] shadow-talearnt-gray-200"
        }
      >
        <p>로고</p>
        <p>인풋</p>
        <div>
          <button>로그인</button>
          <button>회원가입</button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
