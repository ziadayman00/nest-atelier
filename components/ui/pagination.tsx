import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}

export function Pagination({ page, totalPages, basePath, query = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={cn(
          "rounded-md border border-nest-border px-3 py-1.5 text-sm",
          page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-nest-cream",
        )}
      >
        Previous
      </Link>
      <span className="text-sm text-nest-warm-gray">
        Page {page} of {totalPages}
      </span>
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={cn(
          "rounded-md border border-nest-border px-3 py-1.5 text-sm",
          page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-nest-cream",
        )}
      >
        Next
      </Link>
    </nav>
  );
}
