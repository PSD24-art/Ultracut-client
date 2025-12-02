// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import fetchFn from "../utility/FetchFn";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // important: start true
  const [authError, setAuthError] = useState(null);

  // On mount -> ask server who the user is (cookie will be sent automatically)
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      try {
        const data = await fetchFn("/user/me", "GET"); // fetchFn uses credentials: include
        if (!mounted) return;
        if (data?.user) {
          setUser(data.user);
          setAuthError(null);
        } else {
          setUser(null);
          setAuthError(data?.message || null);
        }
      } catch (err) {
        // network / 401 etc.
        console.warn("Auth init failed:", err?.message || err);
        if (mounted) {
          setUser(null);
          setAuthError(err?.message || "Auth check failed");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Called after successful verify OTP (cookie-based): refresh user by calling /api/user/me
  const login = async (maybeUser = null) => {
    if (maybeUser) return setUser(maybeUser);
    try {
      const data = await fetchFn("/user/me", "GET");
      if (data?.user) setUser(data.user);
    } catch (err) {
      console.warn("login->user/me failed", err);
      setUser(null);
    }
  };
  const logout = async () => {
    try {
      await fetchFn("/auth/logout", "GET");
    } catch (e) {
      console.warn("logout error", e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, loading, authError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
