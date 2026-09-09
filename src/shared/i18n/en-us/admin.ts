export default {
  dashboard: {
    title: "Platform dashboard",
    subtitle: "Consolidated view of all managers and clients",
    empty: "No data available yet",
    metrics: {
      managersCount: "Managers",
    },
    tabs: {
      ranking: "Manager ranking",
      investors: "All investors",
    },
    ranking: {
      title: "Manager ranking",
      empty: "No manager with active clients",
      columns: {
        manager: "Manager",
        clients: "Clients",
        wealth: "Wealth",
        initialWealth: "Initial wealth",
        absoluteVariation: "Absolute variation",
        percentageVariation: "Percentage variation",
      },
    },
  },
  users: {
    title: "Users",
    subtitle: "Manage user roles and manager limits",
    search: "Search by name or email",
    newUser: "New user",
    table: {
      name: "Name",
      email: "Email",
      role: "Role",
      clientLimit: "Client limit",
      actions: "Actions",
      editLimit: "Edit limit",
      noLimit: "Default (10)",
    },
    roles: {
      investor: "Investor",
      manager: "Manager",
      admin: "Admin",
    },
    roleUpdated: "Role updated successfully",
    roleUpdateError: "Error updating role",
    limitUpdated: "Limit updated successfully",
    limitUpdateError: "Error updating limit",
    confirmRoleChange: {
      title: "Change role",
      downgradeWarning: "This manager has active links that will be revoked when removing the manager role.",
      confirm: "Confirm",
      cancel: "Cancel",
    },
    editLimit: {
      title: "Edit client limit",
      description: "Sets the maximum number of clients this manager can have active simultaneously.",
      label: "Client limit",
      save: "Save",
      cancel: "Cancel",
    },
  },
};
