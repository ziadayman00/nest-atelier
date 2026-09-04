import type { User } from "./user";

export type DesignRequestStatus =
  | "pending"
  | "contacted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface DesignRequestImage {
  id: string;
  designRequestId: string;
  url: string;
}

export interface DesignRequest {
  id: string;
  userId?: string | null;
  fullName: string;
  phone: string;
  email: string;
  propertyType: string;
  roomCount: number;
  areaSquareMeters?: string | number | null;
  preferredStyle?: string | null;
  budget?: string | number | null;
  notes?: string | null;
  status: DesignRequestStatus;
  images?: DesignRequestImage[];
  user?: Pick<User, "id" | "fullName" | "email">;
  createdAt?: string;
  updatedAt?: string;
}

export interface DesignRequestListResponse {
  requests: DesignRequest[];
  pagination: import("./api").Pagination;
}
