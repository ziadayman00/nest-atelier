import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "muted";
  className?: string;
}

const variants = {
  default: "bg-nest-charcoal/10 text-nest-charcoal",
  success: "bg-nest-sage/15 text-nest-sage",
  warning: "bg-nest-clay/20 text-nest-warm-gray",
  muted: "bg-nest-border text-nest-warm-gray",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
