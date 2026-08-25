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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useLoginForm } from "@/features/auth/components/LoginForm/useLoginForm";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Navigate } from "react-router-dom";

export const LoginForm = () => {
  const {
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
    redirectTo,
  } = useLoginForm();
  const { t } = useTranslation();

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card
        className={cn(
          "w-full max-w-md border-t-4 transition-colors",
          loginTab === "investor" ? "border-t-accent" : "border-t-warning",
        )}
      >
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

        <CardContent className="space-y-4">
          <Tabs
            value={loginTab}
            onValueChange={(v) => changeTab(v as "investor" | "manager")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="investor"
                disabled={isLoading}
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {t("auth.login.tabs.client")}
              </TabsTrigger>
              <TabsTrigger
                value="manager"
                disabled={isLoading}
                className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground"
              >
                {t("auth.login.tabs.manager")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="name">{t("auth.register.name")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("auth.login.placeholders.name")}
                  {...register("name")}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.login.placeholders.email")}
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
                placeholder={t("auth.login.placeholders.password")}
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

            <Button
              type="submit"
              className={cn(
                "w-full",
                loginTab === "investor"
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-warning text-warning-foreground hover:bg-warning/90",
              )}
              disabled={isLoading}
            >
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

            {canRegister && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {t("common.misc.or")}
                    </span>
                  </div>
                </div>

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
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
