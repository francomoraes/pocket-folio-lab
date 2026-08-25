import {
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from "@/features/auth/types/auth";
import { createContext, useEffect, useRef, useState } from "react";
import { authService } from "@/features/auth/services/authService";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { tokenStore } from "@/lib/tokenStore";
import { api, tryRefreshToken } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import { queryClient } from "@/shared/lib/queryClient";

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
  const tokenRef = useRef<string | null>(null);

  function applyToken(newToken: string | null) {
    tokenRef.current = newToken;
    tokenStore.set(newToken);
    setToken(newToken);
  }

  function performLocalLogout() {
    applyToken(null);
    setUser(null);
    clearPersistedUser();
    queryClient.clear();
  }

  // Register logout handler so the axios interceptor can force logout on refresh failure
  useEffect(() => {
    tokenStore.setLogoutHandler(() => {
      performLocalLogout();
    });
  }, []);

  // On mount: try to restore session via the refresh token cookie (HttpOnly)
  useEffect(() => {
    tryRefreshToken().then((result) => {
      // Se um login/register manual já rodou enquanto esse refresh (disparado
      // no mount) ainda estava em voo, ignora o resultado dele por completo —
      // tanto sucesso quanto falha. Sem isso, um /auth/refresh lento que
      // resolve DEPOIS de um login rápido pode sobrescrever a sessão recém
      // criada (sucesso com dados de outra sessão) ou até derrubá-la (falha
      // limpando o token que o login acabou de setar) — a causa do bug
      // intermitente de "login funciona mas não redireciona".
      if (tokenRef.current) {
        setIsInitializing(false);
        return;
      }

      if (result) {
        applyToken(result.token);
        // Refresh response carries fresh user data (including current role).
        // Overwrite localStorage so role changes by admin are reflected immediately.
        const freshUser = result.user as User;
        setUser(freshUser);
        persistUser(freshUser);
      } else {
        performLocalLogout();
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
      return response.user;
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
      return response.user;
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
    performLocalLogout();
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
      toast.error(resolveErrorMessage(error, "auth.messages.updateError"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isManager =
    user?.role === "manager" || user?.role === "admin";
  const isAdmin = user?.role === "admin";
  const isInvestor = user?.role === "investor";
  const canOperateOwnPortfolio =
    user?.role === "investor" && user?.selfServiceEnabled !== false;

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
    isManager,
    isAdmin,
    isInvestor,
    canOperateOwnPortfolio,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
