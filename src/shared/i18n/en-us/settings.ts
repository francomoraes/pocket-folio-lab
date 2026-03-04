export default {
  title: "Settings",
  subtitle: "Manage your asset classes and types",
  tabs: {
    assetClasses: "Asset Classes",
    assetTypes: "Asset Types",
    institutions: "Institutions",
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
};
