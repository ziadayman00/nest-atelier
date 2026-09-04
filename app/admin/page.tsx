"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderApi } from "@/lib/api/orders";
import { designApi } from "@/lib/api/design";
import { adminApi } from "@/lib/api/admin";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    orders: 0,
    pendingOrders: 0,
    designRequests: 0,
    customers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderApi.listAll({ limit: 1 }),
      orderApi.listAll({ limit: 1, status: "pending" }),
      designApi.listAll({ limit: 1 }),
      adminApi.listCustomers({ limit: 1 }),
    ])
      .then(([allOrders, pending, designs, customers]) => {
        setStats({
          orders: allOrders.pagination.total,
          pendingOrders: pending.pagination.total,
          designRequests: designs.pagination.total,
          customers: customers.pagination.total,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      num: "01",
      label: "Total Client Orders",
      value: stats.orders,
      href: "/admin/orders",
      sub: "All order histories",
      tag: "Orders",
    },
    {
      num: "02",
      label: "Action Required",
      value: stats.pendingOrders,
      href: "/admin/orders?status=pending",
      sub: "Pending verification",
      tag: "Pending",
      highlight: stats.pendingOrders > 0,
    },
    {
      num: "03",
      label: "Design Consultations",
      value: stats.designRequests,
      href: "/admin/design-requests",
      sub: "Client space requests",
      tag: "Studio",
    },
    {
      num: "04",
      label: "Registered Clients",
      value: stats.customers,
      href: "/admin/customers",
      sub: "Client database",
      tag: "Roster",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="bento-card p-8 space-y-2">
        <span className="pill-accent-sage text-xs">Live Overview</span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#161716]">
          Atelier Performance Metrics
        </h2>
        <p className="text-xs text-[#6B7068] font-light">
          Real-time snapshot of workshop orders, spatial consultations, and client accounts.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group bento-card p-8 flex flex-col justify-between space-y-6 ${
              card.highlight
                ? "border-[#B86A44] shadow-md bg-gradient-to-br from-white via-[#FAFAF7] to-[#EDE7DC]"
                : ""
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-[#6B7068]">
                {card.num}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                card.highlight
                  ? "bg-[#B86A44] text-white"
                  : "bg-[#EDE7DC] text-[#161716]"
              }`}>
                {card.tag}
              </span>
            </div>

            {/* Stat number */}
            <div>
              {loading ? (
                <div className="h-12 w-24 skeleton" />
              ) : (
                <p className="font-display text-6xl text-[#161716] group-hover:text-[#4A5E4C] transition-colors">
                  {card.value}
                </p>
              )}
            </div>

            {/* Bottom info */}
            <div className="flex items-end justify-between border-t border-[#E2DCD2] pt-4">
              <div>
                <p className="font-display text-2xl text-[#161716]">{card.label}</p>
                <p className="text-xs text-[#6B7068] font-light mt-0.5">{card.sub}</p>
              </div>
              <span className="arrow-badge-btn shrink-0">↗</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Direct Shortcuts Bar */}
      <div className="bento-card p-8 space-y-4">
        <span className="pill-accent-sage text-xs">Quick Studio Actions</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <Link
            href="/admin/products"
            className="bento-card-sand p-5 text-center hover:bg-[#161716] hover:text-white transition-all group"
          >
            <p className="text-xs font-semibold uppercase tracking-wider group-hover:text-white">+ Add Furniture Piece</p>
            <p className="text-[10px] text-[#6B7068] group-hover:text-white/70 mt-1 font-light">Create catalog item</p>
          </Link>
          <Link
            href="/admin/categories"
            className="bento-card-sand p-5 text-center hover:bg-[#161716] hover:text-white transition-all group"
          >
            <p className="text-xs font-semibold uppercase tracking-wider group-hover:text-white">Manage Categories</p>
            <p className="text-[10px] text-[#6B7068] group-hover:text-white/70 mt-1 font-light">Organize atmospheres</p>
          </Link>
          <Link
            href="/admin/orders?status=pending"
            className="bento-card-sand p-5 text-center hover:bg-[#161716] hover:text-white transition-all group"
          >
            <p className="text-xs font-semibold uppercase tracking-wider group-hover:text-white">Review Orders</p>
            <p className="text-[10px] text-[#6B7068] group-hover:text-white/70 mt-1 font-light">Process pending COD</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
