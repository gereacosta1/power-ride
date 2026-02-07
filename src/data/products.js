// src/data/products.js

// Helpers
function slugify(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function specsObjectToList(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj).map(([k, v]) => {
    const key = String(k).replace(/-/g, " ");
    return `${key}: ${v}`;
  });
}

function listToSpecs(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => String(x)).filter(Boolean);
}

function normalizeCategory(raw) {
  const c = String(raw || "").trim().toLowerCase();

  // Scooters (main)
  if (c === "scooter" || c === "scooters" || c === "electric scooters") return "scooter";

  // Solar (reserved)
  if (c === "solar" || c === "solar energy" || c === "solar-energy") return "solar";

  // JBL / speakers
  if (c === "speaker" || c === "speakers" || c === "jbl" || c === "audio") return "speaker";

  // Keep other categories if you want them visible; otherwise return "other"
  return c || "other";
}

// Source data (from Riders JSON you sent)
const ridersJson = [
  {
    id: 1,
    title: "E2 PLUS II Electric Scooter",
    category: "scooter",
    price: 700,
    image: "/E2-PLUS-II-Electric-Scooter.png",
    description: "Powerful and efficient electric scooter.",
    specs: { engine: "500cc", weight: "168kg", warranty: "12 months" },
    inStock: true,
    badge: "New",
  },
  {
    id: 2,
    title: "F3 Electric Scooter",
    category: "scooter",
    price: 900,
    image: "/F3-Electric-Scooter.png",
    description: "High-performance electric scooter.",
    specs: { range: "120km", power: "5kW", "top-speed": "90km/h" },
    inStock: true,
    badge: "12-Month Warranty",
  },
  {
    id: 3,
    title: "Freego E4 Pro",
    category: "bicycle",
    price: 2000,
    image: "/Freego-E4-Pro.png",
    description: "High-performance bicycle tire.",
    specs: { size: "120/70 R17", compound: "dual" },
    inStock: true,
    badge: "Bestseller",
  },
  {
    id: 4,
    title: "Freego eFlex Raptor E1",
    category: "bicycle",
    price: 1000,
    image: "/Freego-eFlex-Raptor-E1.png",
    description: "Compact, powerful Bluetooth speaker.",
    specs: { battery: "12h", waterproof: "IPX5" },
    inStock: true,
    badge: "Hot",
  },
  {
    id: 5,
    title: "Freego Flash F3 Pro",
    category: "bicycle",
    price: 3400,
    image: "/Freego-Flash-F3-Pro.png",
    description: "Compact, powerful Bluetooth speaker.",
    specs: { battery: "12h", waterproof: "IPX5" },
    inStock: true,
    badge: "Hot",
  },
  {
    id: 6,
    title: "Freego Shotgun F2 Pro Max",
    category: "motorcycle",
    price: 3000,
    image: "/Freego-Shotgun-F2-Pro-Max.png",
    description: "Compact, powerful Bluetooth speaker.",
    specs: { battery: "12h", waterproof: "IPX5" },
    inStock: true,
    badge: "Hot",
  },
  {
    id: 7,
    title: "Freego Shotgun Prime F2 Pro",
    category: "motorcycle",
    price: 3800,
    image: "/Freego-Shotgun-Prime-F2-Pro.png",
    description: "Compact, powerful Bluetooth speaker.",
    specs: { battery: "12h", waterproof: "IPX5" },
    inStock: true,
    badge: "Hot",
  },
  {
    id: 8,
    title: "Freego X2 Dirt Master Off-Road",
    category: "motorcycle",
    price: 4000,
    image: "/Freego-X2-Dirt-Master-Off-Road-eBike.png",
    description: "Compact, powerful Bluetooth speaker.",
    specs: { battery: "12h", waterproof: "IPX5" },
    inStock: true,
    badge: "Hot",
  },
  {
    id: 9,
    title: "Segway Ninebot S2 Self-Balancing Scooter",
    category: "scooter",
    price: 150,
    image: "/Segway-Ninebot-S2-Self-Balancing-Scooter.png",
    description: "Compact, powerful Bluetooth speaker.",
    specs: { battery: "12h", waterproof: "IPX5" },
    inStock: true,
    badge: "Hot",
  },
];

// ---------- PARLANTES JBL ----------
const jblJson = [
  {
    id: 21,
    title: "JBL Charge 4",
    category: "speaker",
    price: 150,
    image: "/IMG/jbl-charge-4.jpeg",
    description:
      "Parlante JBL Charge 4 con batería de larga duración y sonido potente para interior y exterior.",
    specs: ["Bluetooth", "Resistente al agua", "Batería recargable"],
    inStock: true,
    badge: "Featured",
  },
  {
    id: 22,
    title: "JBL GO 4",
    category: "speaker",
    price: 50,
    image: "/IMG/jbl-go-4.jpeg",
    description: "Parlante ultra compacto para llevar en el bolsillo. Ideal para uso diario.",
    specs: ["Bluetooth", "Tamaño compacto", "Hasta 8h de batería"],
    inStock: true,
    badge: "New",
  },
  {
    id: 23,
    title: "JBL Party Box",
    category: "speaker",
    price: 800,
    image: "/IMG/jbl-party-box.jpeg",
    description:
      "JBL Party Box con luces LED y sonido de alta potencia, perfecto para eventos y fiestas.",
    specs: ["Alta potencia", "Luces LED", "Entradas para micrófono"],
    inStock: true,
    badge: "Featured",
  },
  {
    id: 24,
    title: "JBL Flip 6",
    category: "speaker",
    price: 200,
    image: "/IMG/jbl-flip-6.jpeg",
    description:
      "Parlante JBL Flip 6 resistente al agua, con sonido equilibrado y fácil de transportar.",
    specs: ["Bluetooth", "Resistente al agua", "Diseño portátil"],
    inStock: true,
    badge: "New",
  },
];

// Placeholder for Solar Energy (empty for now)
const solarJson = [
  // Add future products here with category: "solar"
];

// Merge all sources
const source = [...ridersJson, ...jblJson, ...solarJson];

// Adapt to Power Ride format
export const products = source.map((p) => {
  const rawTitle = p.title || p.name || "";
  const rawSpecs = p.specs;

  return {
    id: String(p.id),
    slug: slugify(rawTitle),
    name: rawTitle,
    category: normalizeCategory(p.category),
    price: Number(p.price || 0),
    image: p.image,
    short: p.description || "",
    specs: Array.isArray(rawSpecs) ? listToSpecs(rawSpecs) : specsObjectToList(rawSpecs),
    badge: p.badge || "",
    inStock: p.inStock !== false,
  };
});

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}
