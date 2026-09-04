/**
 * NEST Atelier — Official Brand Logo Component
 *
 * Icon mark: three concentric tapering arcs — reads as a stylized nest,
 * wood cross-section layers, and a sheltering roof. Architectural, timeless.
 *
 * Variants:
 *   "full"      — icon + wordmark + subtext (navbar, hero)
 *   "compact"   — icon + wordmark, no subtext (tight spaces)
 *   "icon"      — icon mark only (favicon, mobile, seals)
 *   "wordmark"  — text lockup only (footer secondary use)
 *
 * Colors:
 *   "dark"      — charcoal on transparent (default, light backgrounds)
 *   "light"     — ivory on transparent (dark/sage backgrounds)
 *   "sage"      — sage accent mark + charcoal text
 */

import { cn } from "@/lib/utils/cn";

interface NestLogoProps {
  variant?: "full" | "compact" | "icon" | "wordmark";
  color?: "dark" | "light" | "sage";
  className?: string;
  /** Icon stroke width — thinner for large sizes, slightly thicker for small */
  strokeWidth?: number;
}

/* ── BRAND COLORS ── */
const CHARCOAL = "#161716";
const IVORY    = "#FAFAF7";
const SAGE     = "#4A5E4C";

/** The three-arc nest icon mark — pure SVG, infinitely scalable */
function NestIconMark({
  stroke,
  strokeWidth = 1.6,
  size = 28,
}: {
  stroke: string;
  strokeWidth?: number;
  size?: number;
}) {
  /**
   * Three arcs, each arc is a flat quadratic Bézier curve.
   * The control point pulls each arc upward, creating a gentle bow.
   * Bottom = widest, top = narrowest — reads as stacked wood layers / nest.
   *
   * Viewport: 40 × 26 — proportional to a wide landscape icon.
   */
  return (
    <svg
      width={size}
      height={Math.round(size * 0.65)}
      viewBox="0 0 40 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bottom arc — widest, most pronounced bow */}
      <path
        d="M 3 22 Q 20 11 37 22"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Middle arc */}
      <path
        d="M 8 15 Q 20 5.5 32 15"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top arc — narrowest */}
      <path
        d="M 14 8.5 Q 20 2 26 8.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NestLogo({
  variant = "full",
  color = "dark",
  className,
  strokeWidth,
}: NestLogoProps) {
  const stroke =
    color === "light"
      ? IVORY
      : color === "sage"
      ? SAGE
      : CHARCOAL;

  const wordmarkColor =
    color === "light" ? "text-[#FAFAF7]" : "text-[#161716]";

  const subtextColor =
    color === "light" ? "text-white/60" : "text-[#6B7068]";

  /* Icon-only variant */
  if (variant === "icon") {
    return (
      <span className={cn("inline-flex items-center justify-center", className)}>
        <NestIconMark stroke={stroke} strokeWidth={strokeWidth ?? 1.8} size={32} />
      </span>
    );
  }

  /* Wordmark-only variant */
  if (variant === "wordmark") {
    return (
      <span className={cn("inline-flex flex-col", className)}>
        <span
          className={cn("font-display text-2xl font-normal tracking-[0.22em] uppercase leading-none", wordmarkColor)}
        >
          NEST
        </span>
        <span
          className={cn("font-sans text-[9px] font-semibold tracking-[0.3em] uppercase mt-0.5", subtextColor)}
        >
          Atelier · Cairo
        </span>
      </span>
    );
  }

  /* Compact variant — icon + wordmark, no subtext */
  if (variant === "compact") {
    return (
      <span className={cn("inline-flex items-center gap-3", className)}>
        <NestIconMark stroke={stroke} strokeWidth={strokeWidth ?? 1.6} size={30} />
        <span
          className={cn("font-display text-[22px] font-normal tracking-[0.2em] uppercase leading-none", wordmarkColor)}
        >
          NEST
        </span>
      </span>
    );
  }

  /* Full variant — icon + wordmark + subtext (default) */
  return (
    <span className={cn("inline-flex items-center gap-3.5", className)}>
      <NestIconMark stroke={stroke} strokeWidth={strokeWidth ?? 1.5} size={32} />
      <span className="flex flex-col">
        <span
          className={cn(
            "font-display text-[22px] font-normal tracking-[0.22em] uppercase leading-none",
            wordmarkColor
          )}
        >
          NEST
        </span>
        <span
          className={cn(
            "font-sans text-[9px] font-semibold tracking-[0.28em] uppercase mt-[3px] hidden sm:block",
            subtextColor
          )}
        >
          Atelier · Cairo
        </span>
      </span>
    </span>
  );
}
