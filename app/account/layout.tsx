"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RequireAuth } from "@/components/auth/require-auth";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/account",                 label: "Overview",            icon: "✦" },
  { href: "/account/wishlist",         label: "Saved Wishlist",      icon: "♥" },
  { href: "/account/notifications",    label: "Notifications Inbox", icon: "🔔" },
  { href: "/account/orders",          label: "Furniture Orders",    icon: "📦" },
  { href: "/account/design-requests", label: "Spatial Consults",    icon: "🏛️" },
];

function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-4 sm:py-6 space-y-6">

      {/* Header Bento Banner */}
      <div className="bento-card p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Client Sanctuary</span>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#161716] mt-1">
            NEST Account Portal
          </h1>
        </div>
        <Link href="/products" className="pill-accent-dark text-xs self-start sm:self-auto">
          Browse Storefront ↗
        </Link>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[260px_1fr] items-start">
        {/* Sidebar Bento Navigation */}
        <aside className="bento-card p-4 sm:p-6 space-y-3 sm:space-y-4 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7068]">
            Portal Menu
          </p>
          <nav className="flex flex-row lg:flex-col gap-2 lg:gap-0 lg:space-y-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0" aria-label="Account Navigation">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "shrink-0 lg:shrink flex items-center justify-between gap-3 px-4 py-2.5 sm:py-3 text-xs font-semibold rounded-full transition-all",
                    isActive
                      ? "bg-[#161716] text-white shadow-xs"
                      : "bg-[#FAFAF7] border border-[#E2DCD2] text-[#6B7068] hover:border-[#161716] hover:text-[#161716]"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs">{link.icon}</span>
                    <span>{link.label}</span>
                  </span>
                  {isActive && <span className="text-xs hidden sm:inline">→</span>}
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

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AccountShell>{children}</AccountShell>
    </RequireAuth>
  );
}
