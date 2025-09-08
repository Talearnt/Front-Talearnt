import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { useAuthStore } from "@store/user.store";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, logoutRedirect, setLogoutRedirect } = useAuthStore(
    useShallow(state => ({
      isLoggedIn: state.isLoggedIn,
      logoutRedirect: state.logoutRedirect,
      setLogoutRedirect: state.setLogoutRedirect,
    }))
  );

  useEffect(() => {
    if (!isLoggedIn && logoutRedirect) {
      return () => {
        setLogoutRedirect(null);
      };
    }
    return;
  }, [isLoggedIn, logoutRedirect, setLogoutRedirect]);

  if (!isLoggedIn) {
    if (logoutRedirect) {
      const { path, state } = logoutRedirect;

      return <Navigate to={path} state={state} replace />;
    }

    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
