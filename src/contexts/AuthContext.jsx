// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import fetchFn from "../utility/FetchFn";

const AuthContext = createContext(null);
const USER_SNAPSHOT_KEY = "user_snapshot";

export function AuthProvider({ children }) {
  // 1️⃣ Hydrate user instantly from localStorage (UI hint only)
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(USER_SNAPSHOT_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  // 2️⃣ Loading is now NON-BLOCKING
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // // 3️⃣ Background verification (does NOT block render)
  // useEffect(() => {
  //   let cancelled = false;

  //   const verifyUser = async () => {
  //     try {
  //       const data = await fetchFn("/user/me", "GET");

  //       if (cancelled) return;
  //       if (data?.user) {
  //         console.log(data);

  //         setUser(data.user);
  //         localStorage.setItem(USER_SNAPSHOT_KEY, JSON.stringify(data.user));
  //         setAuthError(null);
  //       } else {
  //         setUser(null);
  //         localStorage.removeItem(USER_SNAPSHOT_KEY);
  //       }
  //     } catch (err) {
  //       if (!cancelled) {
  //         console.warn("Auth verification failed:", err?.message || err);
  //         setUser(null);
  //         localStorage.removeItem(USER_SNAPSHOT_KEY);
  //         setAuthError(err?.message || "Auth check failed");
  //       }
  //     }
  //   };

  //   verifyUser();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  // 4️⃣ Called after OTP verify / login success
  const login = async (maybeUser = null) => {
    // Optimistic update if backend already returned user
    if (maybeUser) {
      setUser(maybeUser);
      localStorage.setItem(USER_SNAPSHOT_KEY, JSON.stringify(maybeUser));
      return;
    }

    // Otherwise refresh from server
    try {
      const data = await fetchFn("/user/me", "GET");

      if (data?.user) {
        setUser(data.user);
        localStorage.setItem(USER_SNAPSHOT_KEY, JSON.stringify(data.user));
      }
    } catch (err) {
      console.warn("login -> user/me failed", err);
      setUser(null);
      localStorage.removeItem(USER_SNAPSHOT_KEY);
    }
  };

  // 5️⃣ Logout clears both server + UI snapshot
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
        setUser,
        login,
        logout,
        loading,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
