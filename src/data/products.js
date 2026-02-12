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

// Normaliza rutas de imágenes.
// Si empieza con "/" la dejamos.
// Si viene vacío, devolvemos "".
function normalizeImage(path) {
  const p = String(path || "").trim();
  if (!p) return "";
  if (p.startsWith("/")) return p;
  return `/${p}`;
}

// -------------------- SCOOTERS (tu JSON actual) --------------------
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

// Adapt scooters
const scooterProducts = ridersJson.map((p) => ({
  id: String(p.id),
  slug: slugify(p.title),
  name: p.title,
  category: p.category,
  price: Number(p.price || 0),
  image: normalizeImage(p.image),
  short: p.description || "",
  specs: specsObjectToList(p.specs),
  badge: p.badge || "",
  inStock: Boolean(p.inStock)
}));

// -------------------- JBL SPEAKERS (fix rutas a /public root) --------------------
const jblProducts = [
  {
    id: "21",
    name: "JBL Charge 4",
    category: "audio",
    price: 150,
    image: "/jbl-charge-4.jpeg",
    short: "Parlante JBL Charge 4 con batería de larga duración y sonido potente para interior y exterior.",
    specs: ["Bluetooth", "Resistente al agua", "Batería recargable"],
    badge: "Featured",
    inStock: true
  },
  {
    id: "22",
    name: "JBL GO 4",
    category: "audio",
    price: 50,
    image: "/jbl-go-4.jpeg",
    short: "Parlante ultra compacto para llevar en el bolsillo. Ideal para uso diario.",
    specs: ["Bluetooth", "Tamaño compacto", "Hasta 8h de batería"],
    badge: "New",
    inStock: true
  },
  {
    id: "23",
    name: "JBL Party Box",
    category: "audio",
    price: 800,
    image: "/jbl-party-box.jpeg",
    short: "JBL Party Box con luces LED y sonido de alta potencia, perfecto para eventos y fiestas.",
    specs: ["Alta potencia", "Luces LED", "Entradas para micrófono"],
    badge: "Featured",
    inStock: true
  },
  {
    id: "24",
    name: "JBL Flip 6",
    category: "audio",
    price: 200,
    image: "/jbl-flip-6.jpeg",
    short: "Parlante JBL Flip 6 resistente al agua, con sonido equilibrado y fácil de transportar.",
    specs: ["Bluetooth", "Resistente al agua", "Diseño portátil"],
    badge: "New",
    inStock: true
  }
].map((p) => ({
  ...p,
  slug: slugify(p.name),
  image: normalizeImage(p.image),
  specs: Array.isArray(p.specs) ? p.specs : []
}));

// -------------------- SOLAR (ahora SI, con tus imágenes) --------------------
const SOLAR_IMG = "/img/solar-products";

const solarProducts = [
  {
    id: "s1",
    name: "EBL Portable Power Station 2400W (1843Wh)",
    category: "solar",
    price: 579.98,
    image: `${SOLAR_IMG}/ebl-ps-2400w-1843wh.webp`,
    short: "Portable power station for home backup, camping and off-grid use. Multiple AC outlets and fast charging.",
    specs: ["2400W inverter", "1843Wh capacity", "Multiple AC/USB outputs"],
    badge: "Deal",
    inStock: true
  },
  {
    id: "s2",
    name: "FOSSIBOT F2400 Power Station 2400W (2048Wh)",
    category: "solar",
    price: 599.0,
    image: `${SOLAR_IMG}/fossibot-f2400-2048wh.webp`,
    short: "High-capacity LiFePO4 power station with strong AC output and solar charging support.",
    specs: ["2400W (peak higher)", "2048Wh LiFePO4", "Solar charging supported"],
    badge: "Popular",
    inStock: true
  },
  {
    id: "s3",
    name: "EcoFlow DELTA Pro (3600Wh)",
    category: "solar",
    price: 1599.0,
    image: `${SOLAR_IMG}/ecoflow-delta-pro-3600wh.jpg`,
    short: "Expandable home backup power with fast charging and strong AC output for demanding loads.",
    specs: ["3600Wh capacity", "Expandable ecosystem", "Fast charging"],
    badge: "Featured",
    inStock: true
  },
  {
    id: "s4",
    name: "EcoFlow DELTA Pro 3 (4096Wh)",
    category: "solar",
    price: 1999.0,
    image: `${SOLAR_IMG}/ecoflow-delta-pro-3-4096wh.jpg`,
    short: "Next-gen LiFePO4 home backup with 120/240V output and high surge capacity (model dependent).",
    specs: ["4096Wh LiFePO4", "120/240V output", "High surge capacity"],
    badge: "New",
    inStock: true
  },
  {
    id: "s5",
    name: "OUPES 6000W Power Station (4096Wh)",
    category: "solar",
    price: 1699.98,
    image: `${SOLAR_IMG}/oupes-6000-4096wh.webp`,
    short: "High-output station for bigger appliances. Designed for backup and off-grid setups.",
    specs: ["6000W output (model dependent)", "4096Wh LiFePO4", "Expandable options"],
    badge: "High Power",
    inStock: true
  },
  {
    id: "s6",
    name: "EcoFlow Smart Home Panel 2",
    category: "solar",
    price: 1599.0,
    image: `${SOLAR_IMG}/ecoflow-smart-home-panel-2.webp`,
    short: "Smart transfer panel to integrate EcoFlow systems with home circuits (compatible models required).",
    specs: ["Smart load management", "Home integration", "EcoFlow ecosystem"],
    badge: "Pro",
    inStock: true
  },
  {
    id: "s7",
    name: "EcoFlow DELTA Pro Ultra",
    category: "solar",
    price: 5999.95,
    image: `${SOLAR_IMG}/ecoflow-delta-pro-ultra.webp`,
    short: "High-end expandable whole-home backup ecosystem (pricing varies by configuration).",
    specs: ["Whole-home capable (config)", "Expandable", "Premium system"],
    badge: "Ultra",
    inStock: true
  },
  {
    id: "s8",
    name: "Portable Solar Panel 450W (38V) Foldable",
    category: "solar",
    price: 459.99,
    image: `${SOLAR_IMG}/panel-450w-38v-fold.jpg`,
    short: "Foldable high-watt solar panel for fast charging compatible power stations (check connectors).",
    specs: ["450W rated", "38V", "Foldable portable design"],
    badge: "Panel",
    inStock: true
  },
  {
    id: "s9",
    name: "LiFePO4 Battery 12V 100Ah (Bluetooth)",
    category: "solar",
    price: 169.99,
    image: `${SOLAR_IMG}/lifepo4-12v-100ah-bt.webp`,
    short: "12V 100Ah LiFePO4 battery with Bluetooth monitoring and integrated BMS.",
    specs: ["12V 100Ah", "Bluetooth monitoring", "BMS integrated"],
    badge: "Bluetooth",
    inStock: true
  },
  {
    id: "s10",
    name: "LiFePO4 Battery 12V 100Ah (Group 31)",
    category: "solar",
    price: 112.99,
    image: `${SOLAR_IMG}/lifepo4-12v-100ah-group31.avif`,
    short: "Group 31 form-factor 12V 100Ah LiFePO4 battery with integrated BMS for RV/solar setups.",
    specs: ["12V 100Ah", "Group 31 size", "BMS integrated"],
    badge: "Value",
    inStock: true
  }
].map((p) => ({
  ...p,
  slug: slugify(p.name),
  image: normalizeImage(p.image),
  specs: Array.isArray(p.specs) ? p.specs : []
}));

export const products = [...scooterProducts, ...jblProducts, ...solarProducts];

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category) {
  return products.filter(
    (p) =>
      (p.category || "").toLowerCase() ===
      String(category || "").toLowerCase()
  );
}
