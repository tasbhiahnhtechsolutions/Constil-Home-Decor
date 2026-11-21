export const BATH_STYLES = [
  "Modern", "Minimalist", "Traditional", "Contemporary", "Industrial",
  "Rustic", "Scandinavian", "Bohemian (Boho)", "Luxury", "Transitional",
];

export const KITCHEN_STYLES = [
  "Modern", "Minimalist", "Traditional", "Contemporary", "Farmhouse",
  "Industrial", "Transitional", "Luxury",
];

export const BUDGET_OPTIONS = ["Under $2,000", "$2,000 – $10,000", "$10,000 – $25,000", "$25,000+"];

export const ROOM_SIZES = {
  kitchen: [
    { label: "Small galley · about 8 × 10 ft", length: 8, width: 10 },
    { label: "Typical kitchen · about 10 × 12 ft", length: 10, width: 12 },
    { label: "Medium kitchen · about 12 × 14 ft", length: 12, width: 14 },
    { label: "Large kitchen · about 14 × 16 ft", length: 14, width: 16 },
    { label: "Open kitchen · about 16 × 18 ft", length: 16, width: 18 },
  ],
  bathroom: [
    { label: "Powder room · about 4 × 5 ft", length: 4, width: 5 },
    { label: "Small bathroom · about 5 × 7 ft", length: 5, width: 7 },
    { label: "Typical bathroom · about 6 × 8 ft", length: 6, width: 8 },
    { label: "Large bathroom · about 8 × 10 ft", length: 8, width: 10 },
    { label: "Primary suite bath · about 10 × 12 ft", length: 10, width: 12 },
  ],
};

export const CEILING_CHOICES = [
  { label: "Standard ceiling · 8 ft", height: 8 },
  { label: "A bit taller · 9 ft", height: 9 },
  { label: "High ceiling · 10 ft", height: 10 },
];

const BATH_LAYOUTS = ["Rectangular", "Square", "L-Shaped", "Narrow", "Irregular", "Open Layout"];
const BATH_PALETTES = [
  "Warm Stone and Wood",
  "Bright White and Chrome",
  "Soft Sage and Brass",
  "Dark Marble and Gold",
  "Coastal Blue and White",
];
const FULL_BATH_FEATURES = [
  "Freestanding Soaking Bathtub",
  "Frameless Glass Walk-in Shower",
  "Double Sink Vanity",
  "Full Marble Tile Wall",
  "Brushed Gold Fixtures",
];

export const HOME_ROOMS = [
  "Living Room", "Master Bedroom", "Kitchen & Dining Area", "Home Office / Study",
  "Entryway / Foyer", "Outdoor Patio / Balcony", "Kids Bedroom / Nursery",
];

export const BATH_ROOMS = [
  "Master Bathroom", "Powder Room (Half Bath)", "Guest Bathroom",
  "En-Suite Bathroom", "Spa-Style Sanctuary Bathroom",
];

export const ROOM_FORM_CHOICES = {
  "Living Room": {
    styles: ["Japandi (Japanese + Scandinavian)", "Mid-Century Modern", "Scandinavian Hygge", "Modern Industrial Loft", "Coastal / Beachy", "Warm Organic Modern", "Contemporary Minimalist", "Luxury"],
    palettes: ["Warm Earthy Tones (Terracotta, Beige, Oak)", "Neutral & Monochromatic (Cream, Charcoal, Grey)", "Soft Pastels (Sage Green, Blush, Soft Gold)", "Dark Mood & Dramatic (Emerald, Navy, Matte Black)", "Bright & Airy (Pure White, Daylight, Natural Linen)"],
    features: ["Statement Fireplace & Accent Wall", "Floor-to-Ceiling Windows", "Plush Modular Sofa & Area Rug", "Built-in Media Wall", "Statement Chandelier"],
  },
  "Master Bedroom": {
    styles: ["Japandi (Japanese + Scandinavian)", "Scandinavian Hygge", "French Country Cottage", "Warm Organic Modern", "Contemporary Minimalist", "Luxury", "Coastal / Beachy"],
    palettes: ["Soft Neutrals (Linen, Sand, Warm White)", "Warm Earthy Tones (Terracotta, Beige, Oak)", "Deep Moody (Navy, Forest, Charcoal)", "Blush and Cream", "Bright & Airy (White, Oak, Soft Grey)"],
    features: ["Upholstered Bed & Layered Bedding", "Built-in Wardrobe", "Bedside Lighting & Drapes", "Window Seat", "Accent Wall Behind the Bed"],
  },
  "Kitchen & Dining Area": {
    styles: ["Modern", "Farmhouse", "Contemporary", "Traditional", "Minimalist", "Transitional", "Industrial", "Luxury"],
    palettes: ["White Cabinets and Oak", "Sage and Cream", "Marble and Brass", "Dark Moody Cabinets", "Bright White and Stainless"],
    features: ["Large Kitchen Island", "Custom Cabinets", "Stone Countertops", "Dining Table & Pendant Lights", "Statement Range Hood"],
  },
  "Home Office / Study": {
    styles: ["Modern", "Mid-Century Modern", "Japandi (Japanese + Scandinavian)", "Traditional", "Contemporary Minimalist", "Luxury Executive"],
    palettes: ["Warm Oak and Cream", "Neutral Grey and White", "Deep Green and Walnut", "Black, Leather, and Brass", "Light Scandinavian"],
    features: ["Built-in Desk", "Floor-to-Ceiling Bookshelves", "Task Lighting", "Window Beside the Desk", "Credenza and Closed Storage"],
  },
  "Entryway / Foyer": {
    styles: ["Modern", "Traditional", "Transitional", "Coastal / Beachy", "Japandi (Japanese + Scandinavian)"],
    palettes: ["Warm White and Oak", "Soft Grey and Black Metal", "Cream and Brass", "Deep Moody Entry", "Bright & Airy"],
    features: ["Console Table & Mirror", "Bench and Coat Storage", "Statement Pendant", "Patterned Tile Floor", "Slim Shoe Cabinet"],
  },
  "Outdoor Patio / Balcony": {
    styles: ["Coastal / Beachy", "Modern", "Rustic", "Bohemian (Boho)", "Mediterranean"],
    palettes: ["Natural Teak and White", "Terracotta and Olive", "Black Metal and Grey", "Coastal Blue and Sand", "Lush Green and Cream"],
    features: ["Outdoor Sofa", "Dining Set", "Pergola or Shade", "Planters and Greenery", "Outdoor Fire Feature"],
  },
  "Kids Bedroom / Nursery": {
    styles: ["Soft Scandinavian", "Playful Modern", "Cottage", "Neutral Montessori", "Coastal / Beachy"],
    palettes: ["Soft Sage and Cream", "Blush and White", "Sky Blue and Oak", "Warm Neutral", "Sunny Yellow Accents"],
    features: ["Single or Bunk Bed", "Toy Storage", "Reading Nook", "Soft Rug", "Wall Mural Accent"],
  },
  "Master Bathroom": { styles: BATH_STYLES, palettes: BATH_PALETTES, layouts: BATH_LAYOUTS, features: FULL_BATH_FEATURES },
  "Guest Bathroom": {
    styles: BATH_STYLES, palettes: BATH_PALETTES, layouts: BATH_LAYOUTS,
    features: ["Single Sink Vanity", "Tub and Shower Combination", "Framed Mirror", "Subway Tile Shower", "Brushed Nickel Fixtures"],
  },
  "En-Suite Bathroom": { styles: BATH_STYLES, palettes: BATH_PALETTES, layouts: BATH_LAYOUTS, features: FULL_BATH_FEATURES },
  "Spa-Style Sanctuary Bathroom": {
    styles: BATH_STYLES, palettes: BATH_PALETTES, layouts: BATH_LAYOUTS,
    features: ["Deep Soaking Bathtub", "Steam Walk-in Shower", "Stone Tile Wall", "Heated Floor Look", "Ambient Cove Lighting"],
  },
  "Powder Room (Half Bath)": {
    styles: BATH_STYLES, palettes: BATH_PALETTES,
    layouts: ["Square", "Narrow", "Rectangular", "Irregular"],
    features: ["Petite Vanity and Vessel Sink", "Statement Mirror", "Patterned Wallpaper Accent", "Small Brass Chandelier", "Floating Mini Vanity"],
  },
};

export const HOME_PRESETS = {
  Small: [[10, 12], [12, 12], [12, 14]],
  Medium: [[14, 16], [15, 18], [16, 20]],
  Large: [[18, 22], [20, 25], [25, 30]],
};

export const BATH_PRESETS = {
  Small: [[3, 5], [4, 6], [5, 7]],
  Medium: [[5, 8], [6, 9], [7, 10]],
  Large: [[8, 12], [10, 10], [12, 15]],
};

export function parseBudget(text) {
  const compact = String(text || "").toLowerCase().replaceAll("–", "-").replaceAll(",", "").replaceAll("$", "").replaceAll(" ", "");
  if (compact.includes("under")) return 1500;
  if (compact.includes("25000+")) return 30000;
  if (compact.includes("10000") && compact.includes("25000")) return 15000;
  if (compact.includes("2000") && compact.includes("10000")) return 6000;
  const numbers = compact.match(/\d+/g);
  return numbers ? Number(numbers[0]) : 5000;
}

export function parseScope(text) {
  return String(text || "").toLowerCase().includes("full") ? "full" : "refresh";
}

function money(amount) {
  return Math.round(Number(amount) / 10) * 10;
}

function applyTier(low, high, budget) {
  let lo = Number(low);
  let hi = Number(high);
  if (hi < lo) [lo, hi] = [hi, lo];
  const span = hi - lo;
  if (budget < 2000) return [lo, lo + span * 0.5];
  if (budget >= 10000) return [lo + span * 0.35, hi];
  return [lo, hi];
}

function roundQty(qty, unit) {
  const value = Number(qty) || 0;
  if (value <= 0) return 0;
  if (unit === "each") return Math.round(value);
  if (unit === "hours") return Math.round(value * 2) / 2;
  if (unit === "sq ft") return Math.round(value);
  return Math.round(value * 10) / 10;
}

function addPriced(items, { group, name, qty, unit, unitLow, unitHigh, budget, detail }) {
  const amount = roundQty(qty, unit);
  if (amount <= 0) return;
  const [tierLow, tierHigh] = applyTier(unitLow, unitHigh, budget);
  const lowRate = Math.round(tierLow);
  const highRate = Math.max(lowRate, Math.round(tierHigh));
  if (lowRate === 0 && highRate === 0) return;
  items.push({
    group,
    name,
    qty: amount,
    unit,
    unitLow: lowRate,
    unitHigh: highRate,
    low: money(lowRate * amount),
    high: money(highRate * amount),
    detail,
  });
}

function sumItems(items, key) {
  return items.reduce((sum, item) => sum + item[key], 0);
}

function homeFeatureRate(feature) {
  const text = feature.toLowerCase();
  if (text.includes("fireplace") || text.includes("fire feature")) return [1800, 7000];
  if (text.includes("wardrobe") || text.includes("bookshelf") || text.includes("built-in") || text.includes("media")) return [900, 4500];
  if (text.includes("island") || text.includes("pergola") || text.includes("shade")) return [800, 4000];
  if (text.includes("sofa") || text.includes("bed") || text.includes("dining")) return [600, 3200];
  if (text.includes("chandelier") || text.includes("pendant") || text.includes("lighting")) return [200, 1400];
  if (text.includes("mural") || text.includes("wallpaper") || text.includes("accent") || text.includes("mirror")) return [250, 1200];
  return [400, 2000];
}

export function buildEstimate(room, length, width, height, answers, budget) {
  const sqft = length * width;
  const scope = parseScope(answers.scope);
  const full = scope === "full";
  const items = [];
  const notes = [
    `${length} × ${width} ft (${Math.round(sqft)} sq ft) with a ${height} ft ceiling.`,
    full ? "Full replacement" : "Light refresh",
  ];

  if (room === "kitchen") {
    const linearFt = Math.max(6, (length + width) * 1.1);
    const splashSqft = linearFt * 1.5;
    const cabinets = String(answers.cabinets || "").toLowerCase();
    const counter = String(answers.countertop || "").toLowerCase();
    const keepingCabs = cabinets.includes("keep");
    const refacing = cabinets.includes("reface");
    const keepingTop = counter.includes("keep");
    const cabinetRate = keepingCabs ? [10, 25] : refacing ? [50, 120] : full ? [95, 240] : [75, 170];
    const cabinetHours = keepingCabs ? 0.2 : refacing ? 0.9 : full ? 1.8 : 1.2;
    const counterRate = keepingTop ? [0, 12]
      : counter.includes("butcher") ? [18, 40]
      : counter.includes("marble") ? [50, 100]
      : counter.includes("granite") ? [28, 60]
      : [30, 70];
    const counterHours = keepingTop ? 0.15 : full ? 0.7 : 0.45;
    notes.push(`Cabinet, counter, and backsplash runs are about ${Math.round(linearFt)} linear ft from the footprint, not a measured layout.`);
    addPriced(items, { group: "Materials", name: "Cabinets", qty: linearFt, unit: "linear ft", unitLow: cabinetRate[0], unitHigh: cabinetRate[1], budget, detail: "Cabinet boxes and doors only. Install is listed under labor." });
    addPriced(items, { group: "Materials", name: "Countertop", qty: linearFt, unit: "linear ft", unitLow: counterRate[0], unitHigh: counterRate[1], budget, detail: "Slab or surface material for the cabinet run." });
    addPriced(items, { group: "Materials", name: "Backsplash", qty: splashSqft, unit: "sq ft", unitLow: full ? 14 : 8, unitHigh: full ? 32 : 18, budget, detail: "About 18 inches of backsplash over the counter run." });
    addPriced(items, { group: "Materials", name: "Flooring", qty: sqft, unit: "sq ft", unitLow: full ? 5 : 3, unitHigh: full ? 12 : 7, budget, detail: "Floor area from the size you picked." });
    addPriced(items, { group: "Materials", name: "Sink and faucet", qty: 1, unit: "each", unitLow: full ? 220 : 120, unitHigh: full ? 750 : 400, budget, detail: "One sink and one faucet." });
    addPriced(items, { group: "Materials", name: "Appliances allowance", qty: 1, unit: "each", unitLow: full ? 1500 : 0, unitHigh: full ? 5500 : 900, budget, detail: full ? "Range, dishwasher, and refrigerator allowance." : "Small appliance updates only." });
    addPriced(items, { group: "Labor", name: "Demolition", qty: sqft / (full ? 7 : 16), unit: "hours", unitLow: 40, unitHigh: 75, budget, detail: "Haul-off and prep before the new work." });
    addPriced(items, { group: "Labor", name: "Cabinet install", qty: linearFt * cabinetHours, unit: "hours", unitLow: 60, unitHigh: 110, budget, detail: keepingCabs ? "Adjust and rehang the cabinets you are keeping." : refacing ? "Reface the existing cabinet boxes." : "Set the new cabinet run." });
    addPriced(items, { group: "Labor", name: "Countertop install", qty: linearFt * counterHours, unit: "hours", unitLow: 60, unitHigh: 110, budget, detail: keepingTop ? "Reset the counter you are keeping." : "Template, cut, and set the new counter." });
    addPriced(items, { group: "Labor", name: "Backsplash install", qty: splashSqft / 8, unit: "hours", unitLow: 60, unitHigh: 110, budget, detail: "Set the backsplash tile." });
    addPriced(items, { group: "Labor", name: "Floor install", qty: sqft / (full ? 7 : 12), unit: "hours", unitLow: 60, unitHigh: 110, budget, detail: "Install the new floor." });
    addPriced(items, { group: "Labor", name: "Plumber", qty: full ? 10 : 5, unit: "hours", unitLow: 85, unitHigh: 150, budget, detail: "Hook up the sink and faucet." });
  } else if (room === "home") {
    const outdoor = /outdoor|patio|balcony/i.test(answers.roomType || "");
    const wallSqft = Math.round(2 * (length + width) * height * (outdoor ? 0.25 : 0.65));
    const feature = String(answers.feature || "Key feature");
    const featureRate = homeFeatureRate(feature);
    notes.push(`${answers.roomType || "This room"} is priced from the size and feature you picked, not from a photo.`);
    addPriced(items, {
      group: "Materials",
      name: outdoor ? "Outdoor flooring" : "Flooring",
      qty: sqft,
      unit: "sq ft",
      unitLow: outdoor ? 8 : 4,
      unitHigh: outdoor ? 22 : 14,
      budget,
      detail: "Floor area from the size you picked.",
    });
    addPriced(items, {
      group: "Materials",
      name: outdoor ? "Finish and seal" : "Paint",
      qty: wallSqft,
      unit: "sq ft",
      unitLow: outdoor ? 1 : 1,
      unitHigh: outdoor ? 3 : 3,
      budget,
      detail: outdoor ? "Rails, posts, and exposed surfaces." : "Wall area estimated from the footprint and ceiling.",
    });
    addPriced(items, {
      group: "Materials",
      name: feature,
      qty: 1,
      unit: "each",
      unitLow: featureRate[0],
      unitHigh: featureRate[1],
      budget,
      detail: "The key feature you selected, before install.",
    });
    addPriced(items, {
      group: "Materials",
      name: outdoor ? "Outdoor lighting" : "Lighting",
      qty: 1,
      unit: "each",
      unitLow: outdoor ? 150 : 180,
      unitHigh: outdoor ? 900 : 1200,
      budget,
      detail: "A lighting allowance for this room.",
    });
    addPriced(items, { group: "Labor", name: outdoor ? "Site prep" : "Prep and paint", qty: wallSqft / 40, unit: "hours", unitLow: 40, unitHigh: 75, budget, detail: outdoor ? "Clean and prepare the outdoor surfaces." : "Prep and paint the walls." });
    addPriced(items, { group: "Labor", name: "Floor install", qty: sqft / (outdoor ? 8 : 10), unit: "hours", unitLow: 45, unitHigh: 90, budget, detail: "Install the new floor." });
    addPriced(items, { group: "Labor", name: "Feature install", qty: featureRate[0] > 1500 ? 16 : 8, unit: "hours", unitLow: 50, unitHigh: 110, budget, detail: `Set ${feature}.` });
  } else {
    const wetAnswer = String(answers.wet || "").toLowerCase();
    const skipWet = wetAnswer.includes("none") || wetAnswer.includes("no tub");
    const wallFactor = height > 9 ? 1.15 : 1;
    const wallSqft = sqft * (skipWet ? 0.35 : full ? 1.2 : 0.4) * wallFactor;
    const keeping = wetAnswer.includes("keep");
    const shower = wetAnswer.includes("walk-in") || (wetAnswer.includes("shower") && !wetAnswer.includes("tub and"));
    const wetName = shower ? "Walk-in shower" : wetAnswer.includes("tub") ? "Bathtub" : "Shower or tub";
    const wetRate = full && keeping ? [250, 1100]
      : full && shower ? [1400, 5200]
      : full ? [1100, 4200]
      : keeping ? [80, 280]
      : [500, 1600];
    const plumberHours = full && keeping ? 6 : full ? 18 : keeping ? 3 : 8;
    notes.push(`Wall tile is about ${Math.round(wallSqft)} sq ft, from the floor size and a ${height} ft ceiling, not a measured wall.`);
    addPriced(items, { group: "Materials", name: "Floor tile", qty: sqft, unit: "sq ft", unitLow: full ? 8 : 4, unitHigh: full ? 18 : 10, budget, detail: "Tile for the floor only." });
    addPriced(items, { group: "Materials", name: "Wall tile", qty: wallSqft, unit: "sq ft", unitLow: full ? 9 : 5, unitHigh: full ? 24 : 12, budget, detail: "Tile for the wet walls." });
    addPriced(items, { group: "Materials", name: "Vanity", qty: 1, unit: "each", unitLow: full ? 700 : 250, unitHigh: full ? 2800 : 900, budget, detail: "Vanity cabinet and top, before install." });
    addPriced(items, { group: "Materials", name: "Faucet and mirror", qty: 1, unit: "each", unitLow: full ? 400 : 100, unitHigh: full ? 2000 : 450, budget, detail: "Faucet, mirror, and small fixture set." });
    if (!skipWet) addPriced(items, { group: "Materials", name: wetName, qty: 1, unit: "each", unitLow: wetRate[0], unitHigh: wetRate[1], budget, detail: keeping ? "Parts to keep the fixture that is already there." : "The tub or shower unit itself." });
    addPriced(items, { group: "Labor", name: "Demolition", qty: sqft / (full ? 5 : 12), unit: "hours", unitLow: 45, unitHigh: 85, budget, detail: "Remove the finishes that are being replaced." });
    addPriced(items, { group: "Labor", name: "Tile setter", qty: (sqft + wallSqft) / (full ? 4.5 : 10), unit: "hours", unitLow: 70, unitHigh: 150, budget, detail: "Set the floor and wall tile." });
    addPriced(items, { group: "Labor", name: "Plumber", qty: skipWet ? 4 : plumberHours, unit: "hours", unitLow: 95, unitHigh: 170, budget, detail: skipWet ? "Connect the vanity faucet only." : keeping ? "Reconnect the fixture you are keeping." : "Set and connect the new tub or shower." });
    addPriced(items, { group: "Labor", name: "Vanity install", qty: full ? 8 : 4, unit: "hours", unitLow: 60, unitHigh: 110, budget, detail: "Set the vanity, faucet, and mirror." });
  }

  const materials = items.filter((item) => item.group === "Materials");
  const labor = items.filter((item) => item.group === "Labor");
  const materialLow = sumItems(materials, "low");
  const materialHigh = sumItems(materials, "high");
  const laborLow = sumItems(labor, "low");
  const laborHigh = sumItems(labor, "high");
  const totalLow = materialLow + laborLow;
  const totalHigh = materialHigh + laborHigh;
  return {
    room, scope, sqft, length, width, height, budget, items,
    materialLow, materialHigh, laborLow, laborHigh,
    totalLow, totalHigh, notes,
    budgetNote: totalLow > budget * 1.15
      ? "This scope prices above the budget you picked. Raise the budget below, or go back and choose a lighter scope."
      : "",
    disclaimer: "Planning range in USD, not a contractor quote. The size is a typical room size, not a tape measurement. Tax and country pricing are not included.",
  };
}

function wetChoice(roomType, feature) {
  const text = String(feature || "").toLowerCase();
  if (/powder|half/i.test(roomType)) return "none";
  if (text.includes("tub") && text.includes("shower")) return "Tub and shower";
  if (text.includes("tub")) return "Bathtub";
  if (text.includes("shower")) return "Walk-in shower";
  return "Walk-in shower";
}

function counterChoice(feature, palette) {
  const text = `${feature} ${palette}`.toLowerCase();
  if (text.includes("marble")) return "Marble";
  if (text.includes("butcher")) return "Butcher block";
  if (text.includes("granite") || text.includes("stone")) return "Granite";
  return "Quartz";
}

export function manualEstimate({ category, roomType, length, width, height, feature, palette, budget }) {
  const scope = "Full replacement";
  if (category === "bath") {
    const tile = /tile|marble|stone/i.test(`${feature} ${palette}`) ? "New wall and floor tile" : "New floor tile";
    return buildEstimate("bathroom", length, width, height, { scope, wet: wetChoice(roomType, feature), tile, roomType }, budget);
  }
  if (/kitchen/i.test(roomType)) {
    return buildEstimate("kitchen", length, width, height, {
      scope,
      cabinets: "Replace them",
      countertop: counterChoice(feature, palette),
      roomType,
    }, budget);
  }
  return buildEstimate("home", length, width, height, { scope, feature, roomType }, budget);
}

export function describeBudget(budget) {
  if (budget < 2000) return "clean, simple design using high-efficiency layouts and smart budget-friendly materials.";
  if (budget < 10000) return "mid-range premium styling with solid wood finishes, designer lighting, and high-quality craftsmanship.";
  return "ultra-luxurious bespoke finishes, custom craftsmanship, high-end stone or marble, and luxury fixtures.";
}

function num(value, limit) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > limit) return null;
  return Math.round(parsed * 10) / 10;
}

function pair(low, high) {
  if (low != null && high != null && low > high) return [high, low];
  return [low, high];
}

export function normalizeVision(data = {}) {
  const room = ["bathroom", "kitchen", "unknown"].includes(String(data.room_type || "").toLowerCase())
    ? String(data.room_type).toLowerCase()
    : "unknown";
  const confidence = ["low", "medium", "high"].includes(String(data.confidence || "").toLowerCase())
    ? String(data.confidence).toLowerCase()
    : "low";
  const [lengthLow, lengthHigh] = pair(num(data.length_low_ft, 40), num(data.length_high_ft, 40));
  const [widthLow, widthHigh] = pair(num(data.width_low_ft, 40), num(data.width_high_ft, 40));
  const [heightLow, heightHigh] = pair(num(data.height_low_ft, 20), num(data.height_high_ft, 20));
  const fixtures = Array.isArray(data.fixtures) ? data.fixtures.map(String).filter(Boolean).slice(0, 12) : [];
  const source = data.visible && typeof data.visible === "object" ? data.visible : {};
  const visible = {};
  for (const key of ["tub", "shower", "vanity", "tile", "cabinets", "countertop", "appliances"]) {
    if (typeof source[key] === "boolean") visible[key] = source[key];
  }
  return {
    room_type: room,
    fixtures,
    visible,
    condition: String(data.condition || "").slice(0, 280),
    length_ft: num(data.length_ft, 40),
    width_ft: num(data.width_ft, 40),
    height_ft: num(data.height_ft, 20),
    length_low_ft: lengthLow,
    length_high_ft: lengthHigh,
    width_low_ft: widthLow,
    width_high_ft: widthHigh,
    height_low_ft: heightLow,
    height_high_ft: heightHigh,
    confidence,
    notes: String(data.notes || "").slice(0, 280),
  };
}

export function rangeLabel(vision, axis) {
  const low = vision[`${axis}_low_ft`];
  const high = vision[`${axis}_high_ft`];
  const exact = vision[`${axis}_ft`];
  if (low != null && high != null) return `${low}–${high} ft`;
  if (exact != null) return `about ${exact} ft`;
  return "not estimated from the photo";
}

export function suggestSize(room, vision) {
  const sizes = ROOM_SIZES[room] || ROOM_SIZES.bathroom;
  const length = guessedDim(vision, "length");
  const width = guessedDim(vision, "width");
  const height = guessedDim(vision, "height");
  let size = sizes[1];
  if (length >= 3 && width >= 3) {
    let best = Infinity;
    for (const choice of sizes) {
      const score = Math.abs(choice.length * choice.width - length * width);
      if (score < best) {
        best = score;
        size = choice;
      }
    }
  }
  const ceiling = CEILING_CHOICES.find((choice) => choice.height === Math.round(height)) || CEILING_CHOICES[0];
  return { size, ceiling };
}

export function guessedDim(vision, axis) {
  const exact = vision[`${axis}_ft`];
  const low = vision[`${axis}_low_ft`];
  const high = vision[`${axis}_high_ft`];
  const value = exact ?? (low != null && high != null ? (low + high) / 2 : low ?? high);
  if (!value) return 0;
  return Math.round(Math.round(value / 0.5) * 0.5 * 10) / 10;
}

export function summaryText(vision) {
  const opening = vision.room_type === "unknown"
    ? "I couldn't tell whether this is a bathroom or a kitchen."
    : `This looks like a ${vision.room_type}.`;
  const fixtures = vision.fixtures?.length ? ` Visible: ${vision.fixtures.join(", ")}.` : "";
  const condition = vision.condition ? ` ${vision.condition}` : "";
  const size = ` Approximate size: length ${rangeLabel(vision, "length")}, width ${rangeLabel(vision, "width")}, ceiling ${rangeLabel(vision, "height")} (${vision.confidence} confidence).`;
  const notes = vision.notes ? ` ${vision.notes}` : "";
  return opening + fixtures + condition + size + notes;
}

function fixtureText(vision) {
  return (vision.fixtures || []).map((name) => name.toLowerCase());
}

function seen(vision, key, words) {
  if (typeof vision.visible?.[key] === "boolean") return vision.visible[key];
  return fixtureText(vision).some((name) => words.some((word) => name.includes(word)));
}

function wetQuestion(vision) {
  const tub = seen(vision, "tub", ["tub"]);
  const shower = seen(vision, "shower", ["shower"]);
  if (tub && shower) {
    return {
      id: "wet",
      prompt: "I see a tub and a shower. What should happen to them?",
      options: ["Keep the tub", "Keep the shower", "Walk-in shower", "Tub and shower"],
    };
  }
  if (tub) {
    return {
      id: "wet",
      prompt: "I see a tub, not a shower. Keep the tub, or switch to a walk-in shower?",
      options: ["Keep the tub", "Walk-in shower"],
    };
  }
  if (shower) {
    return {
      id: "wet",
      prompt: "I see a shower, not a tub. Keep that shower, or change the layout?",
      options: ["Keep the shower", "Walk-in shower", "Tub and shower"],
    };
  }
  return {
    id: "wet",
    prompt: "I don't see a tub or a shower in the photo. What should this bathroom have?",
    options: ["Walk-in shower", "Bathtub", "Tub and shower"],
  };
}

function kitchenQuestions(vision) {
  const cabinets = seen(vision, "cabinets", ["cabinet"]);
  const counter = seen(vision, "countertop", ["counter", "island"]);
  return [
    {
      id: "cabinets",
      prompt: cabinets
        ? "I can see cabinets. Keep them, reface them, or replace them?"
        : "I don't see cabinets in the photo. Add new ones, or keep this plan light?",
      options: cabinets ? ["Keep them", "Reface them", "Replace them"] : ["Replace them", "Keep them"],
    },
    {
      id: "countertop",
      prompt: counter
        ? "I can see a countertop. Keep it, or pick a new material?"
        : "I don't see a counter to keep. What countertop do you want?",
      options: counter
        ? ["Keep current", "Quartz", "Granite", "Butcher block", "Marble"]
        : ["Quartz", "Granite", "Butcher block", "Marble"],
    },
  ];
}

function tileQuestion(vision) {
  const tile = seen(vision, "tile", ["tile", "subway"]);
  return {
    id: "tile",
    prompt: tile
      ? "I can see tile. Keep most of it, or replace it?"
      : "I don't see tile to keep. What tile work do you want?",
    options: tile
      ? ["Keep most tile", "New floor tile", "New wall and floor tile"]
      : ["New floor tile", "New wall and floor tile"],
  };
}

export function buildQuestions(vision, room) {
  const names = (vision.fixtures || []).slice(0, 6);
  const seenLine = names.length ? `I can see ${names.join(", ")}. ` : "";
  const questions = [];
  if (vision.room_type !== "bathroom" && vision.room_type !== "kitchen") {
    questions.push({ id: "room", prompt: "Is this room a bathroom or a kitchen?", options: ["Bathroom", "Kitchen"] });
  }
  const condition = vision.condition ? `${vision.condition} ` : "";
  questions.push(
    { id: "scope", prompt: `${condition}Is this a light refresh, or a full replacement?`, options: ["Light refresh", "Full replacement"] },
    ...(room === "kitchen" ? kitchenQuestions(vision) : [wetQuestion(vision)]),
    { id: "style", prompt: room === "kitchen" ? "What kitchen style do you want?" : "What bathroom style do you want?", options: room === "kitchen" ? KITCHEN_STYLES : BATH_STYLES },
    ...(room === "kitchen" ? [] : [tileQuestion(vision)]),
    { id: "budget", prompt: "What budget should the planning estimate use?", options: BUDGET_OPTIONS },
    {
      id: "must_keep",
      prompt: `${seenLine}What must stay the same? Type it, or choose Nothing specific.`,
      options: ["Nothing specific"],
      freeText: true,
    },
  );
  return questions;
}

export function remodelPrompt(room, length, width, height, answers, vision, budget) {
  const style = answers.style || "Modern";
  const fixtures = (vision.fixtures || []).join(", ") || "the existing fixtures";
  const decisions = room === "kitchen"
    ? `Cabinets: ${answers.cabinets || "replace them"}. Countertop: ${answers.countertop || "quartz"}.`
    : `Tub and shower: ${answers.wet || "a walk-in shower"}. Tile: ${answers.tile || "new tile"}.`;
  const keep = answers.must_keep && !answers.must_keep.toLowerCase().includes("nothing specific")
    ? ` Keep these elements: ${answers.must_keep}.`
    : "";
  return `Remodel this ${style} ${room}. Footprint ${length} by ${width} feet, ceiling ${height} feet. Existing fixtures: ${fixtures}. ${vision.condition || ""} ${decisions}${keep} Scope: ${answers.scope || "a remodel"}. Built with ${describeBudget(budget)} Photorealistic, no text, no people.`;
}

export function manualPrompt(category, roomType, style, length, width, height, paletteOrLayout, feature, budget, notes, colorPalette) {
  const vibe = describeBudget(budget);
  const extra = notes?.trim() ? ` Custom requested elements: ${notes.trim()}.` : "";
  if (category === "home") {
    return `A professional interior photograph of a ${style} ${roomType}. The room measures ${length}x${width} feet with a ${height}-foot ceiling. Palette: ${paletteOrLayout}. Highlighted by ${feature}. Built with ${vibe}${extra} Photorealistic, no text, no people.`;
  }
  const color = colorPalette ? ` Color palette: ${colorPalette}.` : "";
  return `A professional interior photograph of a ${style} ${roomType}. Layout ${paletteOrLayout}, ${length}x${width} feet, ${height}-foot ceiling. Highlighted by ${feature}.${color} Built with ${vibe}${extra} Photorealistic, no text, no people.`;
}

export function useSelect(options) {
  return options.length > 3 || options.some((option) => option.length > 22);
}

export async function fileToDataUrl(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}
