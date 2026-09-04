"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderApi } from "@/lib/api/orders";
import { EmptyState } from "@/components/ui/container";
import { Spinner } from "@/components/ui/spinner";
import { OrderStatusBadge } from "@/components/orders/order-status";
import { formatDate, formatPrice } from "@/lib/utils/format";
import type { Order } from "@/lib/types/order";
import { Button } from "@/components/ui/button";

function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi
      .listMine()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner className="h-8 w-8 text-[#4A5E4C]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="glass-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs font-mono">Commission Dossier</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Furniture Orders & Placements
          </h1>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Track active Cairo white-glove hand deliveries and order records.
          </p>
        </div>
        <div className="rounded-full bg-[#EDE7DC] px-4 py-2 text-xs font-semibold text-[#161716] font-mono">
          {orders.length} {orders.length === 1 ? "Order" : "Orders"} Recorded
        </div>
      </div>

      {!orders.length ? (
        <div className="glass-card p-16 text-center">
          <EmptyState
            title="No orders placed yet"
            description="When you commission or purchase a piece from our atelier, track its white-glove hand delivery status here."
            action={
              <Link href="/products">
                <Button size="md" className="cursor-pointer">
                  Explore Atelier Catalog ↗
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <ul className="divide-y divide-[#E2DCD2]/60">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between hover:bg-[#FAFAF7] transition-colors group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xl text-[#161716] group-hover:text-[#4A5E4C] transition-colors">
                        Order #{order.orderNumber}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-[#6B7068] font-mono">
                      Placed {order.createdAt ? formatDate(order.createdAt) : ""} · {order.items?.length ?? 0} {order.items?.length === 1 ? "piece" : "pieces"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2DCD2]">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#161716] font-mono">
                        {formatPrice(order.totalAmount)} EGP
                      </p>
                      <p className="text-[10px] text-[#6B7068]">Cash on Delivery</p>
                    </div>
                    <span className="arrow-badge-btn h-7 w-7 text-xs bg-[#EDE7DC] text-[#161716] group-hover:bg-[#161716] group-hover:text-white transition-all">
                      ↗
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return <OrdersList />;
}
