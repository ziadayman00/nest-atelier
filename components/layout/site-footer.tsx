"use client";

import Link from "next/link";
import { NestLogo } from "@/components/brand/nest-logo";

export function SiteFooter() {
  return (
    <footer className="w-full px-4 sm:px-8 lg:px-14 py-4 sm:py-6">
      <div className="glass-card-dark p-6 sm:p-12 lg:p-14 relative overflow-hidden space-y-12">
        {/* Monogram Watermark */}
        <div className="absolute right-6 bottom-4 select-none pointer-events-none opacity-[0.04] font-display text-[220px] leading-none text-white">
          NEST
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 pb-10 border-b border-white/10 relative z-10">
          {/* Brand Colophon */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <NestLogo variant="full" color="light" />
            </Link>

            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-white/70 font-light pt-1">
              NEST is an independent Cairo architectural lifestyle atelier and residential interior practice. We craft bespoke modern furniture using solid Egyptian hardwoods and offer dedicated interior design planning.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-[#8BA888]">
              <span className="h-2 w-2 rounded-full bg-[#8BA888]" />
              <span>100% Solid Hardwood · Handcrafted in Cairo</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8BA888]">
              Studio Navigation
            </p>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Shop Furniture Atelier
                </Link>
              </li>
              <li>
                <Link href="/design-consultation" className="hover:text-white transition-colors">
                  Bespoke Spatial Consultation
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Bag & Orders
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Client Account Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8BA888]">
              Cairo Atelier & Workshop
            </p>
            <div className="text-xs text-white/70 space-y-1">
              <p className="font-semibold text-white">Maadi & New Cairo Design Hubs</p>
              <p>Cairo, Egypt</p>
              <p className="pt-1 text-white/50">Hours: Sat – Thu, 10:00 AM – 8:00 PM</p>
              <p className="text-white/50">Direct: atelier@nest.local</p>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-white mb-2">Subscribe to Spatial Journal</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white placeholder:text-white/40 focus:border-[#8BA888] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-[#181A18] hover:bg-[#8BA888] hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Colophon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 relative z-10 text-center sm:text-left">
          <p>© {new Date().getFullYear()} NEST Atelier. Architectural Studio Cairo.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 text-[11px]">
            <span>Cairo, Egypt</span>
            <span>·</span>
            <span>Solid Wood Craft</span>
            <span>·</span>
            <span>White-Glove Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
