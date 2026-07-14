import React, { createContext, useContext, useEffect, useState } from "react";
import fetchFn from "../utility/FetchFn";

const AuthContext = createContext();

const USER_SNAPSHOT_KEY = "user_snapshot";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(USER_SNAPSHOT_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Fetch latest authenticated user
  const refreshUser = async () => {
    try {
      const data = await fetchFn("/user/me", "GET");
      console.log("Data from refrsh user: ", data);
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem(USER_SNAPSHOT_KEY, JSON.stringify(data.user));
        setAuthError(null);
      } else {
        setUser(null);
        localStorage.removeItem(USER_SNAPSHOT_KEY);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem(USER_SNAPSHOT_KEY);
      setAuthError(err?.message || "Authentication failed");
    }
  };

  useEffect(() => {
    (async () => {
      await refreshUser();
      setLoading(false);
    })();
  }, []);

  const login = async () => {
    await refreshUser();
  };

  const logout = async () => {
    try {
      await fetchFn("/auth/logout", "GET");
      localStorage.removeItem("token");
      localStorage.removeItem(USER_SNAPSHOT_KEY);
    } catch (e) {
      console.warn(e);
    }

    setUser(null);
    localStorage.removeItem(USER_SNAPSHOT_KEY);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_SNAPSHOT_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
