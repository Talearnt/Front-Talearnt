import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "@store/user.store";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { pathname, search } = useLocation();

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  if (!isLoggedIn) {
    return (
      <Navigate
        to={`/sign-in?redirect=${encodeURIComponent(pathname + search)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}

export default PrivateRoute;
