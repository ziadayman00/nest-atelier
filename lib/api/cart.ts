import { api } from "./client";
import { getToken } from "../auth/token";
import type { Cart } from "../types/cart";

export const cartApi = {
  get: () => api<{ cart: Cart }>("/cart", {}, getToken()),

  addItem: (body: { productId: string; variantId?: string; quantity: number }) =>
    api<{ cart: Cart }>("/cart/items", { method: "POST", body: JSON.stringify(body) }, getToken()),

  updateItem: (itemId: string, quantity: number) =>
    api<{ cart: Cart }>(
      `/cart/items/${itemId}`,
      { method: "PATCH", body: JSON.stringify({ quantity }) },
      getToken(),
    ),

  removeItem: (itemId: string) =>
    api<void>(`/cart/items/${itemId}`, { method: "DELETE" }, getToken()),
};
