import { api, buildQuery } from "./client";
import { getToken } from "../auth/token";
import type { User } from "../types/user";
import type { Review, Collection } from "../types/catalog";
import type { AnalyticsOverview } from "../types/analytics";

export const adminApi = {
  listCustomers: (query: { page?: number; limit?: number } = {}) =>
    api<{ customers: User[]; pagination: import("../types/api").Pagination }>(
      `/admin/customers${buildQuery(query)}`,
      {},
      getToken(),
    ),

  getCustomer: (id: string) =>
    api<{ customer: User & { orders?: unknown[]; designRequests?: unknown[] } }>(
      `/admin/customers/${id}`,
      {},
      getToken(),
    ),

  // Reviews Moderation
  getReviews: (query: { status?: "pending" | "approved" | "rejected"; page?: number; limit?: number } = {}) =>
    api<{ reviews: Review[]; pagination: import("../types/api").Pagination }>(
      `/admin/reviews${buildQuery(query)}`,
      {},
      getToken(),
    ),

  updateReviewStatus: (id: string, status: "approved" | "rejected", moderationNote?: string) =>
    api<{ review: Review }>(
      `/admin/reviews/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status, moderationNote }) },
      getToken(),
    ),

  // Analytics Overview
  getAnalyticsOverview: (query: { from?: string; to?: string } = {}) =>
    api<{ analytics: AnalyticsOverview }>(
      `/admin/analytics/overview${buildQuery(query)}`,
      {},
      getToken(),
    ),

  // Collections CRUD (Admin)
  createCollection: (data: { name: string; description?: string; imageUrl?: string }) =>
    api<{ collection: Collection }>("/admin/collections", { method: "POST", body: JSON.stringify(data) }, getToken()),

  updateCollection: (id: string, data: Partial<{ name: string; description: string; imageUrl: string; isActive: boolean }>) =>
    api<{ collection: Collection }>(`/admin/collections/${id}`, { method: "PATCH", body: JSON.stringify(data) }, getToken()),

  deleteCollection: (id: string) =>
    api<void>(`/admin/collections/${id}`, { method: "DELETE" }, getToken()),
};
