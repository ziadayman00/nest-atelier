"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { orderApi } from "@/lib/api/orders";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { OrderStatusBadge } from "@/components/orders/order-status";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils/format";
import type { Order, OrderStatus } from "@/lib/types/order";
import { useToast } from "@/providers/toast-provider";

export default function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get("status") ?? "");
  const { success: toastSuccess, error: toastError } = useToast();

  const load = () =>
    orderApi
      .listAll({ limit: 50, status: filter || undefined })
      .then((d) => setOrders(d.orders))
      .catch(() => toastError("Could not load client orders"))
      .finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    load();
  }, [filter]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await orderApi.updateStatus(id, status);
      toastSuccess(`Order status updated to ${status}`);
      await load();
    } catch {
      toastError("Failed to update order status");
    }
  };

  if (loading) return <Spinner className="h-8 w-8 text-[#4A5E4C]" />;

  return (
    <div className="space-y-6">
      {/* Header Bento Card */}
      <div className="bento-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Client Fulfillment</span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Workshop & Delivery Orders
          </h2>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Review client purchases, manage white-glove shipping statuses, and track COD.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <Select
            label="Filter Status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: "", label: "All Statuses" },
              ...ORDER_STATUSES.map((s) => ({ value: s.value, label: s.label })),
            ]}
          />
        </div>
      </div>

      {/* Orders Table Bento Card */}
      <div className="bento-card p-6 overflow-hidden">
        <div className="pb-4 border-b border-[#E2DCD2] flex items-center justify-between">
          <span className="pill-accent-sage text-xs">Order Log ({orders.length})</span>
          {filter && <span className="text-xs font-semibold text-[#4A5E4C]">Filtered: {filter}</span>}
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2DCD2] text-[#6B7068]">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Order Ref</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Total Amount</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Current Status</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCD2]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#EDE7DC]/30 transition-colors">
                    <td className="px-4 py-4 font-semibold text-[#161716]">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-4 text-[#6B7068] font-light">
                      {order.createdAt ? formatDate(order.createdAt) : "—"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#161716]">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="rounded-full border border-[#E2DCD2] bg-[#FAFAF7] px-4 py-1.5 text-xs font-semibold text-[#161716] cursor-pointer"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="font-display text-2xl text-[#6B7068]">No orders found.</p>
            <p className="text-xs text-[#6B7068] mt-1 font-light">Adjust status filter or wait for client checkouts</p>
          </div>
        )}
      </div>
    </div>
  );
}
