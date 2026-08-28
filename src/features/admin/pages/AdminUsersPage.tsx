import { useTranslation } from "react-i18next";
import { UsersTable } from "@/features/admin/components/UsersTable";

export const AdminUsersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 p-3">
      <div>
        <h1 className="text-3xl font-bold">{t("admin.users.title")}</h1>
        <p className="text-muted-foreground">{t("admin.users.subtitle")}</p>
      </div>

      <UsersTable />
    </div>
  );
};
