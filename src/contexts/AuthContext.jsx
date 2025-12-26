import React, { createContext, useContext, useEffect, useState } from "react";
import fetchFn from "../utility/FetchFn";

const AuthContext = createContext(null);
const USER_SNAPSHOT_KEY = "user_snapshot";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // 🔑 HYDRATE USER ON APP LOAD (ONCE)
  useEffect(() => {
    let cancelled = false;

    const hydrateUser = async () => {
      try {
        // 1️⃣ UI hint from localStorage (instant)
        const cached = localStorage.getItem(USER_SNAPSHOT_KEY);
        if (cached && !cancelled) {
          setUser(JSON.parse(cached));
        }

        // 2️⃣ Verify with backend
        const data = await fetchFn("/user/me", "GET");

        if (cancelled) return;

        if (data?.user) {
          setUser(data.user);
          localStorage.setItem(USER_SNAPSHOT_KEY, JSON.stringify(data.user));
          setAuthError(null);
        } else {
          setUser(null);
          localStorage.removeItem(USER_SNAPSHOT_KEY);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("Auth hydration failed:", err);
          setUser(null);
          localStorage.removeItem(USER_SNAPSHOT_KEY);
          setAuthError(err?.message || "Auth check failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    hydrateUser();

    return () => {
      cancelled = true;
    };
  }, []);

  // 🔑 CALLED AFTER OTP / LOGIN SUCCESS
  const login = async (userFromServer = null) => {
    try {
      if (userFromServer) {
        setUser(userFromServer);
        localStorage.setItem(USER_SNAPSHOT_KEY, JSON.stringify(userFromServer));
        return;
      }

      const data = await fetchFn("/user/me", "GET");
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem(USER_SNAPSHOT_KEY, JSON.stringify(data.user));
      }
    } catch (err) {
      console.warn("login failed", err);
      setUser(null);
      localStorage.removeItem(USER_SNAPSHOT_KEY);
    }
  };

  // 🔑 LOGOUT
  const logout = async () => {
    try {
      await fetchFn("/auth/logout", "GET");
    } catch (e) {
      console.warn("logout error", e);
    } finally {
      setUser(null);
      localStorage.removeItem(USER_SNAPSHOT_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
