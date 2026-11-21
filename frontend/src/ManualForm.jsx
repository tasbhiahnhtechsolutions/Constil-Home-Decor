import { useMemo, useRef, useState } from "react";
import { callRemodel } from "./api";
import { Estimate, Generating } from "./PhotoFlow";
import { BATH_PRESETS, BATH_ROOMS, HOME_PRESETS, HOME_ROOMS, ROOM_FORM_CHOICES, manualEstimate, manualPrompt, parseBudget } from "./logic";

const MANUAL_BUDGETS = ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $20,000", "$20,000+"];
const MANUAL_BUDGET_VALUE = {
  "Under $1,000": 1000,
  "$1,000 - $5,000": 3000,
  "$5,000 - $10,000": 7500,
  "$10,000 - $20,000": 15000,
  "$20,000+": 25000,
};

export default function ManualForm() {
  const [category, setCategory] = useState("home");
  const rooms = category === "home" ? HOME_ROOMS : BATH_ROOMS;
  const [roomType, setRoomType] = useState(rooms[0]);
  const choices = ROOM_FORM_CHOICES[rooms.includes(roomType) ? roomType : rooms[0]];
  const activeRoom = rooms.includes(roomType) ? roomType : rooms[0];
  const [size, setSize] = useState("Small");
  const presets = category === "home" ? HOME_PRESETS : BATH_PRESETS;
  const [preset, setPreset] = useState(presets.Small[0].join("x"));
  const [custom, setCustom] = useState(category === "home" ? { length: 16, width: 14, height: 9 } : { length: 8, width: 6, height: 8 });
  const [style, setStyle] = useState(choices.styles[0]);
  const [palette, setPalette] = useState(choices.palettes[0]);
  const [layout, setLayout] = useState(choices.layouts?.[0] || "");
  const [feature, setFeature] = useState(choices.features[0]);
  const [budgetOption, setBudgetOption] = useState("$1,000 - $5,000");
  const [customBudget, setCustomBudget] = useState(5000);
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const requestId = useRef(0);

  const safe = useMemo(() => ROOM_FORM_CHOICES[activeRoom], [activeRoom]);
  const styleValue = safe.styles.includes(style) ? style : safe.styles[0];
  const paletteValue = safe.palettes.includes(palette) ? palette : safe.palettes[0];
  const featureValue = safe.features.includes(feature) ? feature : safe.features[0];
  const layoutValue = safe.layouts?.includes(layout) ? layout : safe.layouts?.[0];
  const [length, width] = size === "Custom Range"
    ? [Number(custom.length), Number(custom.width)]
    : String(preset).split("x").map(Number);
  const height = Number(custom.height);
  const budget = budgetOption === "Custom" ? Number(customBudget) : (MANUAL_BUDGET_VALUE[budgetOption] ?? parseBudget(budgetOption));
  const estimate = length > 0 && width > 0 && height > 0
    ? manualEstimate({
      category,
      roomType: activeRoom,
      length,
      width,
      height,
      feature: featureValue,
      palette: paletteValue,
      budget,
    })
    : null;

  function switchCategory(next) {
    const nextRooms = next === "home" ? HOME_ROOMS : BATH_ROOMS;
    setCategory(next);
    setRoomType(nextRooms[0]);
    setSize("Small");
    setPreset((next === "home" ? HOME_PRESETS : BATH_PRESETS).Small[0].join("x"));
    setCustom(next === "home" ? { length: 16, width: 14, height: 9 } : { length: 8, width: 6, height: 8 });
  }

  function startOver() {
    requestId.current += 1;
    switchCategory("home");
    setStyle("");
    setPalette("");
    setLayout("");
    setFeature("");
    setBudgetOption("$1,000 - $5,000");
    setCustomBudget(5000);
    setNotes("");
    setImageUrl("");
    setError("");
    setBusy(false);
  }

  async function generate(event) {
    event.preventDefault();
    const id = ++requestId.current;
    setBusy(true);
    setError("");
    setImageUrl("");
    try {
      const prompt = manualPrompt(
        category, activeRoom, styleValue, length, width, height,
        category === "home" ? paletteValue : layoutValue,
        featureValue, budget, notes, category === "home" ? "" : paletteValue,
      );
      const result = await callRemodel({ action: "generate", prompt, images: [] });
      if (id !== requestId.current) return;
      setImageUrl(result.image);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err.message);
    } finally {
      if (id === requestId.current) setBusy(false);
    }
  }

  return (
    <form className="panel" onSubmit={generate}>
      <div className="split">
        <div>
          <div className="panel-head">
            <div>
              <h2>Design without a photo</h2>
              <p className="muted">Pick the room, then tap a look. The choices stay specific to that space.</p>
            </div>
            <button type="button" className="btn ghost" onClick={startOver}>Start over</button>
          </div>
          <div className="switch" role="radiogroup" aria-label="Choose Design Category:">
            <button type="button" className={category === "home" ? "on" : ""} onClick={() => switchCategory("home")}>Home decor</button>
            <button type="button" className={category === "bath" ? "on" : ""} onClick={() => switchCategory("bath")}>Bathroom decor</button>
          </div>
          <p className="muted" style={{ marginTop: 16 }}>{category === "home" ? "Room" : "Bathroom type"}</p>
          <div className="room-grid">
            {rooms.map((room) => (
              <button type="button" key={room} className={activeRoom === room ? "tile on" : "tile"} onClick={() => setRoomType(room)}>
                {room}
              </button>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 16 }}>Size</p>
          <div className="chip-grid">
            {Object.keys(presets).concat("Custom Range").map((item) => (
              <button type="button" key={item} className={size === item ? "chip on" : "chip"} onClick={() => { setSize(item); if (presets[item]) setPreset(presets[item][0].join("x")); }}>{item}</button>
            ))}
          </div>
          {size !== "Custom Range" ? (
            <div className="chip-grid">
              {presets[size].map(([length, width]) => {
                const value = `${length}x${width}`;
                return <button type="button" key={value} className={preset === value ? "chip on" : "chip"} onClick={() => setPreset(value)}>{length} x {width} ft</button>;
              })}
            </div>
          ) : (
            <div className="dims">
              <label className="dim"><span>Length (ft)</span><input type="number" value={custom.length} onChange={(event) => setCustom({ ...custom, length: event.target.value })} /></label>
              <label className="dim"><span>Width (ft)</span><input type="number" value={custom.width} onChange={(event) => setCustom({ ...custom, width: event.target.value })} /></label>
            </div>
          )}
          <label className="field" style={{ display: "block", marginTop: 12 }}>
            Ceiling height (ft)
            <input type="number" value={custom.height} onChange={(event) => setCustom({ ...custom, height: event.target.value })} />
          </label>
          <Choice label="Style" options={safe.styles} value={styleValue} onPick={setStyle} />
          <Choice label="Color palette" options={safe.palettes} value={paletteValue} onPick={setPalette} />
          {category === "bath" && <Choice label="Bathroom layout" options={safe.layouts} value={layoutValue} onPick={setLayout} />}
          <Choice label="Key feature" options={safe.features} value={featureValue} onPick={setFeature} />
          <Choice label="Budget" options={["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $20,000", "$20,000+", "Custom"]} value={budgetOption} onPick={setBudgetOption} />
          {budgetOption === "Custom" && (
            <label className="field" style={{ display: "block", marginTop: 12 }}>
              Custom budget (USD)
              <input type="number" min="500" step="100" value={customBudget} onChange={(event) => setCustomBudget(event.target.value)} />
            </label>
          )}
          <label className="field" style={{ display: "block", marginTop: 12 }}>
            Notes
            <textarea rows="3" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Specific materials, colors, or fixtures" />
          </label>
          {estimate && (
            <Estimate
              estimate={estimate}
              onRaiseBudget={setBudgetOption}
              higherBudgets={MANUAL_BUDGETS.filter((option) => MANUAL_BUDGET_VALUE[option] > budget)}
            />
          )}
          <button className="btn clay" style={{ marginTop: 16 }} disabled={busy}>
            {busy ? "Generating the design..." : "Generate interior design"}
          </button>
          {busy && <Generating />}
          {error && <p className="error">{error}</p>}
          {imageUrl && !busy && <img src={imageUrl} alt="Generated design" style={{ marginTop: 16, borderRadius: 24 }} />}
        </div>
        <aside className="mood">
          <p className="kicker">Your brief</p>
          <h3>{activeRoom}</h3>
          <p>{styleValue}</p>
          <p>{paletteValue}</p>
          <p>{featureValue}</p>
          <p>{size === "Custom Range" ? `${custom.length} x ${custom.width} ft` : preset.replace("x", " x ") + " ft"}</p>
        </aside>
      </div>
    </form>
  );
}

function Choice({ label, options, value, onPick }) {
  return (
    <div style={{ marginTop: 16 }}>
      <p className="muted">{label}</p>
      <div className="chip-grid">
        {options.map((option) => (
          <button type="button" key={option} className={value === option ? "chip on" : "chip"} onClick={() => onPick(option)}>{option}</button>
        ))}
      </div>
    </div>
  );
}
