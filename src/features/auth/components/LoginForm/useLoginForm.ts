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

export const useLoginForm = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(isRegisterMode ? registerSchema : loginSchema),
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    try {
      if (isRegisterMode) {
        await registerUser({ email: data.email, password: data.password });
        toast.success("Cadastro realizado com sucesso!");
      } else {
        await login({ email: data.email, password: data.password });
        toast.success("Login realizado com sucesso!");
      }
      window.location.href = "/";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao autenticar";
      toast.error(message);
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
