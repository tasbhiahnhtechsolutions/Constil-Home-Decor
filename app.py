import streamlit as st
import requests
import urllib.parse
import base64
import json
import re
from io import BytesIO
from PIL import Image
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


VISION_MODELS = ("google/gemini-2.5-flash", "openai/gpt-4o-mini")
MISSING_KEY_MESSAGE = "OPENROUTER_API_KEY is missing from .env file or Streamlit Secrets."

BATH_STYLES = [
    "Modern", "Minimalist", "Traditional", "Contemporary", "Industrial",
    "Rustic", "Scandinavian", "Bohemian (Boho)", "Luxury", "Transitional",
]
KITCHEN_STYLES = [
    "Modern", "Minimalist", "Traditional", "Contemporary", "Farmhouse",
    "Industrial", "Transitional", "Luxury",
]
BUDGET_OPTIONS = ["Under $2,000", "$2,000 – $10,000", "$10,000 – $25,000", "$25,000+"]

REMODEL_STATE_KEYS = [
    "vision", "messages", "answers", "q_index", "questions", "room",
    "design_bytes", "estimate", "design_caption", "design_error",
    "dim_length", "dim_width", "dim_height",
]

VISION_INSTRUCTIONS = """
Inspect these remodel photos of one room. Return a single JSON object and nothing else.
Schema:
{
  "room_type": "bathroom" or "kitchen" or "unknown",
  "fixtures": ["short names of visible fixtures"],
  "condition": "one sentence on what the room looks like today",
  "length_ft": number or null,
  "width_ft": number or null,
  "height_ft": number or null,
  "length_low_ft": number or null,
  "length_high_ft": number or null,
  "width_low_ft": number or null,
  "width_high_ft": number or null,
  "height_low_ft": number or null,
  "height_high_ft": number or null,
  "confidence": "low" or "medium" or "high",
  "notes": "the size cue you used, or why the size is unknown"
}
Rules:
- length and width are the floor footprint in feet. height is the ceiling.
- Use null for any dimension you cannot support from the photo. Never invent a precise measurement.
- If you can only support a range, fill the low and high fields and set the single value to null.
- A typical interior door is about 6.7 ft tall and 2.5 ft wide. Use that only when a full door is actually visible.
- confidence is high only when a clear reference and most of the floor are visible.
- fixtures must be visible in the photo. Do not list implied fixtures that are not shown.
""".strip()


def get_api_key(key_name):
    val = os.getenv(key_name)
    if val:
        return val
    try:
        if hasattr(st, "secrets") and key_name in st.secrets:
            return st.secrets[key_name]
    except Exception:
        pass
    return None


def describe_budget(budget):
    if budget < 2000:
        return "clean, simple design using high-efficiency layouts and smart budget-friendly materials."
    if budget < 10000:
        return "mid-range premium styling with solid wood finishes, designer lighting, and high-quality craftsmanship."
    return "ultra-luxurious bespoke finishes, custom craftsmanship, high-end stone/marble slabs, and luxury designer fixtures."


BATH_LAYOUTS = ["Rectangular", "Square", "L-Shaped", "Narrow", "Irregular", "Open Layout"]
BATH_COLOR_PALETTES = [
    "Warm Stone and Wood",
    "Bright White and Chrome",
    "Soft Sage and Brass",
    "Dark Marble and Gold",
    "Coastal Blue and White",
]
FULL_BATH_FEATURES = [
    "Freestanding Soaking Bathtub",
    "Frameless Glass Walk-in Shower",
    "Double Sink Vanity",
    "Full Marble Tile Wall",
    "Brushed Gold Fixtures",
]

ROOM_FORM_CHOICES = {
    "Living Room": {
        "styles": [
            "Japandi (Japanese + Scandinavian)", "Mid-Century Modern", "Scandinavian Hygge",
            "Modern Industrial Loft", "Coastal / Beachy", "Warm Organic Modern",
            "Contemporary Minimalist", "Luxury",
        ],
        "palettes": [
            "Warm Earthy Tones (Terracotta, Beige, Oak)",
            "Neutral & Monochromatic (Cream, Charcoal, Grey)",
            "Soft Pastels (Sage Green, Blush, Soft Gold)",
            "Dark Mood & Dramatic (Emerald, Navy, Matte Black)",
            "Bright & Airy (Pure White, Daylight, Natural Linen)",
        ],
        "features": [
            "Statement Fireplace & Accent Wall",
            "Floor-to-Ceiling Windows",
            "Plush Modular Sofa & Area Rug",
            "Built-in Media Wall",
            "Statement Chandelier",
        ],
    },
    "Master Bedroom": {
        "styles": [
            "Japandi (Japanese + Scandinavian)", "Scandinavian Hygge", "French Country Cottage",
            "Warm Organic Modern", "Contemporary Minimalist", "Luxury", "Coastal / Beachy",
        ],
        "palettes": [
            "Soft Neutrals (Linen, Sand, Warm White)",
            "Warm Earthy Tones (Terracotta, Beige, Oak)",
            "Deep Moody (Navy, Forest, Charcoal)",
            "Blush and Cream",
            "Bright & Airy (White, Oak, Soft Grey)",
        ],
        "features": [
            "Upholstered Bed & Layered Bedding",
            "Built-in Wardrobe",
            "Bedside Lighting & Drapes",
            "Window Seat",
            "Accent Wall Behind the Bed",
        ],
    },
    "Kitchen & Dining Area": {
        "styles": [
            "Modern", "Farmhouse", "Contemporary", "Traditional", "Minimalist",
            "Transitional", "Industrial", "Luxury",
        ],
        "palettes": [
            "White Cabinets and Oak",
            "Sage and Cream",
            "Marble and Brass",
            "Dark Moody Cabinets",
            "Bright White and Stainless",
        ],
        "features": [
            "Large Kitchen Island",
            "Custom Cabinets",
            "Stone Countertops",
            "Dining Table & Pendant Lights",
            "Statement Range Hood",
        ],
    },
    "Home Office / Study": {
        "styles": [
            "Modern", "Mid-Century Modern", "Japandi (Japanese + Scandinavian)",
            "Traditional", "Contemporary Minimalist", "Luxury Executive",
        ],
        "palettes": [
            "Warm Oak and Cream",
            "Neutral Grey and White",
            "Deep Green and Walnut",
            "Black, Leather, and Brass",
            "Light Scandinavian",
        ],
        "features": [
            "Built-in Desk",
            "Floor-to-Ceiling Bookshelves",
            "Task Lighting",
            "Window Beside the Desk",
            "Credenza and Closed Storage",
        ],
    },
    "Entryway / Foyer": {
        "styles": ["Modern", "Traditional", "Transitional", "Coastal / Beachy", "Japandi (Japanese + Scandinavian)"],
        "palettes": [
            "Warm White and Oak",
            "Soft Grey and Black Metal",
            "Cream and Brass",
            "Deep Moody Entry",
            "Bright & Airy",
        ],
        "features": [
            "Console Table & Mirror",
            "Bench and Coat Storage",
            "Statement Pendant",
            "Patterned Tile Floor",
            "Slim Shoe Cabinet",
        ],
    },
    "Outdoor Patio / Balcony": {
        "styles": ["Coastal / Beachy", "Modern", "Rustic", "Bohemian (Boho)", "Mediterranean"],
        "palettes": [
            "Natural Teak and White",
            "Terracotta and Olive",
            "Black Metal and Grey",
            "Coastal Blue and Sand",
            "Lush Green and Cream",
        ],
        "features": [
            "Outdoor Sofa",
            "Dining Set",
            "Pergola or Shade",
            "Planters and Greenery",
            "Outdoor Fire Feature",
        ],
    },
    "Kids Bedroom / Nursery": {
        "styles": ["Soft Scandinavian", "Playful Modern", "Cottage", "Neutral Montessori", "Coastal / Beachy"],
        "palettes": [
            "Soft Sage and Cream",
            "Blush and White",
            "Sky Blue and Oak",
            "Warm Neutral",
            "Sunny Yellow Accents",
        ],
        "features": [
            "Single or Bunk Bed",
            "Toy Storage",
            "Reading Nook",
            "Soft Rug",
            "Wall Mural Accent",
        ],
    },
    "Master Bathroom": {
        "styles": BATH_STYLES,
        "palettes": BATH_COLOR_PALETTES,
        "layouts": BATH_LAYOUTS,
        "features": FULL_BATH_FEATURES,
    },
    "Guest Bathroom": {
        "styles": BATH_STYLES,
        "palettes": BATH_COLOR_PALETTES,
        "layouts": BATH_LAYOUTS,
        "features": [
            "Single Sink Vanity",
            "Tub and Shower Combination",
            "Framed Mirror",
            "Subway Tile Shower",
            "Brushed Nickel Fixtures",
        ],
    },
    "En-Suite Bathroom": {
        "styles": BATH_STYLES,
        "palettes": BATH_COLOR_PALETTES,
        "layouts": BATH_LAYOUTS,
        "features": FULL_BATH_FEATURES,
    },
    "Spa-Style Sanctuary Bathroom": {
        "styles": BATH_STYLES,
        "palettes": BATH_COLOR_PALETTES,
        "layouts": BATH_LAYOUTS,
        "features": [
            "Deep Soaking Bathtub",
            "Steam Walk-in Shower",
            "Stone Tile Wall",
            "Heated Floor Look",
            "Ambient Cove Lighting",
        ],
    },
    "Powder Room (Half Bath)": {
        "styles": BATH_STYLES,
        "palettes": BATH_COLOR_PALETTES,
        "layouts": ["Square", "Narrow", "Rectangular", "Irregular"],
        "features": [
            "Petite Vanity and Vessel Sink",
            "Statement Mirror",
            "Patterned Wallpaper Accent",
            "Small Brass Chandelier",
            "Floating Mini Vanity",
        ],
    },
}


def room_form_choices(room_type):
    return ROOM_FORM_CHOICES[room_type]


def generate_prompt(decor_category, room_type, style, length, width, height, shape_or_palette, key_feature, budget, additional_info=None, color_palette=None):
    budget_vibe = describe_budget(budget)

    if "Home" in decor_category:
        base_prompt = (
            f"A professional high-end interior architecture photograph of a {style} style {room_type}. "
            f"The room measures {length}x{width} feet with {height}-foot high ceilings. "
            f"The space features a {shape_or_palette} color palette and aesthetic. "
            f"Highlighted by {key_feature}. "
            f"The space is built with {budget_vibe} "
            f"Shot from a wide-angle perspective with natural soft sunlight streaming in, highlighting realistic textures, wood grain, fabrics, and ambient shadows. "
            f"Architectural Digest feature quality, photorealistic, 8k resolution, crisp details, no watermark, no text."
        )
    else:
        style_details = {
            "Modern": "clean lines, sleek minimalist vanity, glass walk-in shower, neutral tones, and smart LED backlit mirrors.",
            "Minimalist": "clutter-free design, floating single sink vanity, concealed storage, neutral concrete walls, and a frameless glass shower.",
            "Traditional": "classic wooden cabinetry, marble countertops, brass fixtures, elegant clawfoot bathtub, and wainscoting on walls.",
            "Contemporary": "trendy tile designs, floating black vanity, chrome fixtures, back-lit round mirror, and state-of-the-art layout.",
            "Industrial": "exposed brick walls, black metal accents, pipe-style plumbing fixtures, raw wood vanity, and Edison bulb lighting.",
            "Rustic": "reclaimed wood beams, stone tile accents, copper sink, warm lighting, and a cozy farmhouse feel.",
            "Scandinavian": "light oak wood accents, bright white walls, minimalist design, functional layout, and cozy textured rugs.",
            "Bohemian (Boho)": "potted green plants, woven wicker accessories, pattern tiles, brass fixtures, and a warm earthy color palette.",
            "Luxury": "premium Italian marble walls, double vanity with gold trim, large freestanding soaking tub, ambient cove lighting, and rain shower head.",
            "Transitional": "shaker-style cabinets with modern quartz countertops, sleek fixtures, and classic subway tiling."
        }
        style_desc = style_details.get(style, "clean modern fixtures and matching aesthetic.")
        color_line = f" Color palette: {color_palette}." if color_palette else ""
        base_prompt = (
            f"A professional architectural interior photograph of a {style} style {room_type}. "
            f"The layout is {shape_or_palette.lower()} measuring {length}x{width} feet with {height}-foot high ceilings. "
            f"Featuring {style_desc} Highlighted with {key_feature}.{color_line} "
            f"Built with {budget_vibe} "
            f"Shot from a wide-angle perspective showing realistic reflections on glass, tile, and metallic fixtures. "
            f"High-end magazine interior design style, photorealistic, 8k resolution, crisp details, no watermark, no text."
        )

    if additional_info and additional_info.strip():
        base_prompt += f" Custom requested elements: {additional_info.strip()}."

    return base_prompt


TEXT_IMAGE_MODEL = "openai/gpt-5.4-image-2"
EDIT_IMAGE_MODELS = ("openai/gpt-5.4-image-2", "openai/gpt-image-2")


def renovation_prompt(prompt):
    return (
        "Edit the attached photo of this exact room. "
        "Keep the same camera angle, walls, windows, doors, ceiling, and overall layout so the result is still recognizable as this room. "
        "Change finishes, colors, fixtures, and furnishings only as described. "
        "Do not invent a different room, a different building, or a showroom that does not match the photo. "
        + prompt
    )


def _image_retryable(status_code, body):
    if status_code in (404, 405):
        return True
    if status_code == 400:
        lowered = body.lower()
        return any(token in lowered for token in ("input_reference", "model", "not found", "modality", "no endpoints"))
    return False


def _decode_image_payload(res_json):
    if not isinstance(res_json, dict) or not res_json.get("data"):
        raise ValueError("OpenRouter API returned no image data.")
    data_item = res_json["data"][0]
    if data_item.get("b64_json"):
        return Image.open(BytesIO(base64.b64decode(data_item["b64_json"])))
    if data_item.get("url"):
        img_res = requests.get(data_item["url"], timeout=60)
        img_res.raise_for_status()
        return Image.open(BytesIO(img_res.content))
    raise ValueError("No valid image data or URL returned from OpenRouter API.")


def generate_image(prompt, source_images=None):
    """
    Generate a design. When source_images is set, renovate those photos instead of inventing a new room.
    """
    source_images = [image for image in (source_images or []) if image is not None]
    openrouter_api_key = get_api_key("OPENROUTER_API_KEY")
    if not openrouter_api_key:
        if source_images:
            raise ValueError(MISSING_KEY_MESSAGE)
        encoded_prompt = urllib.parse.quote(prompt)
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true&seed=42"
        res = requests.get(url, timeout=45)
        if res.status_code == 200:
            return Image.open(BytesIO(res.content))
        raise ValueError(MISSING_KEY_MESSAGE)

    if source_images:
        prompt = renovation_prompt(prompt)
    headers = {
        "Authorization": f"Bearer {openrouter_api_key}",
        "Content-Type": "application/json"
    }
    models = EDIT_IMAGE_MODELS if source_images else (TEXT_IMAGE_MODEL,)
    endpoints = (
        ("https://openrouter.ai/api/v1/images", "https://openrouter.ai/api/v1/images/generations")
        if source_images
        else ("https://openrouter.ai/api/v1/images/generations", "https://openrouter.ai/api/v1/images")
    )
    references = [
        {"type": "image_url", "image_url": {"url": jpeg_data_url(image)}}
        for image in source_images[:3]
    ]
    last_error = "OpenRouter API returned no image data."
    for model in models:
        payload = {"model": model, "prompt": prompt}
        if references:
            payload["input_references"] = references
        for url in endpoints:
            response = requests.post(url, headers=headers, json=payload, timeout=120)
            if response.status_code != 200:
                last_error = f"OpenRouter API Error ({response.status_code}): {response.text}"
                if _image_retryable(response.status_code, response.text):
                    continue
                raise Exception(last_error)
            try:
                return _decode_image_payload(response.json())
            except Exception as exc:
                last_error = str(exc)
                continue
        if not source_images:
            break
    raise Exception(last_error)


def clip_text(text, limit=400):
    cleaned = " ".join(str(text or "").split())
    return cleaned[:limit]


def parse_budget(text):
    raw = str(text or "")
    normalized = raw.lower().replace("–", "-").replace(",", "").replace("$", "")
    compact = normalized.replace(" ", "")
    if "under" in normalized:
        return 1500
    if "25000+" in compact:
        return 30000
    if "10000" in compact and "25000" in compact:
        return 15000
    if "2000" in compact and "10000" in compact:
        return 6000
    numbers = re.findall(r"\d+", compact)
    if numbers:
        return float(numbers[0])
    return 5000


def parse_scope(text):
    return "full" if "full" in str(text or "").lower() else "refresh"


def _positive_feet(value, limit):
    if value is None or isinstance(value, bool):
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number <= 0 or number > limit:
        return None
    return round(number, 1)


def _ordered_pair(low, high):
    if low is not None and high is not None and low > high:
        return high, low
    return low, high


def fixture_names(value):
    if value is None:
        return []
    if isinstance(value, str):
        return [value.strip()] if value.strip() else []
    if not isinstance(value, list):
        return []
    names = []
    for item in value:
        if isinstance(item, str) and item.strip():
            names.append(item.strip())
        elif isinstance(item, dict):
            label = item.get("name") or item.get("item") or ""
            if str(label).strip():
                names.append(str(label).strip())
    return names[:12]


def normalize_vision(data):
    if not isinstance(data, dict):
        data = {}
    room = str(data.get("room_type") or "unknown").strip().lower()
    if room not in ("bathroom", "kitchen", "unknown"):
        room = "unknown"
    confidence = str(data.get("confidence") or "low").strip().lower()
    if confidence not in ("low", "medium", "high"):
        confidence = "low"
    length_low, length_high = _ordered_pair(
        _positive_feet(data.get("length_low_ft"), 40),
        _positive_feet(data.get("length_high_ft"), 40),
    )
    width_low, width_high = _ordered_pair(
        _positive_feet(data.get("width_low_ft"), 40),
        _positive_feet(data.get("width_high_ft"), 40),
    )
    height_low, height_high = _ordered_pair(
        _positive_feet(data.get("height_low_ft"), 20),
        _positive_feet(data.get("height_high_ft"), 20),
    )
    return {
        "room_type": room,
        "fixtures": fixture_names(data.get("fixtures")),
        "condition": clip_text(data.get("condition"), 280),
        "length_ft": _positive_feet(data.get("length_ft"), 40),
        "width_ft": _positive_feet(data.get("width_ft"), 40),
        "height_ft": _positive_feet(data.get("height_ft"), 20),
        "length_low_ft": length_low,
        "length_high_ft": length_high,
        "width_low_ft": width_low,
        "width_high_ft": width_high,
        "height_low_ft": height_low,
        "height_high_ft": height_high,
        "confidence": confidence,
        "notes": clip_text(data.get("notes"), 280),
    }


def range_label(vision, axis):
    low = vision.get(f"{axis}_low_ft")
    high = vision.get(f"{axis}_high_ft")
    exact = vision.get(f"{axis}_ft")
    if low is not None and high is not None:
        return f"{low:g}–{high:g} ft"
    if exact is not None:
        return f"about {exact:g} ft"
    return "not estimated from the photo"


def guessed_dim(vision, axis):
    exact = vision.get(f"{axis}_ft")
    low = vision.get(f"{axis}_low_ft")
    high = vision.get(f"{axis}_high_ft")
    if exact is not None:
        value = exact
    elif low is not None and high is not None:
        value = (low + high) / 2
    elif low is not None:
        value = low
    elif high is not None:
        value = high
    else:
        return 0.0
    snapped = round(round(float(value) / 0.5) * 0.5, 1)
    return snapped if snapped > 0 else 0.0


def summary_text(vision):
    room = vision.get("room_type")
    if room == "unknown":
        opening = "I couldn't tell whether this is a bathroom or a kitchen."
    else:
        opening = f"This looks like a {room}."
    fixtures = vision.get("fixtures") or []
    fixture_line = f" Visible: {', '.join(fixtures)}." if fixtures else ""
    condition = vision.get("condition") or ""
    condition_line = f" {condition}" if condition else ""
    size_line = (
        f" Approximate size: length {range_label(vision, 'length')}, "
        f"width {range_label(vision, 'width')}, "
        f"ceiling {range_label(vision, 'height')} "
        f"({vision.get('confidence', 'low')} confidence)."
    )
    notes = vision.get("notes") or ""
    notes_line = f" {notes}" if notes else ""
    return opening + fixture_line + condition_line + size_line + notes_line


def build_questions(vision, room):
    fixtures = [name.lower() for name in (vision.get("fixtures") or [])]
    if room == "kitchen":
        feature = {
            "id": "cabinets",
            "prompt": "What should happen to the cabinets?",
            "options": ["Keep them", "Reface them", "Replace them"],
        }
        material = {
            "id": "countertop",
            "prompt": "What countertop do you want?",
            "options": ["Keep current", "Quartz", "Granite", "Butcher block", "Marble"],
        }
        styles = KITCHEN_STYLES
        style_prompt = "What kitchen style do you want?"
    else:
        if any("tub" in name for name in fixtures):
            wet_prompt = "I see a tub. Keep it, or switch to a walk-in shower?"
        elif any("shower" in name for name in fixtures):
            wet_prompt = "I see a shower. Keep that layout, or change it?"
        else:
            wet_prompt = "What should happen to the tub or shower?"
        feature = {
            "id": "wet",
            "prompt": wet_prompt,
            "options": ["Keep the tub", "Walk-in shower", "Keep the shower", "Tub and shower"],
        }
        material = {
            "id": "tile",
            "prompt": "What tile work do you want?",
            "options": ["Keep most tile", "New floor tile", "New wall and floor tile"],
        }
        styles = BATH_STYLES
        style_prompt = "What bathroom style do you want?"
    questions = []
    if vision.get("room_type") not in ("bathroom", "kitchen"):
        questions.append({
            "id": "room",
            "prompt": "Is this room a bathroom or a kitchen?",
            "options": ["Bathroom", "Kitchen"],
        })
    questions.extend([
        {
            "id": "scope",
            "prompt": "Is this a light refresh, or a full replacement?",
            "options": ["Light refresh", "Full replacement"],
        },
        feature,
        {
            "id": "style",
            "prompt": style_prompt,
            "options": styles,
        },
        material,
        {
            "id": "budget",
            "prompt": "What budget should the planning estimate use?",
            "options": BUDGET_OPTIONS,
        },
        {
            "id": "must_keep",
            "prompt": "What must stay the same? Type it, or choose Nothing specific.",
            "options": ["Nothing specific"],
            "free_text": True,
        },
    ])
    return questions


def money(amount):
    return int(round(float(amount) / 10.0) * 10)


def apply_tier(low, high, budget):
    low = float(low)
    high = float(high)
    if high < low:
        low, high = high, low
    span = high - low
    if budget < 2000:
        return low, low + span * 0.5
    if budget >= 10000:
        return low + span * 0.35, high
    return low, high


def add_line(items, name, low, high, budget):
    tier_low, tier_high = apply_tier(low, high, budget)
    items.append({
        "name": name,
        "low": money(tier_low),
        "high": money(max(tier_high, tier_low)),
    })


def build_estimate(room, length, width, height, answers, budget):
    length = float(length)
    width = float(width)
    height = float(height)
    sqft = length * width
    scope = parse_scope(answers.get("scope"))
    items = []
    notes = [
        f"{length:g} × {width:g} ft ({sqft:.0f} sq ft) with a {height:g} ft ceiling.",
        "Full replacement" if scope == "full" else "Light refresh",
    ]

    if room == "kitchen":
        linear_ft = max(6.0, (length + width) * 1.1)
        notes.append(
            f"Cabinet and counter runs are estimated at about {linear_ft:.0f} linear ft from the footprint, not a measured layout."
        )
        if scope == "full":
            demo = (5 * sqft, 10 * sqft)
            floor = (8 * sqft, 16 * sqft)
        else:
            demo = (2 * sqft, 5 * sqft)
            floor = (4 * sqft, 10 * sqft)
        cabinets_answer = str(answers.get("cabinets") or "")
        if "keep" in cabinets_answer.lower():
            cabinet_rate = (15, 40)
        elif "reface" in cabinets_answer.lower():
            cabinet_rate = (80, 180)
        elif scope == "full":
            cabinet_rate = (150, 400)
        else:
            cabinet_rate = (120, 280)
        counter_answer = str(answers.get("countertop") or "").lower()
        if "keep" in counter_answer:
            counter_rate = (0, 20)
        elif "butcher" in counter_answer:
            counter_rate = (25, 60)
        elif "marble" in counter_answer:
            counter_rate = (70, 140)
        elif "granite" in counter_answer:
            counter_rate = (40, 85)
        else:
            counter_rate = (45, 95)
        appliances = (1500, 5500) if scope == "full" else (0, 900)
        add_line(items, "Demolition and prep", *demo, budget)
        add_line(items, "Cabinets", cabinet_rate[0] * linear_ft, cabinet_rate[1] * linear_ft, budget)
        add_line(items, "Countertop", counter_rate[0] * linear_ft, counter_rate[1] * linear_ft, budget)
        add_line(items, "Flooring", *floor, budget)
        add_line(items, "Appliances allowance", *appliances, budget)
        labor_pct = (0.30, 0.40) if scope == "refresh" else (0.35, 0.45)
    else:
        wall_factor = 1.15 if height > 9 else 1.0
        tile_area = sqft * (2.2 if scope == "full" else 1.0) * wall_factor
        if scope == "full":
            demo = (8 * sqft, 15 * sqft)
            tile_rate = (12, 28)
            plumbing = (1200, 3500)
            vanity = (800, 2800)
            fixtures = (600, 2200)
        else:
            demo = (3 * sqft, 6 * sqft)
            tile_rate = (6, 14)
            plumbing = (300, 800)
            vanity = (350, 1100)
            fixtures = (200, 700)
        wet_answer = str(answers.get("wet") or "").lower()
        keeping_wet = "keep" in wet_answer
        if scope == "refresh" and keeping_wet:
            wet = (150, 500)
        elif scope == "refresh":
            wet = (900, 2500)
        elif keeping_wet:
            wet = (700, 2200)
        else:
            wet = (1800, 6000)
        if "walk-in" in wet_answer or ("shower" in wet_answer and "tub and" not in wet_answer):
            wet_name = "Walk-in shower"
        elif "tub" in wet_answer:
            wet_name = "Bathtub"
        else:
            wet_name = "Shower or tub"
        add_line(items, "Demolition and prep", *demo, budget)
        add_line(items, "Plumbing allowance", *plumbing, budget)
        add_line(items, "Tile", tile_rate[0] * tile_area, tile_rate[1] * tile_area, budget)
        add_line(items, "Vanity", *vanity, budget)
        add_line(items, wet_name, *wet, budget)
        add_line(items, "Fixtures", *fixtures, budget)
        labor_pct = (0.30, 0.40) if scope == "refresh" else (0.35, 0.45)

    subtotal_low = sum(item["low"] for item in items)
    subtotal_high = sum(item["high"] for item in items)
    labor_low = money(subtotal_low * labor_pct[0])
    labor_high = money(max(subtotal_high * labor_pct[1], subtotal_low * labor_pct[0]))
    items.append({"name": "Labor", "low": labor_low, "high": labor_high})

    total_low = sum(item["low"] for item in items)
    total_high = sum(item["high"] for item in items)
    budget_note = None
    if total_low > budget * 1.15:
        budget_note = (
            "This scope prices above the budget you entered. A lighter scope would land closer to that budget."
        )
    return {
        "room": room,
        "scope": scope,
        "sqft": sqft,
        "length": length,
        "width": width,
        "height": height,
        "budget": budget,
        "items": items,
        "total_low": total_low,
        "total_high": total_high,
        "notes": notes,
        "budget_note": budget_note,
        "disclaimer": (
            "Planning range in USD, not a contractor quote. "
            "Photo measurements are approximate until you confirm them. "
            "Tax and country pricing are not included."
        ),
    }


def generate_remodel_prompt(room, length, width, height, answers, vision, budget):
    style = answers.get("style") or "Modern"
    fixtures = ", ".join(vision.get("fixtures") or []) or "the existing fixtures"
    condition = vision.get("condition") or ""
    if room == "kitchen":
        decisions = (
            f"Cabinets: {answers.get('cabinets', 'replace them')}. "
            f"Countertop: {answers.get('countertop', 'quartz')}."
        )
        room_name = "kitchen"
    else:
        decisions = (
            f"Tub and shower: {answers.get('wet', 'a walk-in shower')}. "
            f"Tile: {answers.get('tile', 'new tile')}."
        )
        room_name = "bathroom"
    must = answers.get("must_keep") or ""
    keep = ""
    if must and "nothing specific" not in must.lower():
        keep = f" Keep these elements: {clip_text(must)}."
    condition_line = f"{condition} " if condition else ""
    return (
        f"A professional architectural interior photograph of a remodeled {style} {room_name}. "
        f"The footprint is {length:g} by {width:g} feet with a {height:g}-foot ceiling, "
        f"matching an existing {room_name} that currently has {fixtures}. "
        f"{condition_line}{decisions}{keep} "
        f"Scope: {answers.get('scope', 'a remodel')}. "
        f"The remodel is built with {describe_budget(budget)} "
        f"Wide-angle view, realistic materials, natural light, photorealistic, 8k, crisp details, no watermark, no text, no people."
    )


def jpeg_data_url(image):
    copy = image.copy()
    copy.thumbnail((1280, 1280))
    buffer = BytesIO()
    copy.convert("RGB").save(buffer, format="JPEG", quality=85)
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/jpeg;base64,{encoded}"


def message_text(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for part in content:
            if isinstance(part, str):
                parts.append(part)
            elif isinstance(part, dict):
                parts.append(str(part.get("text") or ""))
        return "".join(parts)
    return str(content or "")


def parse_json_object(text):
    raw = str(text or "").strip()
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end <= start:
        raise ValueError("No JSON object in vision response.")
    return json.loads(raw[start:end + 1])


def _should_try_next_model(status_code, body):
    if status_code == 404:
        return True
    if status_code == 400:
        lowered = body.lower()
        return "model" in lowered or "not found" in lowered or "no endpoints" in lowered
    return False


def analyze_photos(images):
    api_key = get_api_key("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError(MISSING_KEY_MESSAGE)
    if not images:
        raise ValueError("Upload a photo first.")

    content = [{"type": "text", "text": VISION_INSTRUCTIONS}]
    for image in images[:3]:
        content.append({"type": "image_url", "image_url": {"url": jpeg_data_url(image)}})

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    last_error = "The vision model did not return usable JSON."
    for model in VISION_MODELS:
        payload = {
            "model": model,
            "temperature": 0.2,
            "messages": [
                {
                    "role": "system",
                    "content": "You reply with one JSON object only. Never invent a measurement you cannot see.",
                },
                {"role": "user", "content": content},
            ],
        }
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=90,
        )
        if response.status_code != 200:
            last_error = f"OpenRouter API Error ({response.status_code}): {response.text}"
            if _should_try_next_model(response.status_code, response.text):
                continue
            raise Exception(last_error)
        try:
            body = response.json()
            text = message_text(body["choices"][0]["message"]["content"])
            return normalize_vision(parse_json_object(text))
        except Exception:
            last_error = "The vision model did not return usable JSON."
            continue
    raise Exception(last_error)


def load_uploaded_images(files):
    images = []
    for uploaded in files[:3]:
        data = uploaded.getvalue()
        images.append(Image.open(BytesIO(data)).convert("RGB"))
    return images


def ensure_remodel_state():
    st.session_state.setdefault("vision", None)
    st.session_state.setdefault("messages", [])
    st.session_state.setdefault("answers", {})
    st.session_state.setdefault("q_index", 0)
    st.session_state.setdefault("questions", [])
    st.session_state.setdefault("room", None)
    st.session_state.setdefault("design_bytes", None)
    st.session_state.setdefault("estimate", None)
    st.session_state.setdefault("design_caption", "")
    st.session_state.setdefault("design_error", None)
    st.session_state.setdefault("uploader_key", 0)
    st.session_state.setdefault("photo_token", None)


def reset_remodel_state():
    for key in REMODEL_STATE_KEYS:
        st.session_state.pop(key, None)
    ensure_remodel_state()


def begin_interview(vision):
    room = vision["room_type"] if vision["room_type"] in ("bathroom", "kitchen") else "bathroom"
    questions = build_questions(vision, room)
    st.session_state["vision"] = vision
    st.session_state["room"] = room
    st.session_state["questions"] = questions
    known = vision["room_type"] in ("bathroom", "kitchen")
    st.session_state["answers"] = {"room": "Kitchen" if room == "kitchen" else "Bathroom"} if known else {}
    st.session_state["q_index"] = 0
    st.session_state["messages"] = [{
        "role": "assistant",
        "content": summary_text(vision) + "\n\n" + questions[0]["prompt"],
    }]
    st.session_state["design_bytes"] = None
    st.session_state["estimate"] = None
    st.session_state["design_caption"] = ""
    st.session_state["design_error"] = None
    for key in ("dim_length", "dim_width", "dim_height"):
        st.session_state.pop(key, None)


def record_answer(text):
    questions = st.session_state["questions"]
    index = st.session_state["q_index"]
    if index >= len(questions):
        return
    answer = clip_text(text, 300)
    if not answer:
        return
    question = questions[index]
    st.session_state["answers"][question["id"]] = answer
    st.session_state["messages"].append({"role": "user", "content": answer})
    if question["id"] == "room":
        room = "kitchen" if "kitchen" in answer.lower() else "bathroom"
        st.session_state["room"] = room
        st.session_state["questions"] = build_questions(st.session_state["vision"], room)
        questions = st.session_state["questions"]
    index += 1
    st.session_state["q_index"] = index
    if index < len(questions):
        st.session_state["messages"].append({
            "role": "assistant",
            "content": questions[index]["prompt"],
        })
    else:
        st.session_state["messages"].append({
            "role": "assistant",
            "content": (
                "Confirm the room size below. The photo only supports an approximate range, "
                "so edit anything that looks off. Then generate the redesign and planning estimate."
            ),
        })


def use_selectbox(options):
    return len(options) > 3 or any(len(option) > 22 for option in options)


def render_estimate(estimate):
    st.subheader("Planning estimate")
    st.caption(estimate["disclaimer"])
    for note in estimate["notes"]:
        st.write(note)
    for item in estimate["items"]:
        st.markdown(f"**{item['name']}:** ${item['low']:,.0f} – ${item['high']:,.0f}")
    st.markdown(
        f"**Total:** ${estimate['total_low']:,.0f} – ${estimate['total_high']:,.0f}"
    )
    if estimate.get("budget_note"):
        st.warning(estimate["budget_note"])


def render_photo_flow():
    st.subheader("Start from a photo")
    st.caption(
        "Upload one to three photos. The model reads the room and asks how you want the remodel. "
        "You confirm the size before any price is shown."
    )
    uploads = st.file_uploader(
        "Bathroom or kitchen photos",
        type=["jpg", "jpeg", "png"],
        accept_multiple_files=True,
        key=f"photos_{st.session_state['uploader_key']}",
    )
    files = list(uploads or [])
    if len(files) > 3:
        st.warning("Using the first 3 photos.")
        files = files[:3]

    token = tuple((uploaded.name, getattr(uploaded, "size", 0)) for uploaded in files) if files else None
    if token != st.session_state.get("photo_token"):
        st.session_state["photo_token"] = token
        reset_remodel_state()

    images = []
    if files:
        try:
            images = load_uploaded_images(files)
            st.image(images, width=180)
        except Exception:
            st.error("Those files could not be read as JPEG or PNG photos.")
            images = []
    st.session_state["source_images"] = images

    action_cols = st.columns(2)
    if images and action_cols[0].button("Analyze photos", type="primary"):
        with st.spinner("Reading the room from the photo..."):
            try:
                begin_interview(analyze_photos(images))
            except Exception as exc:
                st.error(str(exc))
    if st.session_state.get("vision") and action_cols[1].button("Start over"):
        st.session_state["uploader_key"] += 1
        st.session_state["photo_token"] = None
        reset_remodel_state()
        st.rerun()

    vision = st.session_state.get("vision")
    if not vision:
        return

    for message in st.session_state["messages"]:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    questions = st.session_state["questions"]
    index = st.session_state["q_index"]
    if index < len(questions):
        question = questions[index]
        st.caption(f"Question {index + 1} of {len(questions)}")
        options = question.get("options") or []
        if options and use_selectbox(options):
            choice = st.selectbox(question["prompt"], options, key=f"sel_{question['id']}")
            if st.button("Use this answer", key=f"use_{question['id']}"):
                record_answer(choice)
                st.rerun()
        elif options:
            cols = st.columns(len(options))
            for option_index, option in enumerate(options):
                if cols[option_index].button(option, key=f"opt_{question['id']}_{option_index}"):
                    record_answer(option)
                    st.rerun()
        with st.form(key=f"answer_{question['id']}", clear_on_submit=True):
            typed = st.text_input("Or type an answer", placeholder=question["prompt"])
            submitted = st.form_submit_button("Send answer")
        if submitted and typed.strip():
            record_answer(typed.strip())
            st.rerun()
        return

    st.markdown("**Confirmed brief**")
    labels = {
        "room": "Room",
        "scope": "Scope",
        "wet": "Tub or shower",
        "tile": "Tile",
        "cabinets": "Cabinets",
        "countertop": "Countertop",
        "style": "Style",
        "budget": "Budget",
        "must_keep": "Must stay",
    }
    for question in questions:
        answer = st.session_state["answers"].get(question["id"])
        if answer:
            st.write(f"{labels.get(question['id'], question['id'])}: {answer}")

    if "dim_length" not in st.session_state:
        st.session_state["dim_length"] = guessed_dim(vision, "length")
        st.session_state["dim_width"] = guessed_dim(vision, "width")
        st.session_state["dim_height"] = guessed_dim(vision, "height")

    st.markdown("**Confirm the size**")
    st.caption(
        f"Model range — length {range_label(vision, 'length')}, "
        f"width {range_label(vision, 'width')}, "
        f"ceiling {range_label(vision, 'height')} "
        f"({vision.get('confidence', 'low')} confidence). "
        "Edit these before pricing. A photo is not a tape measure."
    )
    dim_cols = st.columns(3)
    length = dim_cols[0].number_input("Length (ft)", min_value=0.0, max_value=40.0, step=0.5, key="dim_length")
    width = dim_cols[1].number_input("Width (ft)", min_value=0.0, max_value=40.0, step=0.5, key="dim_width")
    height = dim_cols[2].number_input("Ceiling height (ft)", min_value=0.0, max_value=20.0, step=0.5, key="dim_height")

    sizes_missing = length <= 0 or width <= 0 or height <= 0
    if sizes_missing:
        st.info("Enter length, width, and ceiling height. The photo did not confirm a usable size.")

    if st.button("Generate redesign and estimate", type="primary", disabled=sizes_missing):
        answers = st.session_state["answers"]
        budget = parse_budget(answers.get("budget"))
        room = st.session_state.get("room") or "bathroom"
        estimate = build_estimate(room, length, width, height, answers, budget)
        prompt = generate_remodel_prompt(room, length, width, height, answers, vision, budget)
        st.session_state["estimate"] = estimate
        st.session_state["design_error"] = None
        st.session_state["design_bytes"] = None
        with st.spinner(f"Renovating your {room} photo..."):
            try:
                image = generate_image(prompt, images)
                buffer = BytesIO()
                image.convert("RGB").save(buffer, format="JPEG", quality=90)
                st.session_state["design_bytes"] = buffer.getvalue()
                style = answers.get("style") or "Remodel"
                st.session_state["design_caption"] = f"{style} {room} redesign"
            except Exception as exc:
                st.session_state["design_error"] = str(exc)

    estimate = st.session_state.get("estimate")
    if estimate:
        changed = (
            abs(float(estimate["length"]) - float(length)) > 0.01
            or abs(float(estimate["width"]) - float(width)) > 0.01
            or abs(float(estimate["height"]) - float(height)) > 0.01
        )
        if changed:
            st.warning("You changed the size. Generate again to update the design and the estimate.")
        if st.session_state.get("design_bytes"):
            st.image(st.session_state["design_bytes"], caption=st.session_state.get("design_caption") or "Remodel design")
            st.download_button(
                label="Download redesign",
                data=st.session_state["design_bytes"],
                file_name="remodel_design.jpg",
                mime="image/jpeg",
                key="download_remodel",
            )
        if st.session_state.get("design_error"):
            st.error(f"Error generating image: {st.session_state['design_error']}")
        render_estimate(estimate)


def render_manual_form():
    st.subheader("Design without a photo")
    st.caption("Type the room details if you don't have a photo yet.")

    decor_category = st.radio(
        "Choose Design Category:",
        ["🏡 Home Decor", "🛁 Bathroom Decor"],
        horizontal=True,
    )

    st.divider()

    if decor_category == "🏡 Home Decor":
        st.markdown("### 1. Choose Room & Space Type")
        room_type = st.selectbox("Select Room Type:", [
            "Living Room", "Master Bedroom", "Kitchen & Dining Area", "Home Office / Study",
            "Entryway / Foyer", "Outdoor Patio / Balcony", "Kids Bedroom / Nursery"
        ])

        st.markdown("### 2. Room Dimensions & Ceiling")
        size_category = st.radio("Select Size Category:", ["Small", "Medium", "Large", "Custom Range"], key="size_cat_home")
        home_presets = {
            "Small": [(10, 12), (12, 12), (12, 14)],
            "Medium": [(14, 16), (15, 18), (16, 20)],
            "Large": [(18, 22), (20, 25), (25, 30)]
        }
        if size_category in home_presets:
            length, width = st.selectbox(
                "Select dimensions (L x W in ft):",
                home_presets[size_category],
                format_func=lambda dims: f"{dims[0]} x {dims[1]} ft",
                key=f"preset_home_{size_category}",
            )
        else:
            length = st.slider("Custom Length (ft)", 8, 40, 16, key="len_home")
            width = st.slider("Custom Width (ft)", 8, 40, 14, key="wid_home")
        height = st.slider("Ceiling Height (ft)", 8, 16, 9, key="height_home")

        room_choices = room_form_choices(room_type)
        st.markdown("### 3. Design Theme & Color Vibe")
        style = st.selectbox("Select Interior Style:", room_choices["styles"], key=f"style_{room_type}")
        shape_or_palette = st.selectbox("Select Color Palette & Vibe:", room_choices["palettes"], key=f"palette_{room_type}")
        key_feature = st.selectbox("Key Statement Feature:", room_choices["features"], key=f"feature_{room_type}")
    else:
        st.markdown("### 1. Choose Bathroom Sub-Type")
        room_type = st.selectbox("Select Bathroom Type:", [
            "Master Bathroom", "Powder Room (Half Bath)", "Guest Bathroom", "En-Suite Bathroom", "Spa-Style Sanctuary Bathroom"
        ])

        st.markdown("### 2. Bathroom Dimensions & Ceiling")
        size_category = st.radio("Select Size Category:", ["Small", "Medium", "Large", "Custom Range"], key="size_cat_bath")
        bath_presets = {
            "Small": [(3, 5), (4, 6), (5, 7)],
            "Medium": [(5, 8), (6, 9), (7, 10)],
            "Large": [(8, 12), (10, 10), (12, 15)]
        }
        if size_category in bath_presets:
            length, width = st.selectbox(
                "Select dimensions (L x W in ft):",
                bath_presets[size_category],
                format_func=lambda dims: f"{dims[0]} x {dims[1]} ft",
                key=f"preset_bath_{size_category}",
            )
        else:
            length = st.slider("Custom Length (ft)", 3, 20, 8, key="len_bath")
            width = st.slider("Custom Width (ft)", 3, 20, 6, key="wid_bath")
        height = st.slider("Ceiling Height (ft)", 7, 14, 8, key="height_bath")

        room_choices = room_form_choices(room_type)
        st.markdown("### 3. Style, Color & Fixture")
        style = st.selectbox("Select Bathroom Style:", room_choices["styles"], key=f"style_{room_type}")
        color_palette = st.selectbox("Select Color Palette:", room_choices["palettes"], key=f"palette_{room_type}")
        shape_or_palette = st.selectbox("Bathroom layout:", room_choices["layouts"], key=f"layout_{room_type}")
        key_feature = st.selectbox("Key Highlight Fixture:", room_choices["features"], key=f"feature_{room_type}")

    st.markdown("### 4. Budget Range")
    budget_option = st.selectbox("Choose Estimated Budget Range:", [
        "Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $20,000", "$20,000+", "Custom"
    ])

    budget = 5000
    if budget_option == "Under $1,000":
        budget = 1000
    elif budget_option == "$1,000 - $5,000":
        budget = 5000
    elif budget_option == "$5,000 - $10,000":
        budget = 10000
    elif budget_option == "$10,000 - $20,000":
        budget = 20000
    elif budget_option == "$20,000+":
        budget = 30000
    elif budget_option == "Custom":
        budget = st.number_input("Enter Custom Budget (in USD):", min_value=500, step=100)

    st.markdown("### 5. Additional Custom Instructions (Optional)")
    user_prompt = st.text_area(
        "Add specific features, colors, materials, or furniture details:",
        placeholder="e.g., Include indoor plants, oak hardwood floors, a skylight, and black accent handles."
    )

    if st.button("✨ Generate Interior Design", type="primary"):
        with st.spinner(f"Creating your custom {room_type} design..."):
            try:
                prompt = generate_prompt(
                    decor_category, room_type, style, length, width, height,
                    shape_or_palette, key_feature, budget, user_prompt,
                    color_palette=color_palette if "Home" not in decor_category else None,
                )
                image = generate_image(prompt)
                st.image(image, caption=f"Generated {decor_category}: {style} {room_type}")
                st.success("Design generated successfully!")
                out = BytesIO()
                image.convert("RGB").save(out, format="JPEG")
                st.download_button(
                    label="📥 Download High-Res Image",
                    data=out.getvalue(),
                    file_name="decor_design.jpg",
                    mime="image/jpeg",
                    key="download_manual",
                )
            except Exception as exc:
                st.error(f"Error generating image: {exc}")


def main():
    st.set_page_config(page_title="Bathroom & Kitchen Remodel Studio", layout="centered", page_icon="🏡")
    st.title("Bathroom & Kitchen Remodel Studio")
    st.markdown(
        "Upload a bathroom or kitchen photo, answer a few questions, and get a redesign plus a USD planning estimate."
    )
    ensure_remodel_state()
    render_photo_flow()
    if not st.session_state.get("source_images"):
        st.divider()
        render_manual_form()


if __name__ == "__main__":
    main()
