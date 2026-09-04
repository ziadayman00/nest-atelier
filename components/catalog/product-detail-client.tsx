"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product, ProductVariant } from "@/lib/types/catalog";
import { cartApi } from "@/lib/api/cart";
import { useAuth } from "@/providers/auth-provider";
import { useWishlist } from "@/providers/wishlist-provider";
import { useToast } from "@/providers/toast-provider";
import { VariantPicker } from "@/components/catalog/variant-picker";
import { ProductReviews } from "@/components/catalog/product-reviews";
import { ProductRecommendations } from "@/components/catalog/product-recommendations";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";

export function ProductDetailClient({ product }: { product: Product }) {
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.length === 1 ? product.variants[0] : null,
  );
  const [quantity, setQuantity]   = useState(1);
  const [loading,  setLoading]    = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomImg, setZoomImg]     = useState<string | null>(null);

  const isSaved     = isInWishlist(product.id);
  const images      = product.images ?? [];
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const stock       = selectedVariant?.stockQuantity ?? product.stockQuantity;
  const price       = selectedVariant?.price ?? product.price;

  const addToCart = async () => {
    if (!user) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }
    if (hasVariants && !selectedVariant) {
      toastError("Please select a wood finish or variant first");
      return;
    }
    setLoading(true);
    try {
      await cartApi.addItem({ productId: product.id, variantId: selectedVariant?.id, quantity });
      toastSuccess(`${product.name} added to your bag`);
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Could not add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-16 sm:space-y-20">

        {/* ── TOP EDITORIAL HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E2DCD2]/80 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              {product.category && (
                <span className="pill-accent-sage text-xs font-mono">{product.category.name}</span>
              )}
              <span className="text-xs text-[#6B7068] font-mono uppercase tracking-wider">
                Atelier Piece · Ref #{product.id.slice(-6).toUpperCase()}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#161716] leading-[1.05]">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border transition-all cursor-pointer shadow-xs",
                isSaved
                  ? "bg-[#B86A44] border-[#B86A44] text-white"
                  : "border-[#E2DCD2] bg-white text-[#161716] hover:border-[#161716] hover:scale-105"
              )}
              title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
              aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            >
              <svg
                className={cn("h-5 w-5 transition-transform", isSaved && "scale-110")}
                fill={isSaved ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>

            <div className="flex flex-col items-start md:items-end gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl sm:text-5xl text-[#161716] font-normal">
                  {formatPrice(price)}
                </span>
                <span className="text-xs text-[#6B7068] font-mono">EGP</span>
              </div>
              <span className="pill-accent-dark text-[11px]">
                Free Cairo White-Glove Hand Delivery
              </span>
            </div>
          </div>
        </div>

        {/* ── MAIN PRODUCT GRID (IMAGE GALLERY + PURCHASE STACK) ── */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">

          {/* ── LEFT: High-Res Image Gallery (7 Cols) ── */}
          <div className="lg:col-span-7 space-y-4">
            <div
              onClick={() => images[activeIdx] && setZoomImg(images[activeIdx].url)}
              className="cursor-pointer group relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-[#EDE7DC]/50 border border-[#E2DCD2] shadow-xs"
            >
              {images[activeIdx] ? (
                <Image
                  src={images[activeIdx].url}
                  alt={images[activeIdx].altText ?? product.name}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#EDE7DC] to-[#F4F1EA]">
                  <span className="font-display text-8xl text-[#161716]/10 select-none">NEST</span>
                </div>
              )}

              {/* Hover Badge */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="pill-accent-dark text-xs backdrop-blur-md">Click to enlarge ↗</span>
              </div>

              {/* Image Counter Badge */}
              {images.length > 1 && (
                <div className="absolute top-6 right-6">
                  <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#161716] border border-black/5 shadow-xs">
                    {String(activeIdx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pt-2">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={cn(
                      "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all cursor-pointer",
                      activeIdx === i
                        ? "border-[#161716] scale-105 shadow-md"
                        : "border-[#E2DCD2] opacity-60 hover:opacity-100 hover:border-[#6B7068]"
                    )}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Specs & Action Purchase Stack (5 Cols) ── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">

            {/* Narrative & Craftsmanship */}
            <div className="glass-card p-7 sm:p-8 space-y-3">
              <span className="pill-accent-sage text-xs font-mono">Atelier Narrative</span>
              <p className="text-xs sm:text-sm text-[#6B7068] leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Variant Finish Switcher */}
            {hasVariants && product.variants && (
              <div className="glass-card p-7 sm:p-8">
                <VariantPicker
                  variants={product.variants}
                  basePrice={product.price}
                  onSelect={setSelectedVariant}
                />
              </div>
            )}

            {/* Purchase Control Card */}
            <div className="glass-card p-7 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
                  Cairo Stock Status
                </span>
                {stock <= 0 ? (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-semibold text-red-800 uppercase font-mono">
                    Out of Stock
                  </span>
                ) : stock <= 3 ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold text-amber-800 uppercase font-mono">
                    Only {stock} Left
                  </span>
                ) : (
                  <span className="pill-accent-sage text-xs">In Stock ({stock})</span>
                )}
              </div>

              {/* Quantity Stepper Control */}
              <div className="flex items-center justify-between border-t border-[#E2DCD2]/60 pt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
                  Quantity
                </span>
                <div className="flex items-center rounded-full border border-black/5 bg-black/[0.03] overflow-hidden p-1">
                  <button
                    type="button"
                    disabled={quantity <= 1 || stock <= 0}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#161716] hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    –
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    type="button"
                    disabled={quantity >= stock || stock <= 0}
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#161716] hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action CTA */}
              <Button
                onClick={addToCart}
                loading={loading}
                disabled={stock <= 0}
                size="lg"
                className="w-full py-4 text-sm font-semibold cursor-pointer"
              >
                {stock <= 0
                  ? "Currently Out of Stock"
                  : `Add to Bag · ${formatPrice(Number(price) * quantity)} ↗`}
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#6B7068] font-light border-t border-[#E2DCD2]/60 pt-4 font-mono">
                <span>✦ Cash on Delivery</span>
                <span>✦ White-Glove Hand Delivery</span>
              </div>
            </div>

            {/* Architectural Specifications Card */}
            {(product.material || product.dimensions) && (
              <div className="glass-card-sand p-7 sm:p-8 space-y-4">
                <span className="pill-accent-sage text-xs font-mono">Architectural Specifications</span>
                <div className="space-y-3 text-xs pt-1">
                  {product.material && (
                    <div className="flex justify-between border-b border-[#E2DCD2] pb-2">
                      <span className="text-[#6B7068]">Primary Hardwood</span>
                      <span className="font-semibold text-[#161716]">{product.material}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between border-b border-[#E2DCD2] pb-2">
                      <span className="text-[#6B7068]">Dimensions (W × H × D)</span>
                      <span className="font-semibold text-[#161716]">
                        {product.dimensions.width ?? "—"} × {product.dimensions.height ?? "—"} × {product.dimensions.depth ?? "—"} cm
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#6B7068]">Workshop Joinery</span>
                    <span className="font-semibold text-[#161716]">Mortise & Tenon · Zero Veneers</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── VERIFIED REVIEWS SECTION ── */}
        <section className="pt-6">
          <ProductReviews productId={product.id} productSlug={product.slug} />
        </section>

        {/* ── CURATED RECOMMENDATIONS SECTION ── */}
        <section className="pt-6">
          <ProductRecommendations productSlug={product.slug} />
        </section>

      </div>

      {/* Lightbox Modal */}
      {zoomImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center glass-backdrop p-4"
          onClick={() => setZoomImg(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomImg(null)}
              className="absolute right-6 top-6 z-10 pill-accent-dark cursor-pointer"
            >
              Close ×
            </button>
            <div className="relative h-[85vh] w-[85vw]">
              <Image src={zoomImg} alt="" fill className="object-contain" sizes="90vw" unoptimized />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
