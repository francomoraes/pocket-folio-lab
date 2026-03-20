import { z } from "zod";

// Validador de senha customizado com mensagens específicas
const passwordSchema = z
  .string()
  .min(6, "Senha deve ter no mínimo 6 caracteres")
  .max(100, "Senha deve ter no máximo 100 caracteres")
  .refine((val) => /[a-z]/.test(val), {
    message: "Senha deve conter pelo menos uma letra minúscula",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Senha deve conter pelo menos uma letra maiúscula",
  })
  .refine((val) => /\d/.test(val), {
    message: "Senha deve conter pelo menos um número",
  })
  .refine((val) => /[@$!%*?&]/.test(val), {
    message: "Senha deve conter pelo menos um símbolo (@$!%*?&)",
  });

// Schema para login (validação simples)
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// Schema para registro (validação completa)
export const registerSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: passwordSchema,
});

// Tipos inferidos
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
