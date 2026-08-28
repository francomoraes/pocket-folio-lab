export default {
  title: "Settings",
  subtitle: "Manage your asset classes and types",
  tabs: {
    assetClasses: "Asset Classes",
    assetTypes: "Asset Types",
    institutions: "Institutions",
    cryptoAccounts: "Mercado Bitcoin Integration",
  },
  autonomy: {
    readOnlyNotice:
      "Your manager currently has control of your portfolio. Ask them to re-enable your autonomy if you want to edit it yourself.",
  },
  assetClasses: {
    title: "Asset Classes",
    create: "New Asset Class",
    edit: "Edit Asset Class",
    delete: "Delete Asset Class",
    table: {
      name: "Name",
      description: "Description",
      classPercentage: "Class (%)",
      classPercentageTooltip:
        "Total percentage of asset types in this class. Change in the Asset Types table.",
      actions: "Actions",
    },
    summary: {
      totalAllocated: "Total Allocated",
    },
  },
  assetTypes: {
    title: "Asset Types",
    create: "New Asset Type",
    edit: "Edit Asset Type",
    delete: "Delete Asset Type",
    table: {
      name: "Name",
      targetPercentage: "Target Percentage (%)",
      class: "Class",
      actions: "Actions",
    },
    filters: {
      title: "Filters",
      open: "Open filters",
      name: "Filter by name",
      namePlaceholder: "Type the name...",
      class: "Filter by class",
      allClasses: "All classes",
      clear: "Clear filters",
    },
    summary: {
      totalAllocated: "Total Allocated",
    },
  },
  institutions: {
    title: "Institutions",
    create: "New Institution",
    edit: "Edit Institution",
    delete: "Delete Institution",
    table: {
      name: "Name",
      actions: "Actions",
    },
  },
  cryptoAccounts: {
    empty: "No crypto accounts connected.",
    connect: "Connect account",
    defaultLabel: "Mercado Bitcoin",
    table: {
      label: "Label",
      status: "Status",
      lastSyncedAt: "Last synced",
      actions: "Actions",
    },
    status: {
      active: "Active",
      error: "Error",
      disabled: "Disabled",
    },
    dialog: {
      title: "Connect Mercado Bitcoin account",
      helpAriaLabel: "How to generate the API key on Mercado Bitcoin",
      helpTitle: "How to generate your API key on Mercado Bitcoin",
      helpSteps: [
        "Log in to Mercado Bitcoin on the web browser.",
        "Click on the user menu (top right corner).",
        'Scroll down to the integrations section and click "API Keys".',
        'Click "New key".',
        'Select "Read-only".',
        "Give the key a name.",
        "Enter the security code (check the app).",
        'Click "Continue".',
        "Copy the one-time-shown code (API secret) and save it somewhere.",
        'Click "Finish".',
        "Copy the ID generated on the API key management screen.",
        "Fill in this form with the copied data.",
      ],
    },
    fields: {
      label: "Label (optional)",
      institution: "Institution",
      assetType: "Asset type",
      apiKey: "ID",
      apiKeyHint:
        "The ID shown in the API keys list, on the Mercado Bitcoin panel.",
      apiSecret: "API secret",
      apiSecretHint: "Only shown once, at the moment the key is created.",
    },
    validation: {
      institutionRequired: "Institution is required.",
      assetTypeRequired: "Asset type is required.",
      apiKeyRequired: "The ID is required.",
      apiSecretRequired: "The API secret is required.",
    },
  },
};
