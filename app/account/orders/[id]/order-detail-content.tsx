"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { orderApi } from "@/lib/api/orders";
import { Spinner } from "@/components/ui/spinner";
import { OrderStatusBadge, OrderTimeline } from "@/components/orders/order-status";
import { formatDate, formatPrice } from "@/lib/utils/format";
import type { Order } from "@/lib/types/order";

export default function OrderDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const placed = searchParams.get("placed");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi
      .getMine(id)
      .then((data) => setOrder(data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner className="h-8 w-8 text-[#4A5E4C]" />
      </div>
    );
  }
  if (!order) return <p className="text-sm text-[#6B7068]">Order not found.</p>;

  return (
    <div className="space-y-8">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A5E4C] hover:text-[#161716] transition-colors"
      >
        <span>← Back to Orders</span>
      </Link>

      {placed && (
        <div className="rounded-2xl border border-[#4A5E4C]/30 bg-[#FAFAF7] p-5 text-xs text-[#161716] space-y-1 shadow-xs">
          <p className="font-semibold text-sm text-[#4A5E4C]">🎉 Order Placed Successfully!</p>
          <p className="text-[#6B7068] font-light">
            Our Cairo workshop has received your request. A team member will reach out via phone to coordinate white-glove hand delivery into your residence.
          </p>
        </div>
      )}

      {/* Header Bento */}
      <div className="glass-card p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="pill-accent-sage text-xs font-mono">Commission Record</span>
            <span className="text-xs text-[#6B7068] font-mono">Placed {order.createdAt ? formatDate(order.createdAt) : ""}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Order #{order.orderNumber}
          </h1>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Order Items */}
        <div className="glass-card p-8 space-y-6">
          <h2 className="font-display text-2xl text-[#161716] border-b border-[#E2DCD2]/60 pb-4">
            Commissioned Pieces
          </h2>
          <ul className="divide-y divide-[#E2DCD2]/60">
            {(order.items ?? []).map((item) => (
              <li key={item.id} className="flex justify-between py-4 text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-sm text-[#161716]">{item.productName}</p>
                  {item.variantName && (
                    <p className="text-[#4A5E4C] font-mono font-medium">Finish: {item.variantName}</p>
                  )}
                  <p className="text-[#6B7068] font-mono">Qty {item.quantity}</p>
                </div>
                <p className="font-mono font-semibold text-sm text-[#161716]">{formatPrice(item.lineTotal)} EGP</p>
              </li>
            ))}
          </ul>

          <div className="border-t border-[#E2DCD2]/60 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-base font-semibold text-[#161716] pt-2">
              <span>Commission Total</span>
              <span className="font-mono text-xl">{formatPrice(order.totalAmount)} EGP</span>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Status */}
        <div className="space-y-6">
          <div className="glass-card p-8 space-y-4">
            <h2 className="font-display text-2xl text-[#161716] border-b border-[#E2DCD2]/60 pb-4">
              Delivery Address & Recipient
            </h2>
            <address className="text-xs not-italic text-[#6B7068] space-y-1 leading-relaxed">
              <p className="font-semibold text-[#161716] text-sm">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>{order.shippingAddress.city}</p>
              <p className="font-mono text-[#161716] pt-1">{order.shippingAddress.phone}</p>
            </address>
          </div>

          <div className="glass-card p-8 space-y-4">
            <h2 className="font-display text-2xl text-[#161716] border-b border-[#E2DCD2]/60 pb-4">
              Atelier Production & Delivery Progress
            </h2>
            <div className="pt-2">
              <OrderTimeline status={order.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
