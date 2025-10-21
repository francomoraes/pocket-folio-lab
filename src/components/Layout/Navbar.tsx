import { UserMenu } from "@/components/Layout";
import { TrendingUp } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-accent" />
            <h1 className="text-2xl font-semibold">InvestTracker</h1>
          </div>
        </div>
        <UserMenu />
      </div>
    </header>
  );
};
