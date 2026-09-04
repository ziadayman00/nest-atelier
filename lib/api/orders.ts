import { api, buildQuery } from "./client";
import { getToken } from "../auth/token";
import type { Order, OrderListResponse, ShippingAddress, CheckoutPayload } from "../types/order";

export const orderApi = {
  checkout: (payload: CheckoutPayload | { shippingAddress: ShippingAddress; couponCode?: string }) =>
    api<{ order: Order }>(
      "/orders/checkout",
      { method: "POST", body: JSON.stringify(payload) },
      getToken(),
    ),

  listMine: (query: { page?: number; limit?: number } = {}) =>
    api<OrderListResponse>(`/orders/me${buildQuery(query)}`, {}, getToken()),

  getMine: (id: string) =>
    api<{ order: Order }>(`/orders/me/${id}`, {}, getToken()),

  listAll: (query: { page?: number; limit?: number; status?: string } = {}) =>
    api<OrderListResponse>(`/orders${buildQuery(query)}`, {}, getToken()),

  updateStatus: (id: string, status: string) =>
    api<{ order: Order }>(
      `/orders/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      getToken(),
    ),
};
