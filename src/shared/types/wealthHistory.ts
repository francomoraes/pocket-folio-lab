export interface WealthHistory {
  id: number;
  userId: number;
  date: string; // ISO date string
  totalWealthCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWealthHistoryRequest {
  date: string; // ISO date string
  totalWealthCents: number;
}

export interface UpdateWealthHistoryRequest {
  date?: string;
  totalWealthCents?: number;
}
