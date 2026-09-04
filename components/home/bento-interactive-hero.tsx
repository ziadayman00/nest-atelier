"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Finish {
  id: string;
  name: string;
  spec: string;
  color: string;
  origin: string;
  density: string;
}

interface HeroShowcasePiece {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  specs: string;
  slug: string;
  hotspots: {
    id: string;
    label: string;
    detail: string;
    top: string;
    left: string;
  }[];
}

const WOOD_FINISHES: Finish[] = [
  {
    id: "oak",
    name: "Danish Solid White Oak",
    spec: "Hand-Rubbed Organic Oil",
    color: "#D8C4A9",
    origin: "European Sustainable Forestry",
    density: "1,360 Janka Hardness",
  },
  {
    id: "walnut",
    name: "Smoked Egyptian Walnut",
    spec: "Deep Satin Grain Polish",
    color: "#5C4638",
    origin: "Kiln-Dried Local Hardwood",
    density: "1,010 Janka Hardness",
  },
  {
    id: "beech",
    name: "Cairo European Beech",
    spec: "Natural Honey Beeswax",
    color: "#E0CFB3",
    origin: "Atelier Stock Selection",
    density: "1,300 Janka Hardness",
  },
];

const SHOWCASE_PIECES: HeroShowcasePiece[] = [
  {
    id: "soliman",
    name: "Soliman Monolithic Dining Table",
    category: "Dining Sanctuary",
    image: "/products/soliman-dining-table.jpg",
    price: "EGP 14,500",
    specs: "Solid 45mm Slab · Double Mortise Joints",
    slug: "soliman-dining-table",
    hotspots: [
      {
        id: "joint",
        label: "Exposed Mortise & Tenon",
        detail: "Traditional interlocking structural joinery with zero synthetic hardware.",
        top: "54%",
        left: "38%",
      },
      {
        id: "surface",
        label: "Continuous Grain Match",
        detail: "Milled from single-log timber sections with hand-chamfered perimeter edges.",
        top: "38%",
        left: "64%",
      },
    ],
  },
  {
    id: "karnak",
    name: "Karnak Sculptural Deep Sofa",
    category: "Living Sanctuary",
    image: "/products/karnak-sofa.jpg",
    price: "EGP 28,000",
    specs: "Beech Internal Skeleton · Belgian Linen",
    slug: "karnak-sofa",
    hotspots: [
      {
        id: "cushion",
        label: "Organic Feather Fill",
        detail: "Layered high-resilience foam core encased in Egyptian washed duck feather.",
        top: "46%",
        left: "48%",
      },
      {
        id: "frame",
        label: "Low-Slung Platform Base",
        detail: "Grounded 80mm architectural plinth with concealed floor protectors.",
        top: "76%",
        left: "32%",
      },
    ],
  },
  {
    id: "nile",
    name: "Nile Curve Atelier Lounge Chair",
    category: "Study & Lounge",
    image: "/products/nile-curve-chair.jpg",
    price: "EGP 9,200",
    specs: "Steam-Bent Solid Beech · Ergonomic Rake",
    slug: "nile-curve-chair",
    hotspots: [
      {
        id: "contour",
        label: "Steam-Bent Backrest",
        detail: "Continuous radial curve bent under controlled steam pressure for optimal lumbar contour.",
        top: "35%",
        left: "52%",
      },
      {
        id: "base",
        label: "Tapered Dowel Legs",
        detail: "Turned on Cairo wood lathes with angled compound joinery.",
        top: "72%",
        left: "44%",
      },
    ],
  },
];

export function BentoInteractiveHero() {
  const [activeFinish, setActiveFinish] = useState<Finish>(WOOD_FINISHES[0]);
  const [activePieceIndex, setActivePieceIndex] = useState(0);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  const activePiece = SHOWCASE_PIECES[activePieceIndex];

  return (
    <div className="w-full space-y-6">

      {/* ── TOP ARCHITECTURAL MASTHEAD BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2 text-xs text-[#6B7068]">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-[#4A5E4C] animate-pulse" />
          <span className="font-mono tracking-widest uppercase text-[#161716] font-medium text-[11px]">
            Cairo Atelier · 30.0444° N, 31.2357° E
          </span>
          <span className="hidden sm:inline-block text-[#D1CCC4]">|</span>
          <span className="hidden sm:inline-block text-[#6B7068]">
            Edition 04 · Made to Commission
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] uppercase tracking-wider font-mono">
          <span>Solid Hardwoods Only</span>
          <span className="text-[#D1CCC4]">·</span>
          <span>Zero Synthetic Veneers</span>
        </div>
      </div>

      {/* ── MAIN HERO BENTO GRID (12 COLS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* ── LEFT HERO STATEMENT & MATERIAL WORKSHOP (7 Cols) ── */}
        <div className="lg:col-span-7 bento-card p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8 sm:space-y-10 relative overflow-hidden bg-gradient-to-br from-white via-[#FCFBF8] to-[#F4F1EA]/80 border border-[#E2DCD2]/80">

          {/* Top Row: Series Marker & Finish Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EDE7DC] border border-[#E2DCD2] text-xs font-semibold text-[#161716] uppercase tracking-widest self-start">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4A5E4C]" />
              <span>Architectural Hardwood</span>
            </div>

            {/* Interactive Wood Switcher */}
            <div className="flex items-center gap-1 rounded-full bg-[#EDE7DC] p-1 border border-[#E2DCD2] overflow-x-auto no-scrollbar">
              {WOOD_FINISHES.map((f) => {
                const isSelected = activeFinish.id === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFinish(f)}
                    className={`group flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-full transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-[#161716] text-white shadow-xs"
                        : "text-[#6B7068] hover:text-[#161716]"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-white/40 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: f.color }}
                    />
                    <span className="tracking-wider">{f.id.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Hero Headline & Atelier Ethos */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.75rem] leading-[1.08] text-[#161716] tracking-tight">
                Architectural Furniture, Handcrafted in Cairo for{" "}
                <span className="italic font-normal text-[#4A5E4C] underline decoration-[#4A5E4C]/30 underline-offset-8">
                  Generational Spaces
                </span>
                .
              </h1>
              <p className="text-xs sm:text-base text-[#6B7068] leading-relaxed font-light max-w-2xl">
                Every dining table, deep lounge, and architectural bureau is milled from solid hardwood with mortise-and-tenon joinery. Crafted to outlast seasonal trends and disposable production.
              </p>
            </div>

            {/* Active Material Lab Pill Card */}
            <div className="p-4 rounded-2xl bg-white/90 border border-[#E2DCD2] backdrop-blur-sm space-y-2 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-4 w-4 rounded-full border border-black/15 shadow-inner"
                    style={{ backgroundColor: activeFinish.color }}
                  />
                  <div>
                    <span className="font-semibold text-[#161716]">{activeFinish.name}</span>
                    <span className="text-[#6B7068] text-[11px] ml-2 font-mono">({activeFinish.density})</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#4A5E4C] bg-[#4A5E4C]/10 px-2.5 py-0.5 rounded-full">
                  {activeFinish.spec}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7068] font-light">
                Origin: <strong className="font-medium text-[#161716]">{activeFinish.origin}</strong> · Natural beeswax and organic oil nourishment.
              </p>
            </div>
          </div>

          {/* Action Callouts & Metrics */}
          <div className="space-y-6 pt-4 border-t border-[#E2DCD2]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center justify-between sm:justify-start gap-3 rounded-full bg-[#161716] pl-6 sm:pl-7 pr-3 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#4A5E4C] transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Explore Atelier Catalog</span>
                <span className="arrow-badge-btn bg-white/15 group-hover:bg-white group-hover:text-[#161716]">↗</span>
              </Link>

              <Link
                href="/design-consultation"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#161716]/20 bg-transparent px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#161716] hover:bg-white transition-all cursor-pointer"
              >
                <span>Spatial Consultation</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 border-t border-[#E2DCD2]/60 text-xs">
              <div>
                <p className="font-display text-2xl sm:text-3xl text-[#161716] leading-none">120+</p>
                <p className="text-[10px] sm:text-[11px] text-[#6B7068] mt-1 uppercase tracking-wider font-mono">Bespoke Homes</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl text-[#161716] leading-none">100%</p>
                <p className="text-[10px] sm:text-[11px] text-[#6B7068] mt-1 uppercase tracking-wider font-mono">Solid Hardwood</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl text-[#161716] leading-none">10 Yrs</p>
                <p className="text-[10px] sm:text-[11px] text-[#6B7068] mt-1 uppercase tracking-wider font-mono">Joint Warranty</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT HERO INTERACTIVE PIECE VIEWER WITH HOTSPOTS (5 Cols) ── */}
        <div className="lg:col-span-5 bento-card relative overflow-hidden min-h-[520px] group flex flex-col justify-between border border-[#E2DCD2]/80">

          {/* Background Piece Image with crossfade effect */}
          {SHOWCASE_PIECES.map((piece, idx) => (
            <div
              key={piece.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === activePieceIndex ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
              }`}
            >
              <Image
                src={piece.image}
                alt={piece.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161716]/90 via-[#161716]/25 to-black/30" />
            </div>
          ))}

          {/* Top Bar: Live Atmosphere Tag + Piece Switcher Dots */}
          <div className="relative z-10 flex items-center justify-between p-6 sm:p-8">
            <span className="pill-accent-dark text-xs backdrop-blur-md">
              ✦ Atelier Spotlight
            </span>

            {/* Piece tabs */}
            <div className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md p-1 border border-white/20">
              {SHOWCASE_PIECES.map((piece, i) => (
                <button
                  key={piece.id}
                  type="button"
                  onClick={() => setActivePieceIndex(i)}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                    i === activePieceIndex
                      ? "bg-white text-[#161716] font-bold shadow-xs"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  0{i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Joinery Hotspots for Active Piece */}
          {activePiece.hotspots.map((h) => (
            <div
              key={h.id}
              className="absolute z-20 cursor-pointer"
              style={{ top: h.top, left: h.left }}
              onMouseEnter={() => setHoveredHotspot(h.id)}
              onMouseLeave={() => setHoveredHotspot(null)}
              onClick={() => setHoveredHotspot(hoveredHotspot === h.id ? null : h.id)}
            >
              <div className="hotspot-dot" />
              {hoveredHotspot === h.id && (
                <div className="absolute left-6 -top-2 w-56 rounded-2xl bg-white/95 p-3.5 shadow-2xl backdrop-blur-xl border border-white/40 text-xs animate-reveal-up pointer-events-none">
                  <p className="font-semibold text-[#161716]">{h.label}</p>
                  <p className="text-[11px] text-[#6B7068] mt-1 font-light leading-snug">{h.detail}</p>
                </div>
              )}
            </div>
          ))}

          {/* Bottom Card Content & Navigation to Product */}
          <div className="relative z-10 p-6 sm:p-8 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-white/75 text-[11px] uppercase tracking-wider font-mono">
                <span>{activePiece.category}</span>
                <span className="text-[#D8E2D6] font-semibold">{activePiece.price}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight">
                {activePiece.name}
              </h3>
              <p className="text-xs text-white/75 font-light">
                {activePiece.specs}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <div className="text-[11px] text-white/80 font-mono">
                Finish: <span className="text-[#D8E2D6] font-semibold">{activeFinish.name}</span>
              </div>

              <Link
                href={`/products/${activePiece.slug}`}
                className="group/link flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#161716] hover:bg-[#4A5E4C] hover:text-white transition-all shadow-md"
              >
                <span>View Details</span>
                <span className="arrow-badge-btn h-6 w-6 text-[11px] bg-[#161716] text-white group-hover/link:bg-white group-hover/link:text-[#161716]">↗</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
