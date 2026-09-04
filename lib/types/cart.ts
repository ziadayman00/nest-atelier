import type { Product, ProductVariant } from "./catalog";

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  product?: Product;
  variant?: ProductVariant | null;
}

export interface Cart {
  id: string;
  userId: string;
  items?: CartItem[];
}
