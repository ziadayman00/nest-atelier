"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/catalog";
import { formatPrice } from "@/lib/utils/format";
import { useWishlist } from "@/providers/wishlist-provider";
import { cn } from "@/lib/utils/cn";

export function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(product.id);

  const primaryImage   = product.images?.[0];
  const secondaryImage = product.images?.[1] ?? primaryImage;
  const price          = product.price;
  const isSoldOut      = product.stockQuantity <= 0;
  const isLowStock     = product.stockQuantity > 0 && product.stockQuantity <= 3;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col justify-between rounded-[26px] bg-white/70 backdrop-blur-xl border border-white/80 p-3.5 sm:p-4 shadow-[0_8px_24px_-6px_rgba(22,23,22,0.06),inset_0_1px_1.5px_0_rgba(255,255,255,0.95)] hover:shadow-[0_18px_40px_-8px_rgba(22,23,22,0.12),inset_0_1px_2px_0_rgba(255,255,255,1)] hover:bg-white/85 hover:border-white transition-all duration-500 relative"
    >
      {/* ── IMAGE WRAPPER ── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#EDE7DC]/40">
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {isSoldOut ? (
            <div className="rounded-full bg-[#161716] px-3 py-1 text-[10px] font-semibold text-white tracking-wider uppercase font-mono shadow-xs">
              Sold Out
            </div>
          ) : isLowStock ? (
            <div className="rounded-full bg-[#B86A44] px-3 py-1 text-[10px] font-semibold text-white tracking-wider uppercase font-mono shadow-xs">
              Only {product.stockQuantity} Left
            </div>
          ) : product.material ? (
            <div className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-medium text-[#161716] border border-black/5 shadow-xs">
              {product.material}
            </div>
          ) : null}
        </div>

        {/* Wishlist Heart Micro-Interaction */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={cn(
            "absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer shadow-xs",
            isSaved
              ? "bg-[#B86A44] text-white scale-105"
              : "bg-white/85 text-[#161716] hover:bg-white hover:scale-110 border border-black/5"
          )}
          title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <svg
            className={cn("h-4 w-4 transition-transform", isSaved && "scale-110")}
            fill={isSaved ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Dual Image Crossfade */}
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText ?? product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {secondaryImage && secondaryImage.url !== primaryImage.url && (
              <Image
                src={secondaryImage.url}
                alt={secondaryImage.altText ?? product.name}
                fill
                className="object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100 absolute inset-0"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#EDE7DC]/30 to-[#E2DCD2]/40">
            <span className="font-display text-4xl text-[#161716]/10 select-none">NEST</span>
          </div>
        )}
      </div>

      {/* ── CARD METADATA FOOTER ── */}
      <div className="pt-4 px-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            {product.category && (
              <p className="text-[10px] font-mono font-medium uppercase tracking-widest text-[#4A5E4C]">
                {product.category.name}
              </p>
            )}
            <h3 className="font-display text-lg sm:text-xl font-normal text-[#161716] group-hover:text-[#4A5E4C] transition-colors leading-snug">
              {product.name}
            </h3>
          </div>
          <span className="arrow-badge-btn shrink-0 text-xs h-7 w-7 bg-[#EDE7DC] text-[#161716] group-hover:bg-[#161716] group-hover:text-white transition-all">
            ↗
          </span>
        </div>

        {/* ── RATING ROW ── */}
        {product.averageRating != null && (
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex items-center gap-[2px]" aria-label={`${product.averageRating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = product.averageRating! >= star;
                const half = !filled && product.averageRating! >= star - 0.5;
                return (
                  <svg key={star} viewBox="0 0 12 12" className="h-3 w-3 shrink-0" fill="none">
                    {half ? (
                      <>
                        <defs>
                          <linearGradient id={`hg-${product.id}-${star}`} x1="0" x2="1" y1="0" y2="0">
                            <stop offset="50%" stopColor="#B86A44" />
                            <stop offset="50%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                        <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8.08 3.22 9.55l.53-3.09L1.5 4.27l3.11-.45L6 1z" fill={`url(#hg-${product.id}-${star})`} stroke="#B86A44" strokeWidth="0.8" />
                      </>
                    ) : (
                      <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8.08 3.22 9.55l.53-3.09L1.5 4.27l3.11-.45L6 1z" fill={filled ? "#B86A44" : "none"} stroke={filled ? "#B86A44" : "#C8BFB4"} strokeWidth="0.8" />
                    )}
                  </svg>
                );
              })}
            </div>
            <span className="text-[10px] font-mono text-[#6B7068]">
              {product.averageRating.toFixed(1)}
            </span>
            {!!product.reviewCount && (
              <span className="text-[10px] font-mono text-[#6B7068]">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[#E2DCD2]/60">
          <span className="text-sm font-semibold text-[#161716]">
            {formatPrice(price)}
          </span>
          <span className="text-[11px] font-mono text-[#6B7068] uppercase tracking-wider">
            EGP
          </span>
        </div>
      </div>
    </Link>
  );
}
