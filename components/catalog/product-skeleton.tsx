import { cn } from "@/lib/utils/cn";

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse overflow-hidden rounded-lg bg-white", className)}
    >
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-nest-sand" />
      {/* Text placeholders */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 rounded bg-nest-sand" />
        <div className="h-4 w-3/4 rounded bg-nest-sand" />
        <div className="h-4 w-1/4 rounded bg-nest-sand" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
