import { Suspense } from "react";
import type { Metadata } from "next";
import { catalogApi } from "@/lib/api/catalog";
import { EmptyState } from "@/components/ui/container";
import { Pagination } from "@/components/ui/pagination";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ProductFilters } from "@/components/catalog/product-filters";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import type { ProductQuery } from "@/lib/types/catalog";

export const metadata: Metadata = {
  title: "Furniture Collection",
  description: "Browse bespoke modern furniture handcrafted in Cairo from solid oak, beech, and walnut.",
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    categorySlug?: string;
    styles?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  let productsData = {
    products: [] as Awaited<ReturnType<typeof catalogApi.getProducts>>["products"],
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  };
  let categories: Awaited<ReturnType<typeof catalogApi.getCategories>>["categories"] = [];

  try {
    const query: ProductQuery = {
      search: params.search,
      category: params.category,
      categorySlug: params.categorySlug,
      styles: params.styles,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      inStock: params.inStock === "true",
      sort: (["newest", "price_asc", "price_desc", "name_asc", "name_desc"].includes(params.sort ?? "")
        ? (params.sort as ProductQuery["sort"])
        : "newest"),
      page,
      limit: 20,
    };

    const [list, cats] = await Promise.all([
      catalogApi.getProducts(query),
      catalogApi.getCategories(),
    ]);
    productsData = list;
    categories = cats.categories;
  } catch {
    // offline / fallback state
  }

  const currentCategoryVal = params.categorySlug || params.category;
  const activeCategory = categories.find(
    (c) => c.slug === currentCategoryVal || c.id === currentCategoryVal
  );
  const hasActiveFilters = Boolean(
    params.search ||
      params.category ||
      params.categorySlug ||
      params.styles ||
      params.minPrice ||
      params.maxPrice ||
      params.inStock
  );

  return (
    <div className="w-full px-6 sm:px-10 lg:px-14 py-6 space-y-10">

      {/* ── Editorial Storefront Header ── */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E2DCD2]/80 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="pill-accent-sage text-xs font-mono">Cairo Atelier Collection</span>
              <span className="text-xs text-[#6B7068] font-mono">· Solid Hardwood Milled</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#161716] leading-[1.05]">
              {activeCategory ? activeCategory.name : "Furniture Atelier Collection"}
            </h1>
            <p className="text-[#6B7068] text-xs sm:text-sm font-light leading-relaxed">
              {activeCategory?.description ??
                "Every piece in our catalog is custom milled from solid oak, walnut, or beech. Designed with structural mortise-and-tenon joints to outlast seasonal trends."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Piece count pill */}
            <div className="rounded-full border border-[#E2DCD2] bg-white px-5 py-2.5 shadow-xs">
              <p className="text-xs font-semibold text-[#161716] font-mono">
                {productsData.pagination.total} {productsData.pagination.total === 1 ? "Piece" : "Pieces"} Total
              </p>
            </div>

            {hasActiveFilters && (
              <Link
                href="/products"
                className="text-xs font-semibold uppercase tracking-wider text-[#B86A44] hover:underline px-2"
              >
                Clear All Filters
              </Link>
            )}
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        {categories.length > 0 && (
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
            <Link
              href="/products"
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                !currentCategoryVal
                  ? "bg-[#161716] text-white shadow-xs"
                  : "bg-white border border-[#E2DCD2] text-[#6B7068] hover:border-[#161716] hover:text-[#161716]"
              }`}
            >
              All Atelier Pieces
            </Link>
            {categories.map((cat) => {
              const isSelected = currentCategoryVal === cat.slug || currentCategoryVal === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={`/products?categorySlug=${cat.slug || cat.id}`}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#161716] text-white shadow-xs"
                      : "bg-white border border-[#E2DCD2] text-[#6B7068] hover:border-[#161716] hover:text-[#161716]"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Main Catalog Grid & Filters Sidebar ── */}
      <div className="grid gap-8 lg:grid-cols-[300px_1fr] items-start">

        {/* Filters Sidebar */}
        <aside className="lg:sticky lg:top-24">
          <Suspense fallback={<Spinner className="h-6 w-6 text-[#4A5E4C]" />}>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        {/* Products Grid Main */}
        <main className="min-w-0">
          {productsData.products.length > 0 ? (
            <div className="space-y-10">
              <ProductGrid products={productsData.products} columns={3} />
              <div className="flex justify-center pt-6">
                <Pagination
                  page={productsData.pagination.page}
                  totalPages={productsData.pagination.totalPages}
                  basePath="/products"
                  query={{
                    search: params.search,
                    categorySlug: params.categorySlug,
                    category: params.category,
                    styles: params.styles,
                    minPrice: params.minPrice,
                    maxPrice: params.maxPrice,
                    inStock: params.inStock,
                    sort: params.sort,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] border border-[#E2DCD2] bg-white p-16 text-center space-y-4 shadow-xs">
              <EmptyState
                title="No Atelier Pieces Found"
                description="Try adjusting your search query, price parameters, or architectural style filters."
                action={
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-[#161716] px-6 py-2.5 text-xs font-semibold text-white uppercase tracking-wider hover:bg-[#4A5E4C] transition-all"
                  >
                    <span>Reset Catalog</span>
                    <span>↗</span>
                  </Link>
                }
              />
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
