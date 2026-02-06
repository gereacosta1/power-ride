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
    badge: "New"
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
    badge: "12-Month Warranty"
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
    badge: "Bestseller"
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
    badge: "Hot"
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
    badge: "Hot"
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
    badge: "Hot"
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
    badge: "Hot"
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
    badge: "Hot"
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
    badge: "Hot"
  }
];

// Adapt to Power Ride format
export const products = ridersJson.map((p) => ({
  id: String(p.id),
  slug: slugify(p.title),
  name: p.title,
  category: p.category, // keep if you want filters later
  price: Number(p.price || 0),
  image: p.image,
  short: p.description || "",
  specs: specsObjectToList(p.specs),
  badge: p.badge || "",
  inStock: Boolean(p.inStock)
}));

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}
