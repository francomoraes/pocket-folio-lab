import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "@/schemas/auth.schema";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";

export const useLoginForm = () => {
  const { t } = useTranslation();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register: registerUser, isLoading } = useAuth();

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
        await registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        toast.success(t("auth.messages.registerSuccess"));
      } else {
        await login({ email: data.email, password: data.password });
        toast.success(t("auth.messages.loginSuccess"));
      }
      window.location.href = "/";
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

  return {
    isRegisterMode,
    isLoading,
    register,
    handleSubmit,
    errors,
    onSubmit,
    toggleMode,
  };
};
