import { api, buildQuery, publicFetch } from "./client";
import { getToken } from "../auth/token";
import type {
  Category,
  Style,
  Collection,
  Product,
  ProductListResponse,
  ProductQuery,
  ReviewListResponse,
  Review,
  RecommendationType,
} from "../types/catalog";

export const catalogApi = {
  getCategories: () =>
    publicFetch<{ categories: Category[] }>("/categories"),

  getStyles: () =>
    publicFetch<{ styles: Style[] }>("/styles"),

  getCollections: () =>
    publicFetch<{ collections: Collection[] }>("/collections"),

  getCollectionBySlug: (slug: string) =>
    publicFetch<{ collection: Collection }>(`/collections/${slug}`),

  getProducts: (query: ProductQuery = {}) =>
    publicFetch<ProductListResponse>(
      `/products${buildQuery(query as Record<string, string | number | boolean | undefined>)}`,
    ),

  getProduct: (slug: string) =>
    publicFetch<{ product: Product }>(`/products/${slug}`),

  getRecommendations: (slug: string, type: RecommendationType = "complete_the_look") =>
    publicFetch<{ products: Product[] }>(`/products/${slug}/recommendations${buildQuery({ type })}`),

  getReviews: (slug: string, query: { page?: number; limit?: number } = {}) =>
    publicFetch<ReviewListResponse>(`/products/${slug}/reviews${buildQuery(query)}`),

  createReview: (
    productId: string,
    data: { rating: number; title: string; body: string; images?: File[] },
  ) => {
    const { images, ...rest } = data;
    if (images && images.length > 0) {
      const formData = new FormData();
      formData.append("rating", String(rest.rating));
      formData.append("title", rest.title);
      formData.append("body", rest.body);
      images.forEach((file) => formData.append("images", file));
      return api<{ review: Review }>(`/products/${productId}/reviews`, { method: "POST", body: formData }, getToken());
    }
    return api<{ review: Review }>(
      `/products/${productId}/reviews`,
      { method: "POST", body: JSON.stringify(rest) },
      getToken(),
    );
  },

  createCategory: (body: { name: string; description?: string }) =>
    api<{ category: Category }>("/categories", { method: "POST", body: JSON.stringify(body) }, getToken()),

  updateCategory: (id: string, body: { name?: string; description?: string }) =>
    api<{ category: Category }>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(body) }, getToken()),

  deleteCategory: (id: string) =>
    api<void>(`/categories/${id}`, { method: "DELETE" }, getToken()),

  createProduct: (body: Record<string, unknown>) =>
    api<{ product: Product }>("/products", { method: "POST", body: JSON.stringify(body) }, getToken()),

  updateProduct: (id: string, body: Record<string, unknown>) =>
    api<{ product: Product }>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(body) }, getToken()),

  deleteProduct: (id: string) =>
    api<void>(`/products/${id}`, { method: "DELETE" }, getToken()),

  addVariant: (productId: string, body: Record<string, unknown>) =>
    api<{ variant: import("../types/catalog").ProductVariant }>(
      `/products/${productId}/variants`,
      { method: "POST", body: JSON.stringify(body) },
      getToken(),
    ),

  updateVariant: (productId: string, variantId: string, body: Record<string, unknown>) =>
    api<{ variant: import("../types/catalog").ProductVariant }>(
      `/products/${productId}/variants/${variantId}`,
      { method: "PATCH", body: JSON.stringify(body) },
      getToken(),
    ),

  deleteVariant: (productId: string, variantId: string) =>
    api<void>(`/products/${productId}/variants/${variantId}`, { method: "DELETE" }, getToken()),

  addImage: (
    productId: string,
    data: { url?: string; file?: File; altText?: string; sortOrder?: number },
  ) => {
    if (data.file) {
      const formData = new FormData();
      formData.append("file", data.file);
      if (data.altText) formData.append("altText", data.altText);
      if (data.sortOrder !== undefined) formData.append("sortOrder", String(data.sortOrder));
      return api<{ image: import("../types/catalog").ProductImage }>(
        `/products/${productId}/images`,
        { method: "POST", body: formData },
        getToken(),
      );
    }
    return api<{ image: import("../types/catalog").ProductImage }>(
      `/products/${productId}/images`,
      { method: "POST", body: JSON.stringify(data) },
      getToken(),
    );
  },
};
