"use client";

import { useEffect, useState } from "react";
import { catalogApi } from "@/lib/api/catalog";
import type { Product, RecommendationType } from "@/lib/types/catalog";
import { ProductGrid } from "@/components/catalog/product-grid";
import { cn } from "@/lib/utils/cn";

export function ProductRecommendations({ productSlug }: { productSlug: string }) {
  const [activeType, setActiveType] = useState<RecommendationType>("complete_the_look");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    catalogApi
      .getRecommendations(productSlug, activeType)
      .then((data) => {
        if (isMounted) setProducts(data.products ?? []);
      })
      .catch(() => {
        if (isMounted) setProducts([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [productSlug, activeType]);

  const tabs: { type: RecommendationType; label: string }[] = [
    { type: "complete_the_look", label: "Complete The Look" },
    { type: "frequently_bought_together", label: "Frequently Paired" },
    { type: "similar", label: "Similar Atelier Pieces" },
  ];

  if (!loading && products.length === 0 && activeType !== "complete_the_look") {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2DCD2]/80 pb-4">
        <div>
          <span className="pill-accent-sage text-xs font-mono">Architectural Pairing</span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#161716] mt-2">
            Curated Recommendations
          </h2>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.type}
              type="button"
              onClick={() => setActiveType(tab.type)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer",
                activeType === tab.type
                  ? "bg-[#161716] text-white shadow-xs"
                  : "bg-white border border-[#E2DCD2] text-[#6B7068] hover:border-[#161716] hover:text-[#161716]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <ProductGrid products={products} columns={4} />
      ) : (
        <div className="py-8 text-center text-xs text-[#6B7068]">
          Curating pairings for this piece...
        </div>
      )}
    </div>
  );
}
