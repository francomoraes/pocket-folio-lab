import { UserMenu } from "@/shared/components/Layout";
import { TrendingUp, Menu } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/shared/hooks/useAuth";
import { usePendingLinks } from "@/features/manager/hooks/usePendingLinks";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";

export const Navbar = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isInitializing, isManager, isInvestor } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { pendingCount } = usePendingLinks();

  type NavItem = { to: string; label: string; badge?: number };

  const navItems: NavItem[] = [
    { to: "/dashboard", label: t("navbar.links.dashboard") },
    { to: "/positions", label: t("navbar.links.positions") },
    { to: "/settings", label: t("navbar.links.settings") },
    ...(isInvestor ? [{ to: "/my-managers", label: t("navbar.links.managers") }] : []),
    ...(isManager
      ? [
          {
            to: "/manager/clients",
            label: t("navbar.links.clients"),
            badge: pendingCount > 0 ? pendingCount : undefined,
          },
          { to: "/manager/dashboard", label: t("navbar.links.managerDashboard") },
        ]
      : []),
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        <Link
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          to="/"
        >
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
          <h1 className="text-base sm:text-xl md:text-2xl font-bold">
            {t("navbar.appName")}
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          {/* Desktop Navigation */}
          {isAuthenticated && !isInitializing && (
            <>
              <div className="hidden md:flex items-center gap-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors ${
                        isActive ? "text-accent" : ""
                      }`
                    }
                  >
                    {item.label}
                    {item.badge != null && (
                      <span className="ml-1 rounded-full bg-destructive px-1.5 py-0.5 text-xs text-white leading-none">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      {t("navbar.appName")}
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-8">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-accent/10 hover:text-accent transition-colors ${
                            isActive ? "bg-accent/10 text-accent" : ""
                          }`
                        }
                      >
                        {item.label}
                        {item.badge != null && (
                          <span className="ml-1 rounded-full bg-destructive px-1.5 py-0.5 text-xs text-white leading-none">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    ))}
                    <div className="border-t pt-4 mt-4">
                      <UserMenu />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          )}

          {/* Desktop User Menu */}
          {isAuthenticated && !isInitializing && (
            <div className="hidden md:block">
              <UserMenu />
            </div>
          )}

          {/* Show UserMenu if not authenticated */}
          {!isAuthenticated && !isInitializing && <UserMenu />}
        </nav>
      </div>
    </header>
  );
};
