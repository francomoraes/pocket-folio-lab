import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAuth } from "@/shared/hooks/useAuth";
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

export const UserMenu = () => {
  const { user, logout, updateUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
        <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
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
            value={user.locale || "en-US"}
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
          <Button variant="destructive" onClick={logout}>
            {t("auth.userMenu.logout")}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
