"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RequireAdmin } from "@/components/auth/require-auth";
import { cn } from "@/lib/utils/cn";

const adminLinks = [
  { href: "/admin",                 label: "Overview",        icon: "✦" },
  { href: "/admin/analytics",       label: "Analytics",       icon: "📈" },
  { href: "/admin/reviews",         label: "Review Mod",      icon: "★" },
  { href: "/admin/coupons",         label: "Coupons",         icon: "🏷️" },
  { href: "/admin/delivery-zones",  label: "Delivery Zones",  icon: "🚚" },
  { href: "/admin/collections",     label: "Collections",     icon: "🏛️" },
  { href: "/admin/products",        label: "Furniture",       icon: "◈" },
  { href: "/admin/categories",      label: "Atmospheres",     icon: "◇" },
  { href: "/admin/orders",          label: "Client Orders",   icon: "❖" },
  { href: "/admin/design-requests", label: "Consultations",   icon: "⟡" },
  { href: "/admin/customers",       label: "Client Roster",   icon: "◉" },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full px-6 sm:px-10 lg:px-14 py-6 space-y-6">

      {/* Header Bento Banner */}
      <div className="bento-card p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Studio Operations</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Atelier Command Center
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E2DCD2] bg-[#FAFAF7] px-4 py-2 text-xs font-semibold text-[#161716]">
            <span className="h-2 w-2 rounded-full bg-[#4A5E4C] animate-pulse" />
            Live Enterprise Workshop
          </span>
          <Link href="/" className="pill-accent-dark text-xs">
            Storefront ↗
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr] items-start">
        {/* Sidebar Bento Navigation */}
        <aside className="bento-card p-6 space-y-4 sticky top-24 max-h-[85vh] overflow-y-auto no-scrollbar">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7068]">
            Command Menu
          </p>
          <nav className="space-y-1.5" aria-label="Admin Navigation">
            {adminLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 text-xs font-semibold rounded-full transition-all",
                    isActive
                      ? "bg-[#161716] text-white shadow-xs"
                      : "bg-[#FAFAF7] border border-[#E2DCD2] text-[#6B7068] hover:border-[#161716] hover:text-[#161716]"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-[10px] opacity-70">{link.icon}</span>
                    <span>{link.label}</span>
                  </span>
                  {isActive && <span className="text-xs">→</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAdmin>
      <AdminShell>{children}</AdminShell>
    </RequireAdmin>
  );
}
