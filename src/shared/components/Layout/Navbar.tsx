import { UserMenu } from "@/shared/components/Layout";
import { TrendingUp } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          to="/"
        >
          <TrendingUp className="h-6 w-6 text-accent" />
          <h1 className="text-xl md:text-2xl font-bold">
            {t("navbar.appName")}
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          <NavLink
            to="/positions"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors ${
                isActive ? "text-accent" : ""
              }`
            }
          >
            {t("navbar.links.positions")}
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors ${
                isActive ? "text-accent" : ""
              }`
            }
          >
            {t("navbar.links.dashboard")}
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors ${
                isActive ? "text-accent" : ""
              }`
            }
          >
            <span className="hidden sm:inline">
              {t("navbar.links.settings")}
            </span>
          </NavLink>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
};
