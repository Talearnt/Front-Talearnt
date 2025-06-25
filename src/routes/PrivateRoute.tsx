import { Navigate } from "react-router-dom";

import { useAuthStore } from "@store/user.store";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
