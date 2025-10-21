import { useAuth } from "@/hooks/useAuth";

export const UserMenu = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Welcome, <span className="font-semibold">{user.email}</span>!
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Please log in.
        </span>
      )}
    </div>
  );
};
