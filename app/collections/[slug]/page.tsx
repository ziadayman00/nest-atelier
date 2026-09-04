import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { catalogApi } from "@/lib/api/catalog";
import { ProductGrid } from "@/components/catalog/product-grid";
import { EmptyState } from "@/components/ui/container";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const COLLECTION_META: Record<
  string,
  {
    heroImage: string;
    series: string;
    hardwood: string;
    curator: string;
    dimensionsRecommendation: string;
    lightRecommendation: string;
  }
> = {
  "cairo-oak-monolith": {
    heroImage: "/hero-room.jpg",
    series: "Series 01 · Flagship Edition",
    hardwood: "Solid European White Oak & Aged Brass",
    curator: "NEST Architectural Studio, Zamalek",
    dimensionsRecommendation: "Ceiling heights 3.2m+ · Expansive Open-Plan Living & Dining",
    lightRecommendation: "Warm indirect ambient lighting (2700K) to enhance natural grain depth",
  },
  "sculptural-living-2026": {
    heroImage: "/products/karnak-sofa.jpg",
    series: "Series 02 · Contemporary Practice",
    hardwood: "Smoked Egyptian Walnut & Heavy Bouclé",
    curator: "NEST Atelier Spatial Practice",
    dimensionsRecommendation: "Medium to large salons · Grounded low-profile seating zone",
    lightRecommendation: "Low architectural floor luminaires and soft cove illumination",
  },
  "heritage-raw-walnut": {
    heroImage: "/products/maadi-coffee-table.jpg",
    series: "Series 03 · Material Archive",
    hardwood: "Dark River Walnut & Hand-Waxed Oil",
    curator: "Cairo Hardwood Workshop Masters",
    dimensionsRecommendation: "Architectural residences with natural limestone or herringbone parquet",
    lightRecommendation: "Natural daylight grazing across raw live-edge surfaces",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { collection } = await catalogApi.getCollectionBySlug(slug);
    return {
      title: `${collection.name} | Curated Collection | NEST Atelier`,
      description:
        collection.description ?? "Curated architectural collection by NEST Atelier in Cairo.",
    };
  } catch {
    return { title: "Curated Collection | NEST Atelier" };
  }
}

export default async function SingleCollectionPage({ params }: PageProps) {
  const { slug } = await params;
  let collection;
  try {
    const data = await catalogApi.getCollectionBySlug(slug);
    collection = data.collection;
  } catch {
    notFound();
  }

  const products = collection.products ?? [];
  const meta = COLLECTION_META[slug] ?? {
    heroImage: collection.imageUrl || "/hero-room.jpg",
    series: "Curated Edition",
    hardwood: "Solid Hardwood",
    curator: "NEST Atelier Cairo",
    dimensionsRecommendation: "Residential Living & Dining Suites",
    lightRecommendation: "Warm architectural ambient lighting",
  };

  const heroImageSrc = collection.imageUrl || meta.heroImage;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-6 sm:py-10 space-y-16 max-w-[1560px] mx-auto">
      {/* ── BREADCRUMB & SERIES BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DCD2]/70 pb-4">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#6B7068] hover:text-[#161716] transition-colors"
        >
          <span>← Back to Curated Collections</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="pill-accent-dark text-[10px] font-mono">{meta.series}</span>
          <span className="pill-accent-sage text-[10px] font-mono">
            {products.length} {products.length === 1 ? "Piece" : "Pieces"} Curated
          </span>
        </div>
      </div>

      {/* ── EXHIBITION HERO MASTHEAD ── */}
      <div className="glass-card overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-0 items-stretch">
          {/* Left: Curatorial Essay & Metadata */}
          <div className="lg:col-span-6 p-6 sm:p-12 lg:p-14 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <span className="pill-accent-sage text-xs font-mono">
                Curatorial Monograph
              </span>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#161716] leading-[1.05]">
                {collection.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#6B7068] font-light leading-relaxed">
                {collection.description ||
                  "A harmonious architectural suite conceived to eliminate visual dissonance. Proportioned, joined, and finished in unison so that each piece elevates the whole room."}
              </p>

              {/* Dossier Specs Table */}
              <div className="space-y-3 pt-4 border-t border-[#E2DCD2]/60 text-xs font-mono">
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#E2DCD2]/40 gap-1">
                  <span className="text-[#6B7068]">Primary Hardwood</span>
                  <span className="font-semibold text-[#161716] sm:text-right">{meta.hardwood}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#E2DCD2]/40 gap-1">
                  <span className="text-[#6B7068]">Curatorial Practice</span>
                  <span className="font-semibold text-[#161716] sm:text-right">{meta.curator}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#E2DCD2]/40 gap-1">
                  <span className="text-[#6B7068]">Spatial Scale</span>
                  <span className="font-semibold text-[#161716] sm:text-right">
                    {meta.dimensionsRecommendation}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 gap-1">
                  <span className="text-[#6B7068]">Delivery Standard</span>
                  <span className="font-semibold text-[#4A5E4C] sm:text-right">
                    White-Glove Cairo Hand Placement
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2DCD2]/60 flex flex-wrap items-center gap-4">
              <Link
                href="/design-consultation"
                className="inline-flex items-center gap-2 rounded-full bg-[#161716] px-6 py-3.5 text-xs font-medium text-white shadow-[0_4px_16px_-4px_rgba(22,23,22,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-[#374739] active:scale-95 transition-all"
              >
                <span>Commission Complete Suite</span>
                <span>↗</span>
              </Link>
              <span className="text-[11px] text-[#6B7068] font-mono">
                ✦ Bespoke sizing available for residential commissions
              </span>
            </div>
          </div>

          {/* Right: Architectural Atmosphere Showcase */}
          <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-[540px] overflow-hidden bg-[#EDE7DC]">
            <Image
              src={heroImageSrc}
              alt={collection.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <span className="pill-accent-dark text-[10px] font-mono">
                {meta.series}
              </span>
              <span className="text-[11px] font-mono text-white/80">
                Cairo Architectural Workshop
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CURATED PIECES EXHIBITION ── */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2DCD2]/70 pb-5">
          <div className="space-y-1">
            <span className="pill-accent-sage text-xs font-mono">Series Catalog</span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#161716]">
              Pieces Comprising This Collection
            </h2>
          </div>
          <p className="text-xs font-mono text-[#6B7068]">
            Showing {products.length} {products.length === 1 ? "Piece" : "Pieces"} · In Stock in Cairo
          </p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} columns={3} />
        ) : (
          <div className="glass-card p-16 text-center space-y-3">
            <EmptyState
              title="Series Currently Being Handcrafted"
              description="Our master woodworkers are finishing pieces for this collection in the Cairo workshop."
            />
          </div>
        )}
      </div>

      {/* ── SPATIAL INTEGRATION ADVISORY ── */}
      <div className="glass-card-sand p-8 sm:p-12 space-y-6">
        <div className="space-y-2">
          <span className="pill-accent-sage text-xs font-mono">Architectural Guidelines</span>
          <h3 className="font-display text-2xl sm:text-3xl text-[#161716]">
            Spatial Flow & Lighting Harmony
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-2 text-xs">
          <div className="glass-card p-6 space-y-2">
            <span className="font-mono text-[10px] uppercase text-[#4A5E4C] font-semibold block">
              01 · Proportions & Circulation
            </span>
            <p className="text-[#161716] font-semibold text-sm">Clearance Guidelines</p>
            <p className="text-[#6B7068] leading-relaxed font-light">
              Allow at least 90cm of perimeter walkway around each piece to let the monolithic wood profiles breathe within the room.
            </p>
          </div>

          <div className="glass-card p-6 space-y-2">
            <span className="font-mono text-[10px] uppercase text-[#4A5E4C] font-semibold block">
              02 · Lighting Atmosphere
            </span>
            <p className="text-[#161716] font-semibold text-sm">Warm Spectrum</p>
            <p className="text-[#6B7068] leading-relaxed font-light">
              {meta.lightRecommendation}. Avoid harsh direct downlights to prevent unnatural timber grain highlights.
            </p>
          </div>

          <div className="glass-card p-6 space-y-2">
            <span className="font-mono text-[10px] uppercase text-[#4A5E4C] font-semibold block">
              03 · Whole-Home Integration
            </span>
            <p className="text-[#161716] font-semibold text-sm">Custom Tailoring</p>
            <p className="text-[#6B7068] leading-relaxed font-light">
              Our architects can customize timber stains, fabric weaves, and dimensions to seamlessly align with your residence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
