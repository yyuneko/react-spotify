import cookie from "@http/cookie";
import React, { createContext, useContext, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from ".";

const AuthContext = createContext<{
  user: any;
  login: any;
  logout: any;
}>({
  user: undefined,
  login: undefined,
  logout: undefined,
});

export const AuthProvider = (props: any) => {
  const user = useCurrentUser();

  const login = () => {
    window.location.href = "http://localhost:8888/login";
  };

  const logout = () => {
    cookie.clearCookie();
    window.location.href = "/login";
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
export const ProtectedRoute = (props: any) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    // user is not authenticated
    return (
      <Navigate
        to="/login"
        state={{ from: encodeURIComponent(location.pathname) }}
      />
    );
  }
  return props.children;
};
