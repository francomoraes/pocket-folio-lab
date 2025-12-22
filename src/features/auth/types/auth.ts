export interface User {
  id: number;
  email: string;
  name: string;
  profilePictureUrl?: string;
  locale?: string;
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
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
