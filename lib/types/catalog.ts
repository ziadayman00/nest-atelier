export interface Dimensions {
  width?: number;
  height?: number;
  depth?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive?: boolean;
}

export interface Style {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  products?: Product[];
  isActive?: boolean;
  createdAt?: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  color?: string | null;
  sku: string;
  price: string | number;
  stockQuantity: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  material?: string | null;
  dimensions?: Dimensions | null;
  price: string | number;
  stockQuantity: number;
  isActive?: boolean;
  category?: Category;
  styles?: Style[];
  images?: ProductImage[];
  variants?: ProductVariant[];
  createdAt?: string;
  averageRating?: number | null;
  reviewCount?: number;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  categorySlug?: string;
  styles?: string; // comma-separated style slugs
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: import("./api").Pagination;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  moderationNote?: string | null;
  images?: string[];
  user?: {
    id: string;
    fullName: string;
  };
  reviewer?: {
    id: string;
    fullName: string;
  };
  product?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

export interface ReviewSummary {
  count: number;
  averageRating: number;
}

export interface ReviewListResponse {
  reviews: Review[];
  summary: ReviewSummary;
  pagination: import("./api").Pagination;
}

export type RecommendationType = "complete_the_look" | "similar" | "frequently_bought_together";
