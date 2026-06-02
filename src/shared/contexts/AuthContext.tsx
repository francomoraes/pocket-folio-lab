import {
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from "@/features/auth/types/auth";
import { createContext, useEffect, useState } from "react";
import { authService } from "@/features/auth/services/authService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { tokenStore } from "@/lib/tokenStore";
import { api, tryRefreshToken } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// User info (non-sensitive) kept in localStorage for fast rendering across page loads
const USER_KEY = "auth_user";

function persistUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearPersistedUser() {
  localStorage.removeItem(USER_KEY);
}

function loadPersistedUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(loadPersistedUser);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const { i18n } = useTranslation();

  function applyToken(newToken: string | null) {
    tokenStore.set(newToken);
    setToken(newToken);
  }

  // Register logout handler so the axios interceptor can force logout on refresh failure
  useEffect(() => {
    tokenStore.setLogoutHandler(() => {
      applyToken(null);
      setUser(null);
      clearPersistedUser();
    });
  }, []);

  // On mount: try to restore session via the refresh token cookie (HttpOnly)
  useEffect(() => {
    tryRefreshToken().then((newToken) => {
      if (newToken) {
        applyToken(newToken);
      } else {
        applyToken(null);
        setUser(null);
        clearPersistedUser();
      }
      setIsInitializing(false);
    });
  }, []);

  useEffect(() => {
    if (user?.locale) {
      i18n.changeLanguage(user.locale);
    }
  }, [user?.locale]);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      applyToken(response.token);
      setUser(response.user);
      persistUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      applyToken(response.token);
      setUser(response.user);
      persistUser(response.user);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post(API_ENDPOINTS.auth.logout);
    } catch {
      // Proceed with local logout even if the server call fails
    }
    applyToken(null);
    setUser(null);
    clearPersistedUser();
    toast.success("Logout successful");
  };

  const updateUser = async (updatedUser: UpdateUserRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.updateUser(updatedUser);
      applyToken(response.token);
      setUser(response.user);
      persistUser(response.user);
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
    isInitializing,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
