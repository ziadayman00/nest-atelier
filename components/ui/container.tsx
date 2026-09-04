import { cn } from "@/lib/utils/cn";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-nest-hairline bg-nest-paper/80 p-6 sm:p-12 text-center shadow-nest">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-nest-sand/70 text-nest-sage font-display text-2xl">
        N
      </div>
      <h3 className="mt-4 font-display text-2xl text-nest-charcoal">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-nest-warm-gray leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
