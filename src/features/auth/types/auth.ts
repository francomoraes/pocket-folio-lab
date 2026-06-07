import { UserRole } from "@/shared/types/roles";

export { UserRole };

export interface User {
  id: number;
  email: string;
  name: string;
  profilePictureUrl?: string;
  locale?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  id: number;
  locale?: string;
  email?: string;
  name?: string;
  profilePictureUrl?: string | null;
  currentPassword?: string;
  newPassword?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: UpdateUserRequest) => Promise<void>;
  isLoading: boolean;
  isInitializing: boolean;
  isAuthenticated: boolean;
  isManager: boolean;
  isAdmin: boolean;
  isInvestor: boolean;
}
