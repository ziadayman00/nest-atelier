export interface AtmosphereMeta {
  image: string;
  subtitle: string;
  hardwood: string;
  dimensions: string;
}

export const ATMOSPHERE_DATA: Record<string, AtmosphereMeta> = {
  "living-sanctuary": {
    image: "/products/karnak-sofa.jpg",
    subtitle: "Sculptural Lounge & Centerpieces",
    hardwood: "Smoked Egyptian Walnut",
    dimensions: "Living Spaces · Proportions 1:1.6",
  },
  "dining-banquet": {
    image: "/products/soliman-dining-table.jpg",
    subtitle: "Monolithic Tables & Gathering Seating",
    hardwood: "Solid White Oak",
    dimensions: "Dining Rooms · 6 to 12 Seats",
  },
  "rest-chamber": {
    image: "/products/zamalek-bed.jpg",
    subtitle: "Tactile Platform Beds & Suites",
    hardwood: "Danish Solid Oak & Linen",
    dimensions: "Master Suites · Minimalist Elevation",
  },
  "study-bureau": {
    image: "/products/nile-curve-chair.jpg",
    subtitle: "Ergonomic Hardwood Bureau Seating",
    hardwood: "Cairo European Beech",
    dimensions: "Private Studies · Sculptural Contour",
  },
  "architectural-objects": {
    image: "/products/maadi-coffee-table.jpg",
    subtitle: "Travertine & Turned Timber Vessels",
    hardwood: "Organic Hardwood & Stone",
    dimensions: "Accent Surfaces · Monolithic Form",
  },
};

export function getAtmosphereMeta(slug?: string, index: number = 0): AtmosphereMeta {
  if (slug && ATMOSPHERE_DATA[slug]) {
    return ATMOSPHERE_DATA[slug];
  }
  const fallbackList: AtmosphereMeta[] = [
    {
      image: "/hero-room.jpg",
      subtitle: "Living Space Architecture",
      hardwood: "Solid Egyptian Walnut",
      dimensions: "Living Spaces",
    },
    {
      image: "/products/soliman-dining-table.jpg",
      subtitle: "Dining & Banquet Craft",
      hardwood: "Solid Danish Oak",
      dimensions: "Gathering Spaces",
    },
    {
      image: "/products/zamalek-bed.jpg",
      subtitle: "Bedroom Suites",
      hardwood: "Smoked Ash & Linen",
      dimensions: "Private Quarters",
    },
    {
      image: "/products/nile-curve-chair.jpg",
      subtitle: "Study & Office Bureau",
      hardwood: "Natural Cairo Beech",
      dimensions: "Workspaces",
    },
    {
      image: "/products/maadi-coffee-table.jpg",
      subtitle: "Sculptural Accents",
      hardwood: "Hardwood & Marble",
      dimensions: "Atelier Objects",
    },
  ];

  return fallbackList[index % fallbackList.length];
}
