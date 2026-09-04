import { api, ApiError } from "./client";
import { getToken } from "../auth/token";
import type { Product } from "../types/catalog";

export interface RawWishlistItem {
  id: string;
  productId?: string;
  userId?: string;
  product?: Product;
  [key: string]: unknown;
}

export const wishlistApi = {
  get: () =>
    api<{ items: (Product | RawWishlistItem)[] }>("/wishlist", {}, getToken()),

  add: async (productId: string) => {
    try {
      return await api<{ item: unknown }>(
        `/wishlist/products/${productId}`,
        { method: "POST" },
        getToken(),
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        // Duplicate save (HTTP 409) — keep saved state as specified in guide
        return { duplicate: true };
      }
      throw err;
    }
  },

  remove: (productId: string) =>
    api<void>(
      `/wishlist/products/${productId}`,
      { method: "DELETE" },
      getToken(),
    ),
};
