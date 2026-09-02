export type OperationLogActorRole = "investor" | "manager" | "admin" | "system";

export type OperationLogAction =
  | "target_percentage_change"
  | "asset_class_created"
  | "asset_class_updated"
  | "asset_class_deleted"
  | "asset_type_created"
  | "asset_type_updated"
  | "asset_type_deleted"
  | "institution_created"
  | "institution_updated"
  | "institution_deleted"
  | "link_added"
  | "link_revoked"
  | "autonomy_granted"
  | "autonomy_revoked"
  | "risk_profile_changed"
  | "wealth_history_created"
  | "wealth_history_updated"
  | "wealth_history_deleted"
  | "asset_manual_edit";

export interface OperationLogEntry {
  id: number;
  actorEmail: string;
  actorRole: OperationLogActorRole;
  action: OperationLogAction;
  entityType: string | null;
  entityId: number | null;
  beforeValue: Record<string, unknown> | null;
  afterValue: Record<string, unknown> | null;
  createdAt: string;
}

export interface OperationLogListResponse {
  data: OperationLogEntry[];
  meta: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
