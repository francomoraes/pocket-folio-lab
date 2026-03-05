export default {
  title: "Configurações",
  subtitle: "Gerencie suas classes e tipos de ativos",
  tabs: {
    assetClasses: "Classes de Ativos",
    assetTypes: "Tipos de Ativos",
    institutions: "Instituições",
  },
  assetClasses: {
    title: "Classes de Ativos",
    create: "Nova Classe de Ativo",
    edit: "Editar Classe de Ativo",
    delete: "Excluir Classe de Ativo",
    table: {
      name: "Nome",
      description: "Descrição",
      classPercentage: "Class (%)",
      classPercentageTooltip:
        "Porcentagem total dos tipos de ativos dessa classe. Altere na tabela de Tipos de Ativos.",
      actions: "Ações",
    },
    summary: {
      totalAllocated: "Total Alocado",
    },
  },
  assetTypes: {
    title: "Tipos de Ativos",
    create: "Novo Tipo de Ativo",
    edit: "Editar Tipo de Ativo",
    delete: "Excluir Tipo de Ativo",
    table: {
      name: "Nome",
      targetPercentage: "Percentual Meta (%)",
      class: "Classe",
      actions: "Ações",
    },
    filters: {
      title: "Filtros",
      open: "Abrir filtros",
      name: "Filtrar por nome",
      namePlaceholder: "Digite o nome...",
      class: "Filtrar por classe",
      allClasses: "Todas as classes",
      clear: "Limpar filtros",
    },
    summary: {
      totalAllocated: "Total Alocado",
    },
  },
  institutions: {
    title: "Instituições",
    create: "Nova Instituição",
    edit: "Editar Instituição",
    delete: "Excluir Instituição",
    table: {
      name: "Nome",
      actions: "Ações",
    },
  },
};
