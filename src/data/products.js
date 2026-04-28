// src/data/products.js

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

function normalizeImage(path) {
  const p = String(path || "").trim();
  if (!p) return "";
  if (p.startsWith("/")) return p;
  return `/${p}`;
}

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
    description: "High-performance electric bike.",
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
    description: "Compact electric bike for daily rides.",
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
    description: "Premium electric bike with strong performance.",
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
    description: "Powerful electric ride with aggressive styling.",
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
    description: "Electric performance model with premium finish.",
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
    description: "Off-road electric model built for adventure.",
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
    description: "Self-balancing personal electric scooter.",
    specs: { battery: "12h", waterproof: "IPX5" },
    inStock: true,
    badge: "Hot",
  },
];

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
  inStock: Boolean(p.inStock),
  type: "single",
  includes: [],
}));

const jblProducts = [
  {
    id: "21",
    name: "JBL Charge 4",
    category: "audio",
    price: 150,
    image: "/jbl-charge-4.jpeg",
    short:
      "Parlante JBL Charge 4 con batería de larga duración y sonido potente para interior y exterior.",
    specs: ["Bluetooth", "Resistente al agua", "Batería recargable"],
    badge: "Featured",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "22",
    name: "JBL GO 4",
    category: "audio",
    price: 50,
    image: "/jbl-go-4.jpeg",
    short:
      "Parlante ultra compacto para llevar en el bolsillo. Ideal para uso diario.",
    specs: ["Bluetooth", "Tamaño compacto", "Hasta 8h de batería"],
    badge: "New",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "23",
    name: "JBL Party Box",
    category: "audio",
    price: 800,
    image: "/jbl-party-box.jpeg",
    short:
      "JBL Party Box con luces LED y sonido de alta potencia, perfecto para eventos y fiestas.",
    specs: ["Alta potencia", "Luces LED", "Entradas para micrófono"],
    badge: "Featured",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "24",
    name: "JBL Flip 6",
    category: "audio",
    price: 200,
    image: "/jbl-flip-6.jpeg",
    short:
      "Parlante JBL Flip 6 resistente al agua, con sonido equilibrado y fácil de transportar.",
    specs: ["Bluetooth", "Resistente al agua", "Diseño portátil"],
    badge: "New",
    inStock: true,
    type: "single",
    includes: [],
  },
].map((p) => ({
  ...p,
  slug: slugify(p.name),
  image: normalizeImage(p.image),
  specs: Array.isArray(p.specs) ? p.specs : [],
  includes: Array.isArray(p.includes) ? p.includes : [],
}));

const SOLAR_IMG = "/img/solar-products";

const solarProducts = [
  {
    id: "s1",
    name: "EBL Portable Power Station 2400W (1843Wh)",
    category: "solar",
    price: 579.98,
    image: `${SOLAR_IMG}/ebl-ps-2400w-1843wh.webp`,
    short:
      "Portable power station for home backup, camping and off-grid use. Multiple AC outlets and fast charging.",
    specs: ["2400W inverter", "1843Wh capacity", "Multiple AC/USB outputs"],
    badge: "Deal",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s2",
    name: "FOSSIBOT F2400 Power Station 2400W (2048Wh)",
    category: "solar",
    price: 599.0,
    image: `${SOLAR_IMG}/fossibot-f2400-2048wh.webp`,
    short:
      "High-capacity LiFePO4 power station with strong AC output and solar charging support.",
    specs: ["2400W (peak higher)", "2048Wh LiFePO4", "Solar charging supported"],
    badge: "Popular",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s3",
    name: "EcoFlow DELTA Pro (3600Wh)",
    category: "solar",
    price: 1599.0,
    image: `${SOLAR_IMG}/ecoflow-delta-pro-3600wh.jpg`,
    short:
      "Expandable home backup power with fast charging and strong AC output for demanding loads.",
    specs: ["3600Wh capacity", "Expandable ecosystem", "Fast charging"],
    badge: "Featured",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s4",
    name: "EcoFlow DELTA Pro 3 (4096Wh)",
    category: "solar",
    price: 1999.0,
    image: `${SOLAR_IMG}/ecoflow-delta-pro-3-4096wh.jpg`,
    short:
      "Next-gen LiFePO4 home backup with 120/240V output and high surge capacity.",
    specs: ["4096Wh LiFePO4", "120/240V output", "High surge capacity"],
    badge: "New",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s5",
    name: "OUPES 6000W Power Station (4096Wh)",
    category: "solar",
    price: 1699.98,
    image: `${SOLAR_IMG}/oupes-6000-4096wh.webp`,
    short:
      "High-output station for bigger appliances. Designed for backup and off-grid setups.",
    specs: ["6000W output", "4096Wh LiFePO4", "Expandable options"],
    badge: "High Power",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s7",
    name: "EcoFlow DELTA Pro Ultra",
    category: "solar",
    price: 5999.95,
    image: `${SOLAR_IMG}/ecoflow-delta-pro-ultra.webp`,
    short: "High-end expandable whole-home backup ecosystem.",
    specs: ["Whole-home capable", "Expandable", "Premium system"],
    badge: "Ultra",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s6",
    name: "EcoFlow Smart Home Panel 2",
    category: "solar",
    price: 1599.0,
    image: `${SOLAR_IMG}/ecoflow-smart-home-panel-2.webp`,
    short:
      "Smart transfer panel to integrate EcoFlow systems with home circuits.",
    specs: ["Smart load management", "Home integration", "EcoFlow ecosystem"],
    badge: "Pro",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s8",
    name: "Portable Solar Panel 450W (38V) Foldable",
    category: "solar",
    price: 459.99,
    image: `${SOLAR_IMG}/panel-450w-38v-fold.jpg`,
    short:
      "Foldable high-watt solar panel for fast charging compatible power stations.",
    specs: ["450W rated", "38V", "Foldable portable design"],
    badge: "Panel",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s9",
    name: "LiFePO4 Battery 12V 100Ah (Bluetooth)",
    category: "solar",
    price: 169.99,
    image: `${SOLAR_IMG}/lifepo4-12v-100ah-bt.webp`,
    short:
      "12V 100Ah LiFePO4 battery with Bluetooth monitoring and integrated BMS.",
    specs: ["12V 100Ah", "Bluetooth monitoring", "BMS integrated"],
    badge: "Bluetooth",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s10",
    name: "LiFePO4 Battery 12V 100Ah (Group 31)",
    category: "solar",
    price: 112.99,
    image: `${SOLAR_IMG}/lifepo4-12v-100ah-group31.avif`,
    short:
      "Group 31 form-factor 12V 100Ah LiFePO4 battery with integrated BMS for RV and solar setups.",
    specs: ["12V 100Ah", "Group 31 size", "BMS integrated"],
    badge: "Value",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s11",
    name: "Kit Solar Off Grid",
    category: "solar",
    price: 3500,
    image: "/img/kit-solar-off-grid.jpeg",
    short:
      "Complete off-grid solar kit for backup and independent energy setups.",
    specs: ["Off-grid setup", "Ready-to-install bundle", "Ideal for backup power"],
    badge: "KIT",
    inStock: true,
    type: "kit",
    includes: ["Solar panel", "Battery", "Inverter", "Cables"],
  },
  {
    id: "s12",
    name: "Combo Energia Solar",
    category: "solar",
    price: 1499,
    image: "/img/combo-energia-solar.jpeg",
    short:
      "Solar combo package for home, business or backup energy applications.",
    specs: ["Bundle package", "Solar energy solution", "Great value combination"],
    badge: "Combo",
    inStock: true,
    type: "kit",
    includes: ["Solar components", "Main unit", "Accessories"],
  },
  {
    id: "s13",
    name: "Aguila 1000AVA",
    category: "scooter",
    price: 3000,
    image: "/img/aguila-1000ava.jpeg",
    short:
      "72V electric scooter with modern design and strong urban performance.",
    specs: ["72V system", "Electric model", "Urban mobility"],
    badge: "New",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s14",
    name: "Ecarus",
    category: "scooter",
    price: 4300,
    image: "/img/ecarus.jpeg",
    short: "Electric scooter model with premium look and practical daily use.",
    specs: ["Electric drive", "Daily commuting", "Modern design"],
    badge: "Featured",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "s15",
    name: "Moto Roja",
    category: "scooter",
    price: 2900,
    image: "/img/moto-roja.jpeg",
    short:
      "Compact red electric scooter ideal for city rides and everyday use.",
    specs: ["Compact body", "Electric mobility", "City use"],
    badge: "Hot",
    inStock: true,
    type: "single",
    includes: [],
  },
].map((p) => ({
  ...p,
  slug: slugify(p.name),
  image: normalizeImage(p.image),
  specs: Array.isArray(p.specs) ? p.specs : [],
  includes: Array.isArray(p.includes) ? p.includes : [],
}));

const TECH_IMG = "/img/tech-products";

const techProducts = [
  {
    id: "t1",
    name: "Canon EOS R6 Mark II",
    category: "tech",
    price: 2499,
    image: `${TECH_IMG}/canon-eos-r6-mark-ii.jpg`,
    short:
      "Professional mirrorless camera with high-speed performance, sharp image quality and advanced video features.",
    specs: ["Mirrorless camera", "RF lens system", "Professional video"],
    badge: "New Arrival",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t2",
    name: "Canon Rebel T7 Kit",
    category: "tech",
    price: 549,
    image: `${TECH_IMG}/canon-rebel-t7-kit.jpg`,
    short:
      "DSLR camera kit with two lenses, ideal for photography beginners and content creators.",
    specs: ["DSLR camera", "Dual lens kit", "Beginner friendly"],
    badge: "Camera Kit",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t3",
    name: "Deco Gear 49 OLED Monitor",
    category: "tech",
    price: 1299,
    image: `${TECH_IMG}/deco-gear-49-oled-monitor.jpg`,
    short:
      "49-inch ultra-wide OLED gaming monitor with high refresh rate and immersive 32:9 display.",
    specs: ["49-inch OLED", "240Hz", "5120x1440"],
    badge: "Gaming",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t4",
    name: "DJI Osmo Action 6 Combo",
    category: "tech",
    price: 399,
    image: `${TECH_IMG}/dji-osmo-action-6-combo.jpg`,
    short:
      "Action camera combo built for smooth video, outdoor recording and high-quality content creation.",
    specs: ["Action camera", "Stabilized video", "Creator combo"],
    badge: "Action Cam",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t5",
    name: "EcoFlow Rapid Pro X Power Bank",
    category: "tech",
    price: 249,
    image: `${TECH_IMG}/ecoflow-rapid-pro-x.jpg`,
    short:
      "High-capacity portable power bank with fast charging support for laptops, phones and daily devices.",
    specs: ["27650mAh", "300W output", "Fast charging"],
    badge: "Power",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t6",
    name: "Eureka J15 Max Robot Vacuum",
    category: "tech",
    price: 799,
    image: `${TECH_IMG}/eureka-j15-max-robot.jpg`,
    short:
      "Smart robot vacuum with powerful suction and automatic cleaning features for modern homes.",
    specs: ["Robot vacuum", "Auto cleaning", "Strong suction"],
    badge: "Smart Home",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t7",
    name: "GoPro HERO13 Accessories Kit",
    category: "tech",
    price: 149,
    image: `${TECH_IMG}/gopro-hero-13-accessories-kit.jpg`,
    short:
      "Accessory bundle for GoPro HERO13 with mounts, batteries and useful recording tools.",
    specs: ["Accessory kit", "Extra batteries", "Mounts included"],
    badge: "Bundle",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t8",
    name: "GoPro HERO13 Black Bundle",
    category: "tech",
    price: 499,
    image: `${TECH_IMG}/gopro-hero-13-black-bundle.jpg`,
    short:
      "GoPro HERO13 Black bundle with accessories for action recording, travel and content creation.",
    specs: ["HERO13 Black", "Battery bundle", "Action recording"],
    badge: "Featured",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t9",
    name: "INNOCN 49 OLED Monitor",
    category: "tech",
    price: 1399,
    image: `${TECH_IMG}/innocn-49-oled-monitor.jpg`,
    short:
      "Curved 49-inch OLED monitor designed for gaming, multitasking and premium productivity setups.",
    specs: ["49-inch OLED", "240Hz", "Curved display"],
    badge: "OLED",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t10",
    name: "Mova Mobius 60 Robot Vacuum",
    category: "tech",
    price: 699,
    image: `${TECH_IMG}/mova-mobius-60-robot.jpg`,
    short:
      "Robot vacuum and mop system with smart cleaning, strong suction and automated home maintenance.",
    specs: ["Robot vacuum", "Mop function", "Smart cleaning"],
    badge: "Smart Home",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t11",
    name: "NearHub S Pro 4K Interactive Board",
    category: "tech",
    price: 1999,
    image: `${TECH_IMG}/nearhub-s-pro-4k-board.jpg`,
    short:
      "55-inch 4K interactive board with touchscreen, camera and collaboration tools for offices and education.",
    specs: ["55-inch 4K", "Touchscreen", "Collaboration board"],
    badge: "Office",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t12",
    name: "Nikon D7500 Bundle",
    category: "tech",
    price: 899,
    image: `${TECH_IMG}/nikon-d7500-bundle.jpg`,
    short:
      "Nikon DSLR camera bundle with accessories, lenses and photography essentials.",
    specs: ["DSLR camera", "Bundle kit", "Photography gear"],
    badge: "Camera Kit",
    inStock: true,
    type: "single",
    includes: [],
  },
  {
    id: "t13",
    name: "Smatree Predator Triton 17 Case",
    category: "tech",
    price: 34,
    image: `${TECH_IMG}/smatree-predator-triton-case.jpg`,
    short:
      "Protective laptop case for Acer Predator Triton 17-inch laptops with durable hard-shell protection.",
    specs: ["17-inch case", "Hard protection", "Laptop accessory"],
    badge: "Accessory",
    inStock: true,
    type: "single",
    includes: [],
  },
].map((p) => ({
  ...p,
  slug: slugify(p.name),
  image: normalizeImage(p.image),
  specs: Array.isArray(p.specs) ? p.specs : [],
  includes: Array.isArray(p.includes) ? p.includes : [],
}));

export const products = [
  ...scooterProducts,
  ...jblProducts,
  ...solarProducts,
  ...techProducts,
].map((p) => ({
  ...p,
  category: String(p.category || "").toLowerCase().trim(),
}));

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category) {
  return products.filter(
    (p) =>
      (p.category || "").toLowerCase() === String(category || "").toLowerCase()
  );
}