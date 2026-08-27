import { UserRole } from "@/shared/types/roles";
import { RiskProfile } from "@/shared/types/riskProfile";

export type { RiskProfile };

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

export interface AvailableInvestor {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  currentManagers: { id: number; name: string; email: string }[];
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
  riskProfile: RiskProfile | null;
  adherenceIndexPp: number | null;
  monthlyVariationPct: number | null;
}

export type ClientSortBy =
  | "name"
  | "activatedAt"
  | "wealth"
  | "adherenceIndex"
  | "monthlyVariation";

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

export interface ManagerClientsResponse {
  data: ManagerClient[];
  meta: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ClientAssetTypeTarget {
  assetTypeId: number;
  assetTypeName: string;
  assetClassId: number;
  assetClassName: string;
  targetPercentage: number;
}

export interface ManagerRankingRow {
  managerId: number;
  managerName: string;
  managerEmail: string;
  activeClientsCount: number;
  totalWealthCents: number;
}

export interface AdminDashboard {
  managersCount: number;
  totalActiveClientsCount: number;
  totalWealthUnderManagementCents: number;
  managerRanking: ManagerRankingRow[];
}
