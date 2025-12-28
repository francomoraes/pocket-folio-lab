import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLoginForm } from "@/features/auth/components/LoginForm/useLoginForm";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {t("navbar.appName")}
          </CardTitle>
          <CardDescription>
            {isRegisterMode
              ? t("auth.register.subtitle")
              : t("auth.login.subtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
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
              <Label htmlFor="password">{t("auth.login.password")}</Label>
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
                  {t("common.validation.minLength", { min: 6 })}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.status.loading")}
                </>
              ) : isRegisterMode ? (
                t("auth.register.submit")
              ) : (
                t("auth.login.submit")
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
                  {t("auth.register.hasAccount")}{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary underline-offset-4 hover:underline"
                    disabled={isLoading}
                  >
                    {t("auth.register.login")}
                  </button>
                </>
              ) : (
                <>
                  {t("auth.login.noAccount")}{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary underline-offset-4 hover:underline"
                    disabled={isLoading}
                  >
                    {t("auth.login.createAccount")}
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
