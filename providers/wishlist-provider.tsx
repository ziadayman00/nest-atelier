"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { wishlistApi } from "@/lib/api/wishlist";
import type { Product } from "@/lib/types/catalog";

interface WishlistContextType {
  items: Product[];
  wishlistIds: Set<string>;
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  wishlistIds: new Set(),
  loading: false,
  isInWishlist: () => false,
  toggleWishlist: async () => {},
  removeFromWishlist: async () => {},
  refreshWishlist: async () => {},
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      setWishlistIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const data = await wishlistApi.get();
      const rawItems = data.items ?? [];

      // Normalize items: extract the actual Product object whether it's top-level or nested under .product
      const normalized: Product[] = rawItems
        .map((entry: any) => {
          if (!entry) return null;

          // If entry has a nested product object with details
          if (entry.product && typeof entry.product === "object" && entry.product.id) {
            return {
              ...entry.product,
              id: String(entry.product.id),
              name: entry.product.name ?? entry.name,
              slug: entry.product.slug ?? entry.slug,
              price: entry.product.price ?? entry.price,
              images: entry.product.images ?? entry.images ?? [],
            };
          }

          // If entry is already the product itself
          if (entry.id && entry.name) {
            return {
              ...entry,
              id: String(entry.productId || entry.id),
              images: entry.images ?? [],
            };
          }

          return null;
        })
        .filter((p): p is Product => Boolean(p && p.id));

      setItems(normalized);
      // Store the real product IDs in wishlistIds so isInWishlist(product.id) matches instantly
      setWishlistIds(new Set(normalized.map((p) => String(p.id))));
    } catch {
      // Fail silently if wishlist unavailable or guest
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (productId: string) => wishlistIds.has(String(productId));

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      toastError("Please sign in to save pieces to your wishlist");
      return;
    }

    const prodId = String(product.id);
    const exists = wishlistIds.has(prodId);

    if (exists) {
      // Optimistic remove
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(prodId);
        return next;
      });
      setItems((prev) => prev.filter((p) => String(p.id) !== prodId));

      try {
        await wishlistApi.remove(prodId);
        success(`Removed ${product.name} from your saved wishlist`);
      } catch (err) {
        // Rollback
        setWishlistIds((prev) => new Set(prev).add(prodId));
        setItems((prev) => [...prev, product]);
        toastError("Failed to update wishlist");
      }
    } else {
      // Optimistic add
      setWishlistIds((prev) => new Set(prev).add(prodId));
      setItems((prev) => [product, ...prev.filter((p) => String(p.id) !== prodId)]);

      try {
        const res = await wishlistApi.add(prodId);
        if (res && "duplicate" in res) {
          // Already saved, maintain saved state as instructed
          return;
        }
        success(`Saved ${product.name} to your wishlist`);
      } catch {
        // Rollback
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(prodId);
          return next;
        });
        setItems((prev) => prev.filter((p) => String(p.id) !== prodId));
        toastError("Failed to save piece to wishlist");
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const target = items.find((p) => String(p.id) === String(productId));
    if (!target) return;
    await toggleWishlist(target);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistIds,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
