import {
  AuthContextType,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/features/auth/types/auth";
import { createContext, useEffect, useState } from "react";
import { authService } from "@/features/auth/services/authService";
import { toast } from "sonner";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);

      setUser(response.user);
      setToken(response.token);

      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setToken(response.token);

      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    toast.success("Logout successful");
  };

  const updateUser = async (updatedUser: User) => {
    setIsLoading(true);

    try {
      const response = await authService.updateUser(updatedUser);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      localStorage.setItem(TOKEN_KEY, response.token);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
