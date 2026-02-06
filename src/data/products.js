export const products = [
  {
    id: "pr-001",
    slug: "e2-plus-ii-electric-scooter",
    name: "E2 PLUS II Electric Scooter",
    price: 700,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1558979158-65a1eaa08691?auto=format&fit=crop&w=1200&q=80",
    short:
      "Daily commuter scooter with solid range and reliable build.",
    specs: ["Top speed: 19 mph", "Range: up to 25 mi", "Max load: 220 lb"]
  },
  {
    id: "pr-002",
    slug: "f3-electric-scooter",
    name: "F3 Electric Scooter",
    price: 900,
    badge: "12-Month Warranty",
    image:
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=80",
    short:
      "Upgraded motor and braking for smoother acceleration and control.",
    specs: ["Top speed: 22 mph", "Range: up to 28 mi", "Dual braking"]
  },
  {
    id: "pr-003",
    slug: "street-pro-scooter",
    name: "Street Pro Scooter",
    price: 1200,
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1590642918907-3b740f03c2f6?auto=format&fit=crop&w=1200&q=80",
    short:
      "Balanced performance, comfort, and durability for city riders.",
    specs: ["Top speed: 24 mph", "Range: up to 32 mi", "Suspension: front"]
  },
  {
    id: "pr-004",
    slug: "commuter-max-scooter",
    name: "Commuter Max Scooter",
    price: 1500,
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1520975869011-7f745fe11d9c?auto=format&fit=crop&w=1200&q=80",
    short:
      "Long-range setup designed for heavier daily use.",
    specs: ["Top speed: 28 mph", "Range: up to 40 mi", "Tires: 10 inch"]
  }
];

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}
