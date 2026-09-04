"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";

function AccountHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bento-card p-8 space-y-2">
        <span className="pill-accent-sage text-xs">Client Dossier</span>
        <h1 className="font-display text-3xl sm:text-4xl text-[#161716]">
          Welcome back, {user?.fullName.split(" ")[0]}
        </h1>
        <p className="text-xs text-[#6B7068] font-light">{user?.email}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="group bento-card p-8 flex flex-col justify-between space-y-6"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDE7DC] text-lg">
              📦
            </span>
            <span className="arrow-badge-btn">↗</span>
          </div>
          <div>
            <h2 className="font-display text-2xl text-[#161716] group-hover:text-[#4A5E4C] transition-colors">
              Furniture Orders
            </h2>
            <p className="mt-1 text-xs text-[#6B7068] leading-relaxed font-light">
              Track your active piece deliveries, COD invoices, and order history.
            </p>
          </div>
        </Link>

        <Link
          href="/account/design-requests"
          className="group bento-card p-8 flex flex-col justify-between space-y-6"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDE7DC] text-lg">
              🏛️
            </span>
            <span className="arrow-badge-btn">↗</span>
          </div>
          <div>
            <h2 className="font-display text-2xl text-[#161716] group-hover:text-[#4A5E4C] transition-colors">
              Spatial Consultations
            </h2>
            <p className="mt-1 text-xs text-[#6B7068] leading-relaxed font-light">
              Review submitted floor plans, space specs, and architect recommendations.
            </p>
          </div>
        </Link>
      </div>

      <div className="bento-card-sage p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-display text-2xl text-white">Planning a new residential space in Cairo?</h3>
          <p className="text-xs text-white/80 font-light">Upload room photos and collaborate with our interior architects.</p>
        </div>
        <Link href="/design-consultation">
          <Button variant="accent" size="md">
            Request Spatial Consultation ↗
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return <AccountHome />;
}
