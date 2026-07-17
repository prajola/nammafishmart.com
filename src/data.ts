export type Category =
  | "Fish"
  | "Prawns"
  | "Crab"
  | "Squid"
  | "Shellfish"
  | "Dried"
  | "Combo";

export interface Product {
  id: string;
  name: string;
  local?: string; // regional name
  category: Category;
  price: number; // selling price (₹)
  mrp: number; // original price (₹)
  unit: string;
  pieces?: string;
  serves?: string;
  tags?: string[];
  description: string;
  rating: number;
  reviews: number;
}

export const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: "Fish", label: "Fish", emoji: "🐟" },
  { key: "Prawns", label: "Prawns & Shrimp", emoji: "🦐" },
  { key: "Crab", label: "Crab", emoji: "🦀" },
  { key: "Squid", label: "Squid & Calamari", emoji: "🦑" },
  { key: "Shellfish", label: "Shellfish", emoji: "🐚" },
  { key: "Dried", label: "Dried & Cured", emoji: "🌾" },
  { key: "Combo", label: "Combos", emoji: "🎁" },
];

export const CITIES = [
  "Chennai",
  "Bengaluru",
  "Hyderabad",
  "Coimbatore",
  "Madurai",
  "Kochi",
];

export const COUPONS: Record<
  string,
  { type: "percent" | "flat"; value: number; min: number; label: string }
> = {
  FRESH10: { type: "percent", value: 10, min: 0, label: "10% off your catch" },
  OCEAN20: { type: "percent", value: 20, min: 999, label: "20% off over ₹999" },
  NEW50: { type: "flat", value: 50, min: 299, label: "₹50 off over ₹299" },
};

export const PRODUCTS: Product[] = [
  {
    id: "seer-steaks",
    name: "Seer Fish Steaks",
    local: "Vanjaram / Surmai",
    category: "Fish",
    price: 699,
    mrp: 899,
    unit: "500 g (Net 400 g)",
    pieces: "4–5 steaks",
    serves: "Serves 3–4",
    tags: ["Bestseller", "Fresh Catch"],
    description:
      "Premium king mackerel steaks, firm and meaty with very few bones. Perfect for tawa fry, curry or grill.",
    rating: 4.8,
    reviews: 1284,
  },
  {
    id: "indian-salmon",
    name: "Indian Salmon Fillet",
    local: "Rawas",
    category: "Fish",
    price: 549,
    mrp: 720,
    unit: "500 g (Net 380 g)",
    pieces: "Boneless fillet",
    serves: "Serves 3",
    tags: ["Boneless"],
    description:
      "Soft, buttery fillets with a delicate flavour. A boneless favourite for kids and quick pan-fries.",
    rating: 4.7,
    reviews: 862,
  },
  {
    id: "rohu-currycut",
    name: "Rohu Curry Cut",
    local: "Rohu",
    category: "Fish",
    price: 279,
    mrp: 360,
    unit: "1 kg (Net 650 g)",
    pieces: "10–12 pieces",
    serves: "Serves 4–5",
    tags: ["Value"],
    description:
      "Classic freshwater carp, curry-cut and cleaned. Soaks up masala beautifully for a homestyle gravy.",
    rating: 4.5,
    reviews: 640,
  },
  {
    id: "pomfret-whole",
    name: "White Pomfret (Whole)",
    local: "Vaaval",
    category: "Fish",
    price: 899,
    mrp: 1150,
    unit: "600 g (2 fish)",
    pieces: "Cleaned & scored",
    serves: "Serves 2–3",
    tags: ["Premium"],
    description:
      "Silver pomfret, cleaned and gut-removed, scored for even cooking. A festive-table classic.",
    rating: 4.9,
    reviews: 412,
  },
  {
    id: "tilapia-fillet",
    name: "Tilapia Fillet",
    category: "Fish",
    price: 329,
    mrp: 420,
    unit: "500 g",
    pieces: "Boneless, skinless",
    serves: "Serves 3",
    tags: ["Boneless"],
    description:
      "Lean, mild and boneless fillets — great for fry, tikka or a light lemon-butter bake.",
    rating: 4.4,
    reviews: 355,
  },
  {
    id: "mackerel-whole",
    name: "Mackerel (Whole)",
    local: "Bangda / Ayala",
    category: "Fish",
    price: 249,
    mrp: 320,
    unit: "500 g (5–6 fish)",
    pieces: "Cleaned",
    serves: "Serves 3",
    tags: ["Omega-3"],
    description:
      "Oil-rich, flavour-packed mackerel, cleaned and ready. Rub with masala and shallow-fry to perfection.",
    rating: 4.6,
    reviews: 528,
  },
  {
    id: "red-snapper",
    name: "Red Snapper Steaks",
    local: "Sankara",
    category: "Fish",
    price: 459,
    mrp: 590,
    unit: "500 g",
    pieces: "4 steaks",
    serves: "Serves 3",
    tags: ["Fresh Catch"],
    description:
      "Sweet, firm-fleshed reef fish cut into steaks. Holds together well in fiery Chettinad gravies.",
    rating: 4.6,
    reviews: 274,
  },
  {
    id: "tiger-prawns",
    name: "Jumbo Tiger Prawns",
    category: "Prawns",
    price: 649,
    mrp: 850,
    unit: "500 g (Net 380 g)",
    pieces: "12–15 prawns",
    serves: "Serves 3",
    tags: ["Bestseller", "Cleaned"],
    description:
      "Large, juicy tiger prawns — deveined, shell-on. Star of any prawn roast, biryani or grill.",
    rating: 4.9,
    reviews: 1502,
  },
  {
    id: "white-prawns",
    name: "White Prawns (Medium)",
    category: "Prawns",
    price: 389,
    mrp: 499,
    unit: "500 g (Net 350 g)",
    pieces: "24–30 prawns",
    serves: "Serves 3–4",
    tags: ["Deveined"],
    description:
      "Sweet medium prawns, cleaned and deveined. Everyday-friendly for thokku, fry and pasta.",
    rating: 4.6,
    reviews: 703,
  },
  {
    id: "prawn-meat",
    name: "Prawn Meat (Peeled)",
    category: "Prawns",
    price: 429,
    mrp: 560,
    unit: "250 g",
    pieces: "Peeled & deveined",
    serves: "Serves 2–3",
    tags: ["Ready to cook"],
    description:
      "100% peeled, deveined prawn meat — zero prep. Toss straight into fried rice or curry.",
    rating: 4.7,
    reviews: 318,
  },
  {
    id: "mud-crab",
    name: "Mud Crab (Whole)",
    local: "Njandu",
    category: "Crab",
    price: 749,
    mrp: 980,
    unit: "700 g (1–2 crabs)",
    pieces: "Live-fresh, cleaned",
    serves: "Serves 2–3",
    tags: ["Premium"],
    description:
      "Meaty mangrove mud crab, cleaned and cut. Rich, sweet meat for a legendary crab masala.",
    rating: 4.8,
    reviews: 386,
  },
  {
    id: "crab-meat",
    name: "Crab Meat (Lump)",
    category: "Crab",
    price: 559,
    mrp: 720,
    unit: "200 g",
    pieces: "Hand-picked lump",
    serves: "Serves 2",
    tags: ["Ready to cook"],
    description:
      "Sweet hand-picked lump crab meat, shell-free. Perfect for cakes, soups and pasta.",
    rating: 4.5,
    reviews: 142,
  },
  {
    id: "squid-rings",
    name: "Squid Rings",
    local: "Kanava / Koonthal",
    category: "Squid",
    price: 359,
    mrp: 470,
    unit: "500 g",
    pieces: "Cleaned rings",
    serves: "Serves 3",
    tags: ["Bestseller"],
    description:
      "Tender squid, cleaned and cut into rings. Crisp calamari fry in minutes.",
    rating: 4.6,
    reviews: 489,
  },
  {
    id: "whole-squid",
    name: "Whole Squid (Cleaned)",
    local: "Kanava",
    category: "Squid",
    price: 399,
    mrp: 520,
    unit: "500 g",
    pieces: "Tube + tentacles",
    serves: "Serves 3",
    tags: ["Fresh Catch"],
    description:
      "Whole squid, ink-sac and beak removed. Stuff it, grill it or make a coastal masala.",
    rating: 4.5,
    reviews: 203,
  },
  {
    id: "green-mussels",
    name: "Green Mussels (Half Shell)",
    local: "Kadukka",
    category: "Shellfish",
    price: 299,
    mrp: 399,
    unit: "500 g",
    pieces: "On the half shell",
    serves: "Serves 2–3",
    tags: ["Coastal"],
    description:
      "Plump green mussels on the half shell — steam, stuff or simmer in a coconut masala.",
    rating: 4.4,
    reviews: 176,
  },
  {
    id: "clam-meat",
    name: "Clam Meat",
    local: "Matti",
    category: "Shellfish",
    price: 259,
    mrp: 340,
    unit: "250 g",
    pieces: "Shucked meat",
    serves: "Serves 2",
    tags: ["Ready to cook"],
    description:
      "Shell-free clam meat, cleaned and ready. Sweet and quick-cooking for a spicy sukka.",
    rating: 4.3,
    reviews: 98,
  },
  {
    id: "dried-anchovy",
    name: "Dried Anchovy",
    local: "Nethili Karuvadu",
    category: "Dried",
    price: 289,
    mrp: 360,
    unit: "250 g",
    pieces: "Sun-dried",
    serves: "Makes 4–5 servings",
    tags: ["Sun-dried"],
    description:
      "Premium sun-dried anchovies, low-salt cured. Punchy karuvadu kuzhambu essential.",
    rating: 4.5,
    reviews: 221,
  },
  {
    id: "dried-prawns",
    name: "Dried Prawns",
    local: "Karuvadu Eral",
    category: "Dried",
    price: 349,
    mrp: 450,
    unit: "200 g",
    pieces: "Cleaned & dried",
    serves: "Makes 4 servings",
    tags: ["Sun-dried"],
    description:
      "Cleaned, deveined and sun-dried prawns with deep umami. A pantry powerhouse.",
    rating: 4.4,
    reviews: 130,
  },
  {
    id: "fry-combo",
    name: "Weekend Fry Box",
    category: "Combo",
    price: 899,
    mrp: 1240,
    unit: "3 varieties · 1.1 kg",
    pieces: "Seer + Prawns + Squid",
    serves: "Serves 5–6",
    tags: ["Combo", "Save ₹341"],
    description:
      "An assorted fry-night box — seer steaks, tiger prawns and squid rings, all cleaned and cut.",
    rating: 4.8,
    reviews: 356,
  },
  {
    id: "family-feast",
    name: "Family Feast Box",
    category: "Combo",
    price: 1499,
    mrp: 1990,
    unit: "5 varieties · 2.2 kg",
    pieces: "Fish, prawns, crab & more",
    serves: "Serves 8–10",
    tags: ["Combo", "Best value"],
    description:
      "A grand seafood spread for the whole family — pomfret, prawns, crab, squid and curry-cut fish.",
    rating: 4.9,
    reviews: 214,
  },
];

export const money = (n: number) => "₹" + n.toLocaleString("en-IN");
export const discountPct = (p: Product) =>
  Math.round(((p.mrp - p.price) / p.mrp) * 100);
