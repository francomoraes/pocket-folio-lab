import { Asset } from "@/types/asset";

export interface Institution {
  id: number;
  name: string;
}

export interface CreateInstitution {
  name: string;
}

export interface UpdateInstitution {
  id: number;
  name: string;
}
