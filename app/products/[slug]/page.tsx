import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { catalogApi } from "@/lib/api/catalog";
import { ProductDetailClient } from "@/components/catalog/product-detail-client";
import { ApiError } from "@/lib/api/client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { product } = await catalogApi.getProduct(slug);
    return {
      title: product.name,
      description: product.description.slice(0, 160),
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const { product } = await catalogApi.getProduct(slug);

    return (
      <div className="w-full px-6 sm:px-10 lg:px-14 py-6 space-y-6">
        {/* Bento Breadcrumb Header Card */}
        <div className="bento-card px-8 py-4">
          <nav className="flex items-center gap-2.5 text-xs" aria-label="Breadcrumb">
            <Link href="/" className="font-semibold text-[#6B7068] hover:text-[#161716] transition-colors">
              NEST
            </Link>
            <span className="text-[#6B7068]/40">/</span>
            <Link href="/products" className="font-semibold text-[#6B7068] hover:text-[#161716] transition-colors">
              Atelier Furniture
            </Link>
            {product.category && (
              <>
                <span className="text-[#6B7068]/40">/</span>
                <Link
                  href={`/products?category=${product.category.id}`}
                  className="font-semibold text-[#6B7068] hover:text-[#161716] transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="text-[#6B7068]/40">/</span>
            <span className="font-semibold text-[#161716]">{product.name}</span>
          </nav>
        </div>

        {/* Product Bento Content */}
        <div>
          <ProductDetailClient product={product} />
        </div>
      </div>
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}
