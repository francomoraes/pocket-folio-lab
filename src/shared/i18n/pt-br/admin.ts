export default {
  users: {
    title: "Usuários",
    subtitle: "Gerencie roles e limites dos usuários do sistema",
    search: "Buscar por nome ou e-mail",
    table: {
      name: "Nome",
      email: "E-mail",
      role: "Role",
      clientLimit: "Limite de clientes",
      actions: "Ações",
      editLimit: "Editar limite",
      noLimit: "Padrão (10)",
    },
    roles: {
      investor: "Investor",
      manager: "Gestor",
      admin: "Admin",
    },
    roleUpdated: "Role atualizada com sucesso",
    roleUpdateError: "Erro ao atualizar role",
    limitUpdated: "Limite atualizado com sucesso",
    limitUpdateError: "Erro ao atualizar limite",
    confirmRoleChange: {
      title: "Alterar role",
      downgradeWarning: "Este gestor tem vínculos ativos que serão revogados ao remover a role de gestor.",
      confirm: "Confirmar",
      cancel: "Cancelar",
    },
    editLimit: {
      title: "Editar limite de clientes",
      description: "Define o número máximo de clientes que este gestor pode ter ativos simultaneamente.",
      label: "Limite de clientes",
      save: "Salvar",
      cancel: "Cancelar",
    },
  },
};
