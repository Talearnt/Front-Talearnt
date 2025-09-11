import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { useAuthStore } from "@store/user.store";

function AuthLayout({ children }: { children: ReactNode }) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  // 로그인된 사용자면 메인페이지로 리다이렉트
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={classNames("flex flex-col gap-[56px]", "w-[632px]")}>
      {children}
    </div>
  );
}

export { AuthLayout };
