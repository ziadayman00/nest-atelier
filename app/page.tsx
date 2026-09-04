import Link from "next/link";
import Image from "next/image";
import { catalogApi } from "@/lib/api/catalog";
import { HeroTicker } from "@/components/layout/hero-ticker";
import { ProductCard } from "@/components/catalog/product-card";
import { BentoInteractiveHero } from "@/components/home/bento-interactive-hero";
import { getAtmosphereMeta } from "@/lib/data/atmosphere-data";

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof catalogApi.getProducts>>["products"] = [];
  let categories: Awaited<ReturnType<typeof catalogApi.getCategories>>["categories"] = [];

  try {
    const [productsData, categoriesData] = await Promise.all([
      catalogApi.getProducts({ limit: 6, sort: "newest" }),
      catalogApi.getCategories(),
    ]);
    featured = productsData.products;
    categories = categoriesData.categories;
  } catch {
    // backend offline fallback
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-4 sm:py-6 space-y-12 sm:space-y-24">

      {/* ============================================================
          SECTION 1: BESPOKE INTERACTIVE ATELIER HERO
          ============================================================ */}
      <section>
        <BentoInteractiveHero />
      </section>

      {/* ============================================================
          SECTION 2: RUNNING ARCHITECTURAL TICKER
          ============================================================ */}
      <section className="-mx-4 sm:-mx-8 lg:-mx-14 overflow-hidden">
        <HeroTicker />
      </section>

      {/* ============================================================
          SECTION 3: MATERIAL & ARCHITECTURAL LABORATORY (3 COLS)
          ============================================================ */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E2DCD2]/70">
          <div>
            <span className="pill-accent-sage text-xs font-mono">Workshop Dossier</span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#161716] mt-2">
              Egyptian Woodcraft & Joinery Standards
            </h2>
          </div>
          <p className="text-xs text-[#6B7068] font-light max-w-sm">
            Milled from monolithic timber logs. Zero MDF, zero particle boards, and zero disposable shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* ── BENTO CARD 1: Wood Grain Macro Visual (4 Cols) ── */}
          <div className="md:col-span-4 bento-card relative overflow-hidden min-h-[360px] group p-8 flex flex-col justify-between border border-[#E2DCD2]">
            <Image
              src="/material-wood.jpg"
              alt="Solid Egyptian Oak Grain Detail"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161716]/95 via-[#161716]/40 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="pill-accent-dark text-xs font-mono">01 / Material Lab</span>
              <span className="text-white/70 text-xs font-mono">1,360 Janka</span>
            </div>

            <div className="relative z-10 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D8E2D6] font-mono">
                Solid Egyptian Hardwoods
              </p>
              <h3 className="font-display text-2xl sm:text-3xl text-white leading-snug">
                Zero Veneers. Zero Shortcuts.
              </h3>
              <p className="text-xs text-white/75 font-light leading-relaxed">
                Milled from dense hardwood slabs and conditioned with slow, hand-rubbed organic beeswax and oils.
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-[11px] text-[#D8E2D6] font-mono">Mortise & Tenon Joinery</span>
                <Link href="/products" className="arrow-badge-btn shrink-0 text-xs bg-white/20 text-white group-hover:bg-white group-hover:text-[#161716]">
                  ↗
                </Link>
              </div>
            </div>
          </div>

          {/* ── BENTO CARD 2: Architect Consultation Blueprint (4 Cols) ── */}
          <div className="md:col-span-4 bento-card-sand p-8 flex flex-col justify-between space-y-6 group border border-[#E2DCD2]">
            <div className="flex items-center justify-between">
              <span className="pill-accent-sage text-xs font-mono">02 / Spatial Service</span>
              <span className="text-xs text-[#6B7068] font-mono">Custom Curations</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-3xl sm:text-4xl text-[#161716] leading-snug">
                Have a floor plan or room dimensions?
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7068] leading-relaxed font-light">
                Share your architectural drawings or room photographs. Our Cairo studio curates custom timber proportions tailored precisely to your spatial flow.
              </p>
            </div>

            <Link
              href="/design-consultation"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E2DCD2] hover:bg-[#161716] hover:text-white transition-all duration-300 group/btn shadow-xs"
            >
              <span className="text-xs font-semibold uppercase tracking-wider">Start Spatial Consultation</span>
              <span className="arrow-badge-btn shrink-0 text-xs bg-[#161716] text-white group-hover/btn:bg-[#4A5E4C]">↗</span>
            </Link>
          </div>

          {/* ── BENTO CARD 3: Sculptural Feature Visual (4 Cols) ── */}
          <div className="md:col-span-4 bento-card relative overflow-hidden min-h-[360px] group p-8 flex flex-col justify-between border border-[#E2DCD2]">
            <Image
              src="/bento-sculpture.jpg"
              alt="Sculptural Furniture Piece"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161716]/90 via-[#161716]/30 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="pill-accent-dark text-xs font-mono">03 / Atelier Series</span>
              <span className="text-white/70 text-xs font-mono">Limited Run</span>
            </div>

            <div className="relative z-10 space-y-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D8E2D6] font-mono">
                  Sculptural Monoliths
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-white">
                  The Sage Atelier Stool
                </h3>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/95 backdrop-blur-md text-xs text-[#161716] shadow-md">
                <span className="font-semibold">Turned Solid Timber</span>
                <Link href="/products" className="arrow-badge-btn shrink-0 text-xs bg-[#161716] text-white group-hover:bg-[#4A5E4C]">↗</Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION 4: ATMOSPHERES GALLERY (IMAGE-DRIVEN ARCHITECTURAL CATEGORIES)
          ============================================================ */}
      {categories.length > 0 && (
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E2DCD2]/70">
            <div>
              <span className="pill-accent-sage text-xs font-mono">Spatial Atmospheres</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#161716] mt-2">
                Every space, intentionally curated.
              </h2>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B7068] hover:text-[#161716] transition-colors"
            >
              <span>Explore All Categories</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat, i) => {
              const meta = getAtmosphereMeta(cat.slug, i);
              return (
                <Link
                  key={cat.id}
                  href={`/products?categorySlug=${cat.slug || cat.id}`}
                  className="group relative flex flex-col justify-between min-h-[380px] rounded-[28px] overflow-hidden border border-[#E2DCD2]/80 shadow-xs hover:shadow-xl transition-all duration-700 p-7"
                >
                  {/* Atmosphere Background Image */}
                  <Image
                    src={meta.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161716]/95 via-[#161716]/40 to-black/25 transition-opacity duration-500 group-hover:via-[#161716]/30" />

                  {/* Top Bar: Index & Arrow */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="pill-accent-dark text-[11px] font-mono backdrop-blur-md">
                      Atmosphere 0{i + 1}
                    </span>
                    <span className="arrow-badge-btn h-8 w-8 text-xs bg-white/20 text-white backdrop-blur-md group-hover:bg-white group-hover:text-[#161716]">
                      ↗
                    </span>
                  </div>

                  {/* Bottom Text */}
                  <div className="relative z-10 space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#D8E2D6]">
                      {meta.subtitle}
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl text-white group-hover:text-[#D8E2D6] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-white/70 font-light line-clamp-2 leading-relaxed">
                      {cat.description || `Architectural furniture handcrafted for ${cat.name.toLowerCase()} environments.`}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-white/20 text-[10px] text-white/60 font-mono">
                      <span>{meta.hardwood}</span>
                      <span>View Pieces →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================
          SECTION 5: FEATURED FURNITURE (UNBOXED ARCHITECTURAL EXHIBITION)
          ============================================================ */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E2DCD2]/70">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="pill-accent-sage text-xs font-mono">Atelier Collection</span>
              <span className="text-xs text-[#6B7068] font-mono">· In Stock & Made-to-Order</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#161716] mt-2">
              Current Atelier Creations
            </h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B7068] hover:text-[#161716] transition-colors"
          >
            <span>View Complete Collection</span>
            <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center space-y-2 border border-dashed border-[#E2DCD2] rounded-3xl bg-white/60">
            <p className="font-display text-2xl text-[#6B7068]">Collection currently refreshing.</p>
            <p className="text-xs text-[#6B7068] font-light">Explore our archive or contact our Cairo workshop.</p>
          </div>
        )}
      </section>

      {/* ============================================================
          SECTION 6: ARCHITECT'S DRAFTING BANNER & SPATIAL CONSULTATION
          ============================================================ */}
      <section className="bento-card-sage p-10 sm:p-16 relative overflow-hidden rounded-[32px] border border-[#4A5E4C]/50 shadow-xl">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-mono text-white border border-white/20 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            <span>Cairo Architectural Planning Service</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.08]">
            Your space, designed by architects — not algorithms.
          </h2>

          <p className="text-sm sm:text-base text-white/85 leading-relaxed font-light">
            Share photos of your rooms and floor plan drawings. Our Cairo interior architects will evaluate your spatial geometry, daylight exposure, and wood finish palette to craft a customized furniture layout.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-white/90 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <span className="text-[#D8E2D6] font-bold">01.</span> Room Assessment
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <span className="text-[#D8E2D6] font-bold">02.</span> 1:50 Scale Layout
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <span className="text-[#D8E2D6] font-bold">03.</span> Direct Delivery
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/design-consultation"
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#161716] hover:bg-[#EDE7DC] transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Book Spatial Consultation</span>
              <span className="arrow-badge-btn shrink-0 bg-[#161716] text-white">↗</span>
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-3 rounded-full border border-white/40 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/15 transition-all cursor-pointer backdrop-blur-xs"
            >
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
