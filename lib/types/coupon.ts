import type { Pagination } from "./api";

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minimumOrderAmount?: number | null;
  maximumDiscountAmount?: number | null;
  usageLimit?: number | null;
  perUserLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CouponPayload {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  isActive?: boolean;
}

export interface CouponListResponse {
  coupons: Coupon[];
  pagination: Pagination;
}
