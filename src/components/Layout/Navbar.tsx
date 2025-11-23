import { UserMenu } from "@/components/Layout";
import { TrendingUp, Settings, Home } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          to="/"
        >
          <TrendingUp className="h-6 w-6 text-accent" />
          <h1 className="text-xl md:text-2xl font-bold">InvestTracker</h1>
        </Link>

        <nav className="flex items-center gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors ${
                isActive ? "text-accent" : ""
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Início</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors ${
                isActive ? "text-accent" : ""
              }`
            }
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Configurações</span>
          </NavLink>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
};
