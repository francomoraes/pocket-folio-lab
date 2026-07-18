import { UserRole } from "@/shared/types/roles";

export type LinkStatus = "pending" | "active" | "rejected" | "revoked";

export type RevokeReason =
  | "manual_by_investor"
  | "manual_by_manager"
  | "role_removed"
  | "superseded";

export interface ManagerClientLink {
  id: number;
  investorId: number;
  managerId: number;
  status: LinkStatus;
  managerName?: string;
  managerEmail?: string;
  investorName?: string;
  investorEmail?: string;
  activatedAt: string | null;
  rejectedAt: string | null;
  revokedAt: string | null;
  revokeReason: RevokeReason | null;
  createdAt: string;
}

// counterpartRole reflete a posição da contraparte NO VÍNCULO (investorId/managerId),
// não o UserRole dela — um admin pode aparecer como "manager" aqui.
export interface PendingApproval {
  id: number;
  investorId: number;
  managerId: number;
  requestedByUserId: number;
  counterpartId: number;
  counterpartName: string;
  counterpartEmail: string;
  counterpartRole: "investor" | "manager";
  createdAt: string;
}

export interface SentRequest {
  id: number;
  investorId: number;
  investorName: string;
  investorEmail: string;
  createdAt: string;
}

export interface AvailableInvestor {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface ManagerHistoryCycle {
  managerId: number;
  managerName: string;
  status: "active" | "closed";
  cycleStartAt: string;
  cycleEndAt: string | null;
  initialWealthCents: number;
  currentWealthCents: number | null;
  finalWealthCents: number | null;
}

export interface ManagerClient {
  investorId: number;
  investorName: string;
  investorEmail: string;
  activatedAt: string;
  currentWealthCents: number;
  linkId: number;
}

export interface ManagerDashboard {
  activeClientsCount: number;
  totalWealthUnderManagementCents: number;
  totalInitialWealthCents: number;
  absoluteVariationCents: number;
  percentageVariation: number;
  topInvestors: {
    investorId: number;
    name: string;
    currentWealthCents: number;
  }[];
}

export interface AvailableManager {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  managerClientLimit: number | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  itemsPerPage: number;
}

export interface ClientAssetTypeTarget {
  assetTypeId: number;
  assetTypeName: string;
  assetClassId: number;
  assetClassName: string;
  targetPercentage: number;
}
