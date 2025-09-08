import { Navigate } from "react-router-dom";

import { useAuthStore } from "@store/user.store";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  console.log("🔍 PrivateRoute - isLoggedIn:", isLoggedIn);

  if (!isLoggedIn) {
    console.log("🚨 PrivateRoute - 로그인 안됨, sign-in으로 리다이렉트");
    return <Navigate to="/sign-in" replace />;
  }

  console.log("✅ PrivateRoute - 로그인됨, children 렌더링");
  return <>{children}</>;
}

export default PrivateRoute;
