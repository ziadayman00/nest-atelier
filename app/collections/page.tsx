import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { catalogApi } from "@/lib/api/catalog";
import { getAtmosphereMeta } from "@/lib/data/atmosphere-data";

export const metadata: Metadata = {
  title: "Curated Collections | NEST Atelier Cairo",
  description:
    "Explore curated architectural furniture collections by NEST Atelier in Cairo. Monolithic solid timber suites designed for expansive residential living.",
};

const COLLECTION_ENRICHMENT: Record<
  string,
  {
    heroImage: string;
    hardwood: string;
    subtitle: string;
    atmosphereNote: string;
    seriesNumber: string;
  }
> = {
  "cairo-oak-monolith": {
    heroImage: "/hero-room.jpg",
    hardwood: "Solid White Oak & Aged Brass",
    subtitle: "Architectural Dining & Master Chamber Suite",
    atmosphereNote: "Proportioned for high-ceilinged Cairo salons with soft northern daylight.",
    seriesNumber: "Series 01",
  },
  "sculptural-living-2026": {
    heroImage: "/products/karnak-sofa.jpg",
    hardwood: "Smoked Egyptian Walnut & Bouclé",
    subtitle: "Low-Profile Sculptural Lounge Pavilion",
    atmosphereNote: "Curvilinear lounge pieces exploring organic geometries and blind joinery.",
    seriesNumber: "Series 02",
  },
  "heritage-raw-walnut": {
    heroImage: "/products/maadi-coffee-table.jpg",
    hardwood: "Dark River Walnut & Hand-Waxed Oil",
    subtitle: "Tactile Grain Matching & Monolithic Forms",
    atmosphereNote: "Heavy architectural centerpieces celebrating raw timber character.",
    seriesNumber: "Series 03",
  },
};

export default async function CollectionsPage() {
  let collections = [] as Awaited<ReturnType<typeof catalogApi.getCollections>>["collections"];
  try {
    const data = await catalogApi.getCollections();
    collections = (data.collections ?? []).filter(
      (c) => c.isActive !== false && !c.name.toLowerCase().includes("test")
    );
  } catch {
    collections = [];
  }

  const featured = collections[0];
  const remainingCollections = collections.slice(1);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-6 sm:py-10 space-y-16 max-w-[1560px] mx-auto">
      {/* ── 1. EDITORIAL MASTHEAD ── */}
      <div className="space-y-4 border-b border-[#E2DCD2]/70 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="pill-accent-sage text-xs font-mono">Curated Series Dossier</span>
            <span className="text-xs text-[#6B7068] font-mono">
              Cairo Atelier Practice · 30.0444° N, 31.2357° E
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-[#4A5E4C] bg-[#4A5E4C]/10 px-3.5 py-1 rounded-full">
            {collections.length} Spatial Suites Assembled
          </span>
        </div>

        <div className="max-w-4xl space-y-3">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#161716] leading-[1.02] tracking-tight">
            Curated Spatial Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7068] font-light max-w-2xl leading-relaxed">
            A room is not a loose assortment of disparate objects; it is an architectural conversation.
            Our collections assemble solid timber pieces that share structural geometry, woodgrain continuity,
            and ambient light interaction.
          </p>
        </div>
      </div>

      {/* ── 2. HERO EXHIBITION PAVILION (FEATURED SERIES) ── */}
      {featured && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B7068]">
              Flagship Series Showcase
            </span>
            <span className="pill-accent-dark text-[11px] font-mono">
              {COLLECTION_ENRICHMENT[featured.slug]?.seriesNumber ?? "Series 01"}
            </span>
          </div>

          <div className="glass-card overflow-hidden group relative transition-all duration-700 hover:shadow-2xl">
            <div className="grid lg:grid-cols-12 gap-0 items-stretch min-h-[500px]">
              {/* Left: Atmospheric Photography */}
              <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[520px] overflow-hidden bg-[#EDE7DC]">
                <Image
                  src={
                    featured.imageUrl ||
                    COLLECTION_ENRICHMENT[featured.slug]?.heroImage ||
                    "/hero-room.jpg"
                  }
                  alt={featured.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
                <div className="absolute bottom-4 left-4 z-10 lg:hidden">
                  <span className="pill-accent-dark text-[10px] font-mono">
                    {COLLECTION_ENRICHMENT[featured.slug]?.seriesNumber ?? "Flagship Series"}
                  </span>
                </div>
              </div>

              {/* Right: Curatorial Dossier & Interaction */}
              <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8 bg-white/60 backdrop-blur-md">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="pill-accent-sage text-xs font-mono">
                      {COLLECTION_ENRICHMENT[featured.slug]?.subtitle ?? "Architectural Suite"}
                    </span>
                    <span className="text-xs font-mono text-[#6B7068]">
                      Edition 2026
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl text-[#161716] leading-[1.05]">
                    {featured.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#6B7068] font-light leading-relaxed">
                    {featured.description ||
                      "A disciplined study in monolithic solid timber and structural presence. Each piece is proportioned to anchor residential rooms with quiet authority."}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#E2DCD2]/60 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#6B7068] block">
                        Hardwood Species
                      </span>
                      <span className="font-semibold text-[#161716] text-xs">
                        {COLLECTION_ENRICHMENT[featured.slug]?.hardwood ?? "Solid European Oak"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#6B7068] block">
                        Spatial Intent
                      </span>
                      <span className="font-semibold text-[#161716] text-xs">
                        Full Residence Suite
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#E2DCD2]/60">
                  <p className="text-[11px] text-[#4A5E4C] font-mono italic">
                    "{COLLECTION_ENRICHMENT[featured.slug]?.atmosphereNote ?? "Proportioned for architectural gravitas."}"
                  </p>

                  <Link
                    href={`/collections/${featured.slug}`}
                    className="inline-flex items-center justify-between w-full rounded-full bg-[#161716] px-6 py-4 text-xs font-medium text-white shadow-[0_4px_16px_-4px_rgba(22,23,22,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-[#374739] active:scale-95 transition-all group-hover:bg-[#4A5E4C]"
                  >
                    <span>Enter Exhibition Pavilion</span>
                    <span className="text-sm">↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. ARCHITECTURAL GALLERY (REMAINING SERIES) ── */}
      {remainingCollections.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2DCD2]/60 pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B7068]">
              Additional Curated Series
            </span>
            <span className="text-xs font-mono text-[#6B7068]">
              Handcrafted in Cairo Workshop
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {remainingCollections.map((col, idx) => {
              const meta = COLLECTION_ENRICHMENT[col.slug] ?? {
                heroImage: getAtmosphereMeta(col.slug, idx + 1).image,
                hardwood: "Solid Architectural Timber",
                subtitle: "Atelier Curated Edition",
                atmosphereNote: "Proportioned for expansive living spaces.",
                seriesNumber: `Series 0${idx + 2}`,
              };

              return (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group relative flex flex-col justify-between glass-card p-6 sm:p-8 space-y-6 overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-[#EDE7DC]">
                    <Image
                      src={col.imageUrl || meta.heroImage}
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="pill-accent-dark text-[10px] font-mono">
                        {meta.seriesNumber}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="arrow-badge-btn text-xs bg-white/90 text-[#161716] group-hover:bg-[#161716] group-hover:text-white">
                        ↗
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#6B7068]">
                      <span>{meta.subtitle}</span>
                      <span className="text-[#4A5E4C] font-semibold">{meta.hardwood}</span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl text-[#161716] group-hover:text-[#4A5E4C] transition-colors">
                      {col.name}
                    </h2>

                    <p className="text-xs text-[#6B7068] font-light line-clamp-2 leading-relaxed">
                      {col.description ||
                        "Curated furniture suite celebrating authentic timber joints, balanced weight, and natural light reflection."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E2DCD2]/60 flex items-center justify-between text-xs font-mono text-[#161716]">
                    <span className="text-[#6B7068] group-hover:text-[#161716] transition-colors">
                      View Included Pieces & Specs
                    </span>
                    <span className="font-semibold text-sm">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. ATELIER MANIFESTO & SPATIAL CONSULTATION BANNER ── */}
      <div className="glass-card-sand p-8 sm:p-12 space-y-6">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="pill-accent-sage text-xs font-mono">Custom Curation Practice</span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#161716] leading-snug">
              Bespoke Whole-Residence Commissioning
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7068] font-light leading-relaxed max-w-2xl">
              Do you have unique architectural ceiling heights, expansive floor plans, or custom timber
              preferences? Our Cairo interior architects can adapt any collection series or curate a
              harmonious multi-room furniture plan specifically tailored to your home.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link
              href="/design-consultation"
              className="inline-flex items-center gap-2 rounded-full bg-[#161716] px-8 py-4 text-xs font-medium text-white shadow-[0_4px_16px_-4px_rgba(22,23,22,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-[#374739] active:scale-95 transition-all"
            >
              <span>Book Spatial Consultation</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
