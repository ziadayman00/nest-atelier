"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";
import type { AnalyticsOverview } from "@/lib/types/analytics";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const loadAnalytics = (fromDate?: string, toDate?: string) => {
    setLoading(true);
    adminApi
      .getAnalyticsOverview({ from: fromDate || undefined, to: toDate || undefined })
      .then((d) => setAnalytics(d.analytics))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAnalytics(from, to);
  };

  if (loading && !analytics) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8 text-[#4A5E4C]" />
      </div>
    );
  }

  const summary = analytics?.summary ?? {
    deliveredRevenue: 0,
    deliveredOrderCount: 0,
    averageOrderValue: 0,
    newCustomerCount: 0,
  };

  return (
    <div className="space-y-8">
      {/* Header & Date Filter Bento */}
      <div className="bento-card p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DCD2] pb-6">
          <div>
            <span className="pill-accent-sage text-xs">Financial & Operations Data</span>
            <h1 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
              Enterprise Analytics Overview
            </h1>
            <p className="text-xs text-[#6B7068] font-light mt-1">
              Revenue calculations based strictly on delivered Cairo orders.
            </p>
          </div>
        </div>

        {/* Date Filter Form */}
        <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-end gap-4">
          <div className="w-40">
            <Input
              label="From Date"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Input
              label="To Date"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <Button type="submit" size="md">
            Apply Date Range ↗
          </Button>
          {(from || to) && (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setFrom("");
                setTo("");
                loadAnalytics();
              }}
            >
              Reset 30 Days
            </Button>
          )}
        </form>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bento-card p-6 space-y-2">
          <span className="pill-accent-sage text-[10px]">Delivered Revenue</span>
          <p className="font-display text-4xl text-[#161716]">{formatPrice(summary.deliveredRevenue)}</p>
          <p className="text-[11px] text-[#6B7068] font-light">EGP from completed deliveries</p>
        </div>

        <div className="bento-card p-6 space-y-2">
          <span className="pill-accent-sage text-[10px]">Delivered Orders</span>
          <p className="font-display text-4xl text-[#161716]">{summary.deliveredOrderCount}</p>
          <p className="text-[11px] text-[#6B7068] font-light">Orders fulfilled & paid</p>
        </div>

        <div className="bento-card p-6 space-y-2">
          <span className="pill-accent-sage text-[10px]">Average Order Value</span>
          <p className="font-display text-4xl text-[#161716]">{formatPrice(summary.averageOrderValue)}</p>
          <p className="text-[11px] text-[#6B7068] font-light">AOV per delivered client</p>
        </div>

        <div className="bento-card p-6 space-y-2">
          <span className="pill-accent-sage text-[10px]">New Clients</span>
          <p className="font-display text-4xl text-[#161716]">{summary.newCustomerCount}</p>
          <p className="text-[11px] text-[#6B7068] font-light">Registered client growth</p>
        </div>
      </div>

      {/* Orders By Status Breakdown & Coupon Impact */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Status Distribution */}
        <div className="lg:col-span-7 bento-card p-8 space-y-4">
          <h2 className="font-display text-2xl text-[#161716] border-b border-[#E2DCD2] pb-4">
            Orders Pipeline Distribution
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(analytics?.ordersByStatus ?? {}).map(([status, count]) => (
              <div key={status} className="bento-card-sand p-4 rounded-2xl space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7068]">
                  {status.replace(/_/g, " ")}
                </p>
                <p className="font-display text-3xl text-[#161716]">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Impact */}
        <div className="lg:col-span-5 bento-card-sage p-8 space-y-4">
          <span className="pill-accent-dark text-xs">Promotional Analytics</span>
          <h2 className="font-display text-3xl text-white">Coupon Code Impact</h2>
          <div className="space-y-4 pt-2 text-xs">
            <div className="flex justify-between border-b border-white/20 pb-3">
              <span className="text-white/80">Total Discount Granted</span>
              <span className="font-bold text-white text-lg">
                {formatPrice(analytics?.couponImpact?.totalDiscountGiven ?? 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Orders Using Coupons</span>
              <span className="font-bold text-white text-lg">
                {analytics?.couponImpact?.ordersWithCouponsCount ?? 0} Orders
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Leaderboard */}
      <div className="bento-card p-8 space-y-4">
        <h2 className="font-display text-2xl text-[#161716] border-b border-[#E2DCD2] pb-4">
          Top Performing Furniture Pieces
        </h2>
        {analytics?.topProducts && analytics.topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2DCD2] text-[#6B7068]">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Furniture Piece</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Quantity Sold</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCD2]">
                {analytics.topProducts.map((prod, idx) => (
                  <tr key={prod.id} className="hover:bg-[#EDE7DC]/30 transition-colors">
                    <td className="px-4 py-4 font-display text-xl text-[#161716]/40">
                      0{idx + 1}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#161716]">
                      {prod.name}
                    </td>
                    <td className="px-4 py-4 text-[#6B7068]">
                      {prod.totalQuantitySold} Units
                    </td>
                    <td className="px-4 py-4 font-bold text-[#161716] text-right">
                      {formatPrice(prod.totalRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#6B7068] font-light py-4">No delivered product sales in selected timeframe.</p>
        )}
      </div>
    </div>
  );
}
