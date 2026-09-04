"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { clearToken, getToken, setToken } from "@/lib/auth/token";
import type { User } from "@/lib/types/user";
import { ApiError } from "@/lib/api/client";

// Sync a session cookie so middleware can check auth without reading localStorage
function setSessionCookie() {
  document.cookie = "nest_session=1; path=/; max-age=86400; SameSite=Lax";
}
function clearSessionCookie() {
  document.cookie = "nest_session=; path=/; max-age=0";
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const data = await authApi.me(token);
      setUser(data.user);
      setSessionCookie();
    } catch {
      clearToken();
      clearSessionCookie();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setToken(data.accessToken);
    setSessionCookie();
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    await authApi.register({ fullName, email, password });
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    clearToken();
    clearSessionCookie();
    setUser(null);
    router.push("/");
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
