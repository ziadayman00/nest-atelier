"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cartApi } from "@/lib/api/cart";
import { useToast } from "@/providers/toast-provider";
import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils/format";
import type { Cart, CartItem } from "@/lib/types/cart";
import { ApiError } from "@/lib/api/client";

function lineTotal(item: CartItem): number {
  const price = Number(item.variant?.price ?? item.product?.price ?? 0);
  return price * item.quantity;
}

function CartContent() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const { error: toastError, success: toastSuccess } = useToast();

  const loadCart = async () => {
    try {
      const data = await cartApi.get();
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (itemId: string, quantity: number) => {
    setUpdating(itemId);
    try {
      const data = await cartApi.updateItem(itemId, quantity);
      setCart(data.cart);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Update failed";
      setError(msg);
      toastError(msg);
    } finally {
      setUpdating(null);
    }
  };

  const remove = async (itemId: string) => {
    setUpdating(itemId);
    try {
      await cartApi.removeItem(itemId);
      toastSuccess("Piece removed from bag");
      await loadCart();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Remove failed";
      setError(msg);
      toastError(msg);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-28">
        <Spinner className="h-8 w-8 text-[#4A5E4C]" />
      </div>
    );
  }

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);

  const hasOutOfStockItems = items.some(
    (item) => (item.variant?.stockQuantity ?? item.product?.stockQuantity ?? 0) < item.quantity,
  );

  const freeDeliveryThreshold = 5000;
  const progress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remaining = freeDeliveryThreshold - subtotal;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-4 sm:py-6 space-y-8 sm:space-y-10">

      {/* Progress Step Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2 text-xs font-mono">
        <div className="flex items-center gap-2.5 font-semibold text-[#161716]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#161716] text-white text-[11px]">1</span>
          <span>Shopping Bag</span>
        </div>
        <span className="text-[#D1CCC4] hidden sm:inline">——</span>
        <div className="flex items-center gap-2.5 text-[#6B7068]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EDE7DC] text-[#6B7068] text-[11px]">2</span>
          <span>Delivery Details</span>
        </div>
        <span className="text-[#D1CCC4] hidden sm:inline">——</span>
        <div className="flex items-center gap-2.5 text-[#6B7068]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EDE7DC] text-[#6B7068] text-[11px]">3</span>
          <span>Order Confirmation</span>
        </div>
      </div>

      {/* Editorial Title & Free Delivery Meter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2DCD2]/80 pb-6">
          <div>
            <span className="pill-accent-sage text-xs font-mono">Atelier Order</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#161716] mt-2">
              Your Bag Selection
            </h1>
          </div>
          <p className="text-xs font-mono uppercase tracking-wider text-[#6B7068]">
            {items.length} {items.length === 1 ? "Piece" : "Pieces"} in Bag
          </p>
        </div>

        {/* Free Delivery Meter */}
        {subtotal > 0 && (
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-[#161716]">
              <span>
                {subtotal >= freeDeliveryThreshold
                  ? "✨ You qualify for Free Cairo White-Glove Hand Delivery!"
                  : `Add ${formatPrice(remaining)} more for Free Cairo White-Glove Hand Delivery`}
              </span>
              <span className="font-semibold text-[#4A5E4C] font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#EDE7DC]">
              <div
                className="h-full bg-[#4A5E4C] transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      {items.length === 0 ? (
        <div className="glass-card p-16 text-center space-y-4">
          <EmptyState
            title="Your bag is currently empty"
            description="Explore our curated architectural furniture catalog and select pieces for your residence."
            action={
              <Link href="/products">
                <Button size="lg" className="cursor-pointer">
                  Explore Atelier Pieces ↗
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] items-start">
          {/* Cart Items List */}
          <div className="space-y-4">
            {hasOutOfStockItems && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                ⚠️ Some pieces in your cart exceed available Cairo workshop stock. Please adjust quantities before proceeding.
              </div>
            )}

            <ul className="divide-y divide-[#E2DCD2]/60 glass-card overflow-hidden">
              {items.map((item) => {
                const stock = item.variant?.stockQuantity ?? item.product?.stockQuantity ?? 0;
                const isOutOfStock = stock <= 0;
                const isOverStock = item.quantity > stock;
                const itemImage = item.product?.images?.[0];

                return (
                  <li key={item.id} className="flex flex-col gap-4 p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 sm:gap-5">
                      {itemImage ? (
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E2DCD2] bg-[#EDE7DC]">
                          <Image src={itemImage.url} alt="" fill className="object-cover" sizes="80px" />
                        </div>
                      ) : (
                        <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl border border-[#E2DCD2] bg-[#EDE7DC] flex items-center justify-center font-bold text-xs text-[#6B7068]">
                          NEST
                        </div>
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/products/${item.product?.slug}`}
                            className="font-display text-xl sm:text-2xl text-[#161716] hover:text-[#4A5E4C] transition-colors truncate"
                          >
                            {item.product?.name}
                          </Link>
                          {isOutOfStock ? (
                            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold text-red-800 font-mono">
                              Out of Stock
                            </span>
                          ) : isOverStock ? (
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800 font-mono">
                              Only {stock} Left
                            </span>
                          ) : null}
                        </div>

                        {item.variant && (
                          <p className="text-xs text-[#4A5E4C] font-semibold font-mono">
                            Finish: {item.variant.name}
                          </p>
                        )}
                        <p className="text-xs text-[#6B7068] font-mono">
                          {formatPrice(item.variant?.price ?? item.product?.price ?? 0)} EGP each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2DCD2]">
                      <div className="flex items-center rounded-full border border-[#E2DCD2] bg-[#FAFAF7] overflow-hidden">
                        <button
                          type="button"
                          disabled={item.quantity <= 1 || updating === item.id}
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold hover:bg-[#EDE7DC] disabled:opacity-40 cursor-pointer"
                        >
                          –
                        </button>
                        <span className="w-7 sm:w-8 text-center text-xs font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          disabled={item.quantity >= stock || updating === item.id}
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold hover:bg-[#EDE7DC] disabled:opacity-40 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <p className="w-auto sm:w-28 text-right text-base sm:text-lg font-semibold text-[#161716] font-mono">
                        {formatPrice(lineTotal(item))}
                      </p>

                      <button
                        type="button"
                        disabled={updating === item.id}
                        onClick={() => remove(item.id)}
                        className="text-xs font-semibold text-[#6B7068] hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Cart Summary Card */}
          <div className="glass-card p-8 space-y-6 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl text-[#161716] border-b border-[#E2DCD2]/60 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B7068]">Pieces Subtotal</span>
                <span className="font-semibold text-[#161716] font-mono">{formatPrice(subtotal)} EGP</span>
              </div>
              <div className="flex justify-between border-t border-[#E2DCD2] pt-3 text-[#6B7068]">
                <span>Payment Method</span>
                <span className="font-semibold text-[#161716]">Cash on Delivery (COD)</span>
              </div>
            </div>

            <div className="border-t border-[#E2DCD2] pt-4 flex justify-between items-baseline">
              <span className="font-display text-xl text-[#161716]">Estimated Total</span>
              <span className="text-3xl font-semibold text-[#161716] font-mono">{formatPrice(subtotal)}</span>
            </div>

            {hasOutOfStockItems ? (
              <Button className="w-full opacity-50 cursor-not-allowed" size="lg" disabled>
                Adjust stock to checkout
              </Button>
            ) : (
              <Link href="/checkout" className="block">
                <Button className="w-full py-4 text-sm font-semibold cursor-pointer" size="lg">
                  Proceed to Delivery ↗
                </Button>
              </Link>
            )}

            <p className="text-center text-[11px] text-[#6B7068] font-mono">
              🔒 White-glove handling & COD payment upon delivery.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <RequireAuth>
      <CartContent />
    </RequireAuth>
  );
}
