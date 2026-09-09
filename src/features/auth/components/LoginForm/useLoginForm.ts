import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/shared/hooks/useAuth";
import { useAuthConfig } from "@/features/auth/hooks/useAuthConfig";
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "@/schemas/auth.schema";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useNavigate } from "react-router-dom";
import { resolveHomePathForRole } from "@/shared/utils/roles";

export const useLoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register: registerUser, isLoading, isAuthenticated, user } =
    useAuth();
  const { selfRegistrationEnabled } = useAuthConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(isRegisterMode ? registerSchema : loginSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (isRegisterMode) {
        const registeredUser = await registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        toast.success(t("auth.messages.registerSuccess"));
        navigate(resolveHomePathForRole(registeredUser.role));
      } else {
        const loggedInUser = await login({
          email: data.email,
          password: data.password,
        });
        toast.success(t("auth.messages.loginSuccess"));
        navigate(resolveHomePathForRole(loggedInUser.role));
      }
    } catch (error) {
      const fallbackKey = isRegisterMode
        ? "auth.messages.registerError"
        : "auth.messages.loginError";
      toast.error(resolveErrorMessage(error, fallbackKey));
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    reset();
  };

  const canRegister = selfRegistrationEnabled;

  const redirectTo = isAuthenticated ? resolveHomePathForRole(user?.role) : null;

  return {
    isRegisterMode,
    isLoading,
    canRegister,
    register,
    handleSubmit,
    errors,
    onSubmit,
    toggleMode,
    redirectTo,
  };
};
