export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
