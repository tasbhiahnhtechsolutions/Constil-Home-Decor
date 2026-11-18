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

function addLine(items, name, low, high, budget) {
  const [tierLow, tierHigh] = applyTier(low, high, budget);
  items.push({ name, low: money(tierLow), high: money(Math.max(tierHigh, tierLow)) });
}

export function buildEstimate(room, length, width, height, answers, budget) {
  const sqft = length * width;
  const scope = parseScope(answers.scope);
  const items = [];
  const notes = [
    `${length} × ${width} ft (${Math.round(sqft)} sq ft) with a ${height} ft ceiling.`,
    scope === "full" ? "Full replacement" : "Light refresh",
  ];

  if (room === "kitchen") {
    const linearFt = Math.max(6, (length + width) * 1.1);
    notes.push(`Cabinet and counter runs are estimated at about ${Math.round(linearFt)} linear ft from the footprint, not a measured layout.`);
    const demo = scope === "full" ? [5 * sqft, 10 * sqft] : [2 * sqft, 5 * sqft];
    const floor = scope === "full" ? [8 * sqft, 16 * sqft] : [4 * sqft, 10 * sqft];
    const cabinets = String(answers.cabinets || "").toLowerCase();
    const cabinetRate = cabinets.includes("keep") ? [15, 40] : cabinets.includes("reface") ? [80, 180] : scope === "full" ? [150, 400] : [120, 280];
    const counter = String(answers.countertop || "").toLowerCase();
    const counterRate = counter.includes("keep") ? [0, 20]
      : counter.includes("butcher") ? [25, 60]
      : counter.includes("marble") ? [70, 140]
      : counter.includes("granite") ? [40, 85]
      : [45, 95];
    const appliances = scope === "full" ? [1500, 5500] : [0, 900];
    addLine(items, "Demolition and prep", demo[0], demo[1], budget);
    addLine(items, "Cabinets", cabinetRate[0] * linearFt, cabinetRate[1] * linearFt, budget);
    addLine(items, "Countertop", counterRate[0] * linearFt, counterRate[1] * linearFt, budget);
    addLine(items, "Flooring", floor[0], floor[1], budget);
    addLine(items, "Appliances allowance", appliances[0], appliances[1], budget);
  } else {
    const wallFactor = height > 9 ? 1.15 : 1;
    const tileArea = sqft * (scope === "full" ? 2.2 : 1) * wallFactor;
    const demo = scope === "full" ? [8 * sqft, 15 * sqft] : [3 * sqft, 6 * sqft];
    const tileRate = scope === "full" ? [12, 28] : [6, 14];
    const plumbing = scope === "full" ? [1200, 3500] : [300, 800];
    const vanity = scope === "full" ? [800, 2800] : [350, 1100];
    const fixtures = scope === "full" ? [600, 2200] : [200, 700];
    const wetAnswer = String(answers.wet || "").toLowerCase();
    const keeping = wetAnswer.includes("keep");
    const wet = scope === "refresh" && keeping ? [150, 500]
      : scope === "refresh" ? [900, 2500]
      : keeping ? [700, 2200]
      : [1800, 6000];
    const wetName = wetAnswer.includes("walk-in") || (wetAnswer.includes("shower") && !wetAnswer.includes("tub and"))
      ? "Walk-in shower"
      : wetAnswer.includes("tub") ? "Bathtub" : "Shower or tub";
    addLine(items, "Demolition and prep", demo[0], demo[1], budget);
    addLine(items, "Plumbing allowance", plumbing[0], plumbing[1], budget);
    addLine(items, "Tile", tileRate[0] * tileArea, tileRate[1] * tileArea, budget);
    addLine(items, "Vanity", vanity[0], vanity[1], budget);
    addLine(items, wetName, wet[0], wet[1], budget);
    addLine(items, "Fixtures", fixtures[0], fixtures[1], budget);
  }

  const laborPct = scope === "refresh" ? [0.3, 0.4] : [0.35, 0.45];
  const subtotalLow = items.reduce((sum, item) => sum + item.low, 0);
  const subtotalHigh = items.reduce((sum, item) => sum + item.high, 0);
  items.push({
    name: "Labor",
    low: money(subtotalLow * laborPct[0]),
    high: money(Math.max(subtotalHigh * laborPct[1], subtotalLow * laborPct[0])),
  });
  const totalLow = items.reduce((sum, item) => sum + item.low, 0);
  const totalHigh = items.reduce((sum, item) => sum + item.high, 0);
  return {
    room, scope, sqft, length, width, height, budget, items,
    totalLow, totalHigh, notes,
    budgetNote: totalLow > budget * 1.15
      ? "This scope prices above the budget you picked. Raise the budget below, or go back and choose a lighter scope."
      : "",
    disclaimer: "Planning range in USD, not a contractor quote. The size is a typical room size, not a tape measurement. Tax and country pricing are not included.",
  };
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
  return {
    room_type: room,
    fixtures,
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

export function buildQuestions(vision, room) {
  const fixtures = (vision.fixtures || []).map((name) => name.toLowerCase());
  const feature = room === "kitchen"
    ? { id: "cabinets", prompt: "What should happen to the cabinets?", options: ["Keep them", "Reface them", "Replace them"] }
    : {
      id: "wet",
      prompt: fixtures.some((name) => name.includes("tub"))
        ? "I see a tub. Keep it, or switch to a walk-in shower?"
        : fixtures.some((name) => name.includes("shower"))
          ? "I see a shower. Keep that layout, or change it?"
          : "What should happen to the tub or shower?",
      options: ["Keep the tub", "Walk-in shower", "Keep the shower", "Tub and shower"],
    };
  const material = room === "kitchen"
    ? { id: "countertop", prompt: "What countertop do you want?", options: ["Keep current", "Quartz", "Granite", "Butcher block", "Marble"] }
    : { id: "tile", prompt: "What tile work do you want?", options: ["Keep most tile", "New floor tile", "New wall and floor tile"] };
  const questions = [];
  if (vision.room_type !== "bathroom" && vision.room_type !== "kitchen") {
    questions.push({ id: "room", prompt: "Is this room a bathroom or a kitchen?", options: ["Bathroom", "Kitchen"] });
  }
  questions.push(
    { id: "scope", prompt: "Is this a light refresh, or a full replacement?", options: ["Light refresh", "Full replacement"] },
    feature,
    { id: "style", prompt: room === "kitchen" ? "What kitchen style do you want?" : "What bathroom style do you want?", options: room === "kitchen" ? KITCHEN_STYLES : BATH_STYLES },
    material,
    { id: "budget", prompt: "What budget should the planning estimate use?", options: BUDGET_OPTIONS },
    { id: "must_keep", prompt: "What must stay the same? Type it, or choose Nothing specific.", options: ["Nothing specific"], freeText: true },
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
