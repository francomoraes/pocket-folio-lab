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

export type LoginTab = "investor" | "manager";

export const useLoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginTab, setLoginTab] = useState<LoginTab>("investor");
  const { login, register: registerUser, isLoading } = useAuth();
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
        await registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        toast.success(t("auth.messages.registerSuccess"));
      } else {
        await login({
          email: data.email,
          password: data.password,
          loginAs: loginTab,
        });
        toast.success(t("auth.messages.loginSuccess"));
      }
      navigate("/dashboard");
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

  const changeTab = (tab: LoginTab) => {
    setLoginTab(tab);
    setIsRegisterMode(false);
    reset();
  };

  // Gestor nunca teve autocadastro — registro só existe na aba cliente, e só com a flag ligada.
  const canRegister = loginTab === "investor" && selfRegistrationEnabled;

  return {
    isRegisterMode,
    isLoading,
    loginTab,
    changeTab,
    canRegister,
    register,
    handleSubmit,
    errors,
    onSubmit,
    toggleMode,
  };
};
