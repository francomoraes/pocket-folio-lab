import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

export const UserMenu = () => {
  const { user, logout, updateUser } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate("/login")}
          className="px-4 py-2 text-sm font-medium"
        >
          {t("auth.userMenu.login")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors">
          {user.name}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="flex flex-col gap-3 p-4 min-w-[200px]"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t("auth.userMenu.welcome")},{" "}
            <span className="font-semibold">{user.name}</span>!
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/profile")}
            className=""
          >
            {t("auth.userMenu.profile")}
          </Button>
          <Select
            value={i18n.language}
            onValueChange={(locale) => updateUser({ ...user, locale })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("auth.userMenu.selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">
                <p className="text-xs sm:text-sm text-muted-foreground flex gap-1 items-center mb-1">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/555/555526.png"
                    width="16"
                    alt="USD"
                    className="inline"
                  />
                  {t("auth.profile.localeOptions.enUs")}
                </p>
              </SelectItem>
              <SelectItem value="pt-BR">
                <p className="text-xs sm:text-sm text-muted-foreground flex gap-1 items-center mb-1">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3022/3022546.png"
                    width="16"
                    alt="BRL"
                    className="inline"
                  />
                  {t("auth.profile.localeOptions.ptBr")}
                </p>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="flex items-center gap-2 justify-start"
            aria-label={
              theme === "dark"
                ? t("auth.userMenu.theme.light")
                : t("auth.userMenu.theme.dark")
            }
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark"
              ? t("auth.userMenu.theme.light")
              : t("auth.userMenu.theme.dark")}
          </Button>
          <Button variant="destructive" onClick={logout}>
            {t("auth.userMenu.logout")}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
