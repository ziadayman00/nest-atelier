import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from "@/components/ui/spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "accent";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-[#181A18] text-white hover:bg-[#3F5241] active:scale-[0.98]",
  secondary: "bg-[#8BA888] text-white hover:bg-[#3F5241] active:scale-[0.98]",
  ghost: "bg-[#F2F3EF] border border-[#E0E2DC] text-[#181A18] hover:bg-[#E8E9E5] active:scale-[0.98]",
  outline: "border border-[#181A18] text-[#181A18] hover:bg-[#181A18] hover:text-white active:scale-[0.98]",
  accent: "bg-[#B86A44] text-white hover:bg-[#B86A44]/90 active:scale-[0.98]",
  danger: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs font-medium rounded-full",
  md: "px-6 py-3 text-sm font-medium rounded-full",
  lg: "px-8 py-4 text-base font-medium rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 font-sans transition-all duration-300 cursor-pointer select-none focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="h-4 w-4 text-current" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  ),
);

Button.displayName = "Button";
