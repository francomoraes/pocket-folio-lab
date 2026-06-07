export default {
  users: {
    title: "Users",
    subtitle: "Manage user roles and manager limits",
    search: "Search by name or email",
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
