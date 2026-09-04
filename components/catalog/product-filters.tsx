"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, Style } from "@/lib/types/catalog";
import { catalogApi } from "@/lib/api/catalog";
import { SORT_OPTIONS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [styles, setStyles] = useState<Style[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    searchParams.get("styles") ? searchParams.get("styles")!.split(",") : []
  );

  const currentSearch   = searchParams.get("search") ?? "";
  const currentCategory = searchParams.get("categorySlug") ?? searchParams.get("category") ?? "";
  const currentSort     = searchParams.get("sort") ?? "newest";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentInStock  = searchParams.get("inStock") === "true";

  useEffect(() => {
    catalogApi
      .getStyles()
      .then((d) => setStyles(d.styles ?? []))
      .catch(() => {});
  }, []);

  const activeFilterCount = [
    Boolean(currentSearch),
    Boolean(currentCategory),
    selectedStyles.length > 0,
    Boolean(currentMinPrice),
    Boolean(currentMaxPrice),
    currentInStock,
    Boolean(currentSort && currentSort !== "newest"),
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const toggleStyle = (slug: string) => {
    setSelectedStyles((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    const search   = String(form.get("search") ?? "");
    const category = String(form.get("category") ?? "");
    const sort     = String(form.get("sort") ?? "newest");
    const minPrice = String(form.get("minPrice") ?? "");
    const maxPrice = String(form.get("maxPrice") ?? "");
    const inStock  = form.get("inStock") === "on";

    if (search)   params.set("search", search);
    if (category) {
      if (category.includes("-") && category.length > 20) {
        params.set("category", category);
      } else {
        params.set("categorySlug", category);
      }
    }
    if (selectedStyles.length > 0) params.set("styles", selectedStyles.join(","));
    if (sort)     params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock)  params.set("inStock", "true");

    setMobileOpen(false);
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedStyles([]);
    setMobileOpen(false);
    router.push("/products");
  };

  return (
    <div className="w-full space-y-4">
      {/* Mobile Toggle Trigger */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-6 py-3.5 rounded-full bg-white border border-[#E2DCD2] shadow-xs text-xs font-semibold text-[#161716] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>⚙ Filter & Refine Catalog</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4A5E4C] text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span>{mobileOpen ? "▲ Hide" : "▼ Show"}</span>
        </button>
      </div>

      {/* Main Filter Form (always visible on lg, toggled on mobile) */}
      <form
        onSubmit={handleSubmit}
        className={cn(
          "bento-card p-6 sm:p-7 space-y-6 transition-all duration-300 border border-[#E2DCD2]",
          mobileOpen ? "block" : "hidden lg:block"
        )}
      >
        <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4">
          <div>
            <h3 className="font-display text-2xl text-[#161716]">Filter Catalog</h3>
            <p className="pill-accent-sage text-[10px] mt-1">Discovery & Attributes</p>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-[#B86A44] hover:underline cursor-pointer"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Search Input */}
        <div>
          <Input
            name="search"
            label="Search Keyword"
            placeholder="e.g. Sofa, solid oak, chair..."
            defaultValue={currentSearch}
            key={`search-${currentSearch}`}
          />
        </div>

        {/* Category Select */}
        <div>
          <Select
            name="category"
            label="Atmosphere Category"
            defaultValue={currentCategory}
            key={`category-${currentCategory}`}
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((c) => ({ value: c.slug || c.id, label: c.name })),
            ]}
          />
        </div>

        {/* Architectural Styles Filter */}
        {styles.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716]">
              Architectural Styles
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {styles.map((style) => {
                const isSelected = selectedStyles.includes(style.slug);
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => toggleStyle(style.slug)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer select-none",
                      isSelected
                        ? "bg-[#161716] text-white shadow-xs"
                        : "bg-[#FAFAF7] border border-[#E2DCD2] text-[#6B7068] hover:border-[#161716] hover:text-[#161716]"
                    )}
                  >
                    {style.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* In Stock Toggle */}
        <div className="flex items-center justify-between border-t border-b border-[#E2DCD2] py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#161716]">
            In-Stock Items Only
          </span>
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={currentInStock}
            key={`inStock-${currentInStock}`}
            className="h-4 w-4 rounded-md border-[#E2DCD2] text-[#4A5E4C] focus:ring-[#4A5E4C] cursor-pointer"
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716]">
            Price Range (EGP)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              name="minPrice"
              placeholder="Min EGP"
              type="number"
              min={0}
              defaultValue={currentMinPrice}
              key={`minPrice-${currentMinPrice}`}
            />
            <Input
              name="maxPrice"
              placeholder="Max EGP"
              type="number"
              min={0}
              defaultValue={currentMaxPrice}
              key={`maxPrice-${currentMaxPrice}`}
            />
          </div>
        </div>

        {/* Sort Select */}
        <div>
          <Select
            name="sort"
            label="Sort Order"
            defaultValue={currentSort}
            key={`sort-${currentSort}`}
            options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          />
        </div>

        {/* Submit / Reset Actions */}
        <div className="pt-2 flex flex-col gap-2">
          <Button type="submit" size="md" className="w-full">
            Apply Filters ↗
          </Button>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="md" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
