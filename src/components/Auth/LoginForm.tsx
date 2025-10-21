import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLoginForm } from "@/components/Auth/useLoginForm";

export const LoginForm = () => {
  const {
    isRegisterMode,
    isLoading,
    register,
    handleSubmit,
    errors,
    onSubmit,
    toggleMode,
  } = useLoginForm();

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Pocket Folio Lab</CardTitle>
          <CardDescription>
            {isRegisterMode ? "Criar uma nova conta" : "Entre com sua conta"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
              {isRegisterMode && (
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres com maiúscula, minúscula, número e símbolo
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : isRegisterMode ? (
                "Criar conta"
              ) : (
                "Entrar"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full" disabled>
              Entrar com Google (em breve)
            </Button>

            <div className="text-center text-sm">
              {isRegisterMode ? (
                <>
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary underline-offset-4 hover:underline"
                    disabled={isLoading}
                  >
                    Entrar
                  </button>
                </>
              ) : (
                <>
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary underline-offset-4 hover:underline"
                    disabled={isLoading}
                  >
                    Criar conta
                  </button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
