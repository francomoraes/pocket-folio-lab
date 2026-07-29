export default {
  title: "Configurações",
  subtitle: "Gerencie suas classes e tipos de ativos",
  tabs: {
    assetClasses: "Classes de Ativos",
    assetTypes: "Tipos de Ativos",
    institutions: "Instituições",
    cryptoAccounts: "Integração Mercado Bitcoin",
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
  cryptoAccounts: {
    empty: "Nenhuma conta cripto conectada.",
    connect: "Conectar conta",
    defaultLabel: "Mercado Bitcoin",
    table: {
      label: "Rótulo",
      status: "Status",
      lastSyncedAt: "Última sincronização",
      actions: "Ações",
    },
    status: {
      active: "Ativo",
      error: "Erro",
      disabled: "Desativado",
    },
    dialog: {
      title: "Conectar conta Mercado Bitcoin",
      helpAriaLabel: "Como gerar a chave de API na Mercado Bitcoin",
      helpTitle: "Como gerar sua chave de API na Mercado Bitcoin",
      helpSteps: [
        "Faça login na Mercado Bitcoin pelo navegador web.",
        "Clique no usuário (canto superior direito).",
        'Role até a seção de integrações e clique em "Chaves de API".',
        'Clique em "Nova chave".',
        'Selecione "Somente leitura".',
        "Dê um nome para a chave.",
        "Digite o código de segurança (veja no app).",
        'Clique em "Continuar".',
        "Copie o código de visualização única (Segredo da API) e salve em algum lugar.",
        'Clique em "Finalizar".',
        "Copie o ID gerado na tela de gerenciamento de chaves de API.",
        "Preencha este formulário com os dados copiados.",
      ],
    },
    fields: {
      label: "Rótulo (opcional)",
      institution: "Instituição",
      assetType: "Tipo de ativo",
      apiKey: "ID",
      apiKeyHint:
        "ID mostrado na lista de chaves da API, no painel da Mercado Bitcoin.",
      apiSecret: "Segredo da API",
      apiSecretHint:
        "Só aparece uma vez, no momento em que a chave é criada.",
    },
    validation: {
      institutionRequired: "A instituição é obrigatória.",
      assetTypeRequired: "O tipo de ativo é obrigatório.",
      apiKeyRequired: "O ID é obrigatório.",
      apiSecretRequired: "O segredo da API é obrigatório.",
    },
  },
};
