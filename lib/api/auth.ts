import { api } from "./client";
import { getToken } from "../auth/token";
import type { AuthResponse, User } from "../types/user";

export const authApi = {
  register: (body: { fullName: string; email: string; password: string }) =>
    api<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    api<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: (token?: string | null) =>
    api<{ user: User }>("/auth/me", {}, token ?? getToken()),
};
