"use client";

import { useWishlist } from "@/providers/wishlist-provider";
import { ProductGrid } from "@/components/catalog/product-grid";
import { EmptyState } from "@/components/ui/container";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccountWishlistPage() {
  const { items, loading } = useWishlist();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8 text-[#4A5E4C]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="bento-card p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Saved Selection</span>
          <h1 className="font-display text-2xl sm:text-4xl text-[#161716] mt-1">
            Personal Wishlist
          </h1>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Curated pieces saved for your residence or future space planning.
          </p>
        </div>
        <div className="rounded-full bg-[#EDE7DC] px-4 py-2 text-xs font-semibold text-[#161716] self-start sm:self-auto font-mono">
          {items.length} {items.length === 1 ? "Saved Piece" : "Saved Pieces"}
        </div>
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <ProductGrid products={items} columns={2} />
      ) : (
        <div className="bento-card p-4 sm:p-10 text-center space-y-4">
          <EmptyState
            title="Your Wishlist is Empty"
            description="Explore our architectural furniture collection and click the heart icon on any piece to save it."
            action={
              <Link href="/products">
                <Button size="lg" className="cursor-pointer">Explore Atelier Storefront ↗</Button>
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
