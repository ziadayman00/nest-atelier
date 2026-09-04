"use client";

import { useState } from "react";
import type { ProductVariant } from "@/lib/types/catalog";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";

// Known wood/finish colors helper
const COLOR_MAP: Record<string, string> = {
  oak: "#D8C4A9",
  walnut: "#5C4638",
  beech: "#E0CFB3",
  ash: "#2B2A29",
  natural: "#D8C4A9",
  smoked: "#5C4638",
  white: "#F5F3EF",
  black: "#1F201F",
  linen: "#E4DCD3",
  sand: "#D8CCBC",
};

function getSwatchColor(name?: string | null, color?: string | null): string {
  const text = `${name ?? ""} ${color ?? ""}`.toLowerCase();
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (text.includes(key)) return hex;
  }
  return "#D8C4A9"; // fallback natural oak
}

export function VariantPicker({
  variants,
  basePrice,
  onSelect,
}: {
  variants: ProductVariant[];
  basePrice: number | string;
  onSelect: (variant: ProductVariant | null) => void;
}) {
  const [selected, setSelected] = useState<ProductVariant | null>(
    variants.length === 1 ? variants[0] : null,
  );

  if (!variants.length) return null;

  const handleSelect = (variant: ProductVariant) => {
    setSelected(variant);
    onSelect(variant);
  };

  const active = selected ?? variants[0];
  const price  = selected?.price ?? active?.price ?? basePrice;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
          Material & Timber Finish
        </span>
        {selected && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7068]">
            SKU: {selected.sku}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isSelected = selected?.id === variant.id;
          const isVariantSoldOut = variant.stockQuantity <= 0;
          const swatchColor = getSwatchColor(variant.name, variant.color);

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => handleSelect(variant)}
              className={cn(
                "group relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all cursor-pointer select-none",
                isSelected
                  ? "bg-[#161716] text-white shadow-xs scale-[1.02]"
                  : "bg-white border border-[#E2DCD2] text-[#6B7068] hover:border-[#161716] hover:text-[#161716]",
                isVariantSoldOut && "opacity-50",
              )}
            >
              <span
                className="h-2.5 w-2.5 rounded-full border border-white/40 shadow-inner"
                style={{ backgroundColor: swatchColor }}
              />
              <span>{variant.name || variant.color}</span>
              {isVariantSoldOut && (
                <span className="text-[10px] text-red-400 font-normal">(Sold Out)</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#E2DCD2]">
        <div className="space-y-0.5">
          <span className="text-2xl font-semibold text-[#161716] font-display">
            {formatPrice(price)}
          </span>
          <span className="text-[11px] text-[#6B7068] ml-1 font-mono">EGP</span>
        </div>

        {selected && (
          <div>
            {selected.stockQuantity <= 0 ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-semibold text-red-800">
                Out of Stock
              </span>
            ) : selected.stockQuantity <= 3 ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold text-amber-800">
                Only {selected.stockQuantity} Left
              </span>
            ) : (
              <span className="pill-accent-sage text-xs">In Stock ({selected.stockQuantity})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
