import { Navigate } from "react-router-dom";

import { useAuthStore } from "@store/user.store";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  // 로그인된 사용자면 메인페이지로 리다이렉트
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
