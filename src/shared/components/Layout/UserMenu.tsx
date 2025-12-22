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

export const UserMenu = () => {
  const { user, logout, updateUser } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-4 border-2 border-red-500">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Please log in.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 border-2 border-red-500">
      <DropdownMenu>
        <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          {user.name}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Welcome, <span className="font-semibold">{user.name}</span>!
          </p>
          <Select
            value={user.locale || "en-us"}
            onValueChange={(locale) => updateUser({ ...user, locale })}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-us">🇺🇸 English (US)</SelectItem>
              <SelectItem value="pt-br">🇧🇷 Português (BR)</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
