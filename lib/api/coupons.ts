import { api, buildQuery } from "./client";
import { getToken } from "../auth/token";
import type { Coupon, CouponPayload, CouponListResponse } from "../types/coupon";

export const couponApi = {
  list: (query: { page?: number; limit?: number } = {}) =>
    api<CouponListResponse>(`/admin/coupons${buildQuery(query)}`, {}, getToken()),

  create: (data: CouponPayload) =>
    api<{ coupon: Coupon }>("/admin/coupons", { method: "POST", body: JSON.stringify(data) }, getToken()),

  update: (id: string, data: Partial<CouponPayload>) =>
    api<{ coupon: Coupon }>(`/admin/coupons/${id}`, { method: "PATCH", body: JSON.stringify(data) }, getToken()),

  delete: (id: string) =>
    api<void>(`/admin/coupons/${id}`, { method: "DELETE" }, getToken()),
};
