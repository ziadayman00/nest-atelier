"use client";

const TICKER_ITEMS = [
  "Solid Cairo Hardwood",
  "Handcrafted in Egypt",
  "White-Glove Delivery",
  "Bespoke Spatial Customization",
  "Interior Architecture Studio",
  "Mortise & Tenon Joinery",
  "Zero Veneer Shortcuts",
];

export function HeroTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bento-card bg-[#181A18] text-white py-3.5 px-4 overflow-hidden select-none">
      <div className="animate-ticker flex items-center gap-0">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-0 shrink-0">
            <span className="text-xs font-medium tracking-wide px-6 whitespace-nowrap text-white/80">
              {item}
            </span>
            <span className="text-[#8BA888] text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
