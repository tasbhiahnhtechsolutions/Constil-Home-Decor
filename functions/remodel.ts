const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const VISION_MODELS = ["google/gemini-2.5-flash", "openai/gpt-4o-mini"];
const EDIT_MODELS = ["openai/gpt-5.4-image-2", "openai/gpt-image-2"];

const VISION_INSTRUCTIONS = `
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
- confidence is high only when a clear reference and most of the floor are visible.
- fixtures must be visible in the photo. Do not list implied fixtures that are not shown.
`.trim();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function parseJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("The vision model did not return JSON.");
  return JSON.parse(text.slice(start, end + 1));
}

async function openrouter(key: string, path: string, payload: unknown) {
  const response = await fetch(`https://openrouter.ai/api/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  if (!response.ok) {
    const error = new Error(`OpenRouter API Error (${response.status}): ${text}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
  return JSON.parse(text);
}

async function analyze(key: string, images: string[]) {
  if (!images.length) throw new Error("Upload a photo first.");
  const content = [
    { type: "text", text: VISION_INSTRUCTIONS },
    ...images.slice(0, 3).map((url) => ({ type: "image_url", image_url: { url } })),
  ];
  let lastError = "The vision model did not return usable JSON.";
  for (const model of VISION_MODELS) {
    try {
      const body = await openrouter(key, "chat/completions", {
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: "You reply with one JSON object only. Never invent a measurement you cannot see." },
          { role: "user", content },
        ],
      });
      const text = body.choices?.[0]?.message?.content;
      const raw = Array.isArray(text) ? text.map((part) => part.text || "").join("") : String(text || "");
      return { vision: parseJson(raw) };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  throw new Error(lastError);
}

async function generate(key: string, prompt: string, images: string[]) {
  const editing = images.length > 0;
  const finalPrompt = editing
    ? "Edit the attached photo of this exact room. Keep the same camera angle, walls, windows, doors, ceiling, and overall layout so the result is still recognizable as this room. Change finishes, colors, fixtures, and furnishings only as described. Do not invent a different room. " + prompt
    : prompt;
  const models = editing ? EDIT_MODELS : [EDIT_MODELS[0]];
  const endpoints = editing ? ["images", "images/generations"] : ["images/generations", "images"];
  let lastError = "OpenRouter API returned no image data.";
  for (const model of models) {
    for (const endpoint of endpoints) {
      try {
        const payload: Record<string, unknown> = { model, prompt: finalPrompt };
        if (editing) {
          payload.input_references = images.slice(0, 3).map((url) => ({
            type: "image_url",
            image_url: { url },
          }));
        }
        const body = await openrouter(key, endpoint, payload);
        const item = body.data?.[0];
        if (item?.b64_json) {
          return { image: `data:image/jpeg;base64,${item.b64_json}` };
        }
        if (item?.url) return { image: item.url };
        lastError = "No valid image data returned from OpenRouter.";
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        const status = (error as { status?: number }).status;
        if (status && status !== 400 && status !== 404 && status !== 405) throw error;
      }
    }
    if (!editing) break;
  }
  throw new Error(lastError);
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const key = Deno.env.get("OPENROUTER_API_KEY");
  if (!key) return json({ error: "OPENROUTER_API_KEY is not set as an InsForge secret." }, 500);
  try {
    const body = await req.json();
    if (body.action === "analyze") return json(await analyze(key, body.images || []));
    if (body.action === "generate") return json(await generate(key, String(body.prompt || ""), body.images || []));
    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
}
