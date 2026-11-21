import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { callRemodel } from "./api";
import {
  BUDGET_OPTIONS,
  CEILING_CHOICES,
  ROOM_SIZES,
  buildEstimate,
  buildQuestions,
  fileToDataUrl,
  normalizeVision,
  parseBudget,
  remodelPrompt,
  suggestSize,
  summaryText,
} from "./logic";

const LABELS = {
  room: "Room",
  scope: "Scope",
  wet: "Tub or shower",
  tile: "Tile",
  cabinets: "Cabinets",
  countertop: "Countertop",
  style: "Style",
  budget: "Budget",
  must_keep: "Must stay",
};

export default function PhotoFlow({ onPhotoCount }) {
  const [photos, setPhotos] = useState([]);
  const [vision, setVision] = useState(null);
  const [room, setRoom] = useState("bathroom");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [dims, setDims] = useState({ length: 0, width: 0, height: 0 });
  const [estimate, setEstimate] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageBudget, setImageBudget] = useState(null);
  const [typed, setTyped] = useState("");
  const [choice, setChoice] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [hot, setHot] = useState(false);
  const [split, setSplit] = useState(58);
  const [fullView, setFullView] = useState("");

  async function readFiles(fileList) {
    const files = [...fileList].filter((file) => file.type.startsWith("image/")).slice(0, 3);
    const next = [];
    for (const file of files) next.push({ name: file.name, url: await fileToDataUrl(file) });
    setPhotos(next);
    reset(next);
  }

  function reset(nextPhotos) {
    setVision(null);
    setQuestions([]);
    setAnswers({});
    setIndex(0);
    setMessages([]);
    setEstimate(null);
    setImageUrl("");
    setImageBudget(null);
    setFullView("");
    setError("");
    onPhotoCount?.(nextPhotos.length);
  }

  async function onFiles(event) {
    await readFiles(event.target.files);
  }

  function startOver() {
    setPhotos([]);
    reset([]);
  }

  async function analyze() {
    setBusy("Reading the room from the photo...");
    setError("");
    try {
      const result = await callRemodel({ action: "analyze", images: photos.map((photo) => photo.url) });
      const nextVision = normalizeVision(result.vision || result);
      const known = nextVision.room_type === "kitchen" || nextVision.room_type === "bathroom";
      const nextRoom = nextVision.room_type === "kitchen" ? "kitchen" : "bathroom";
      const nextQuestions = buildQuestions(nextVision, nextRoom);
      setVision(nextVision);
      setRoom(nextRoom);
      setQuestions(nextQuestions);
      setAnswers(known ? { room: nextRoom === "kitchen" ? "Kitchen" : "Bathroom" } : {});
      setIndex(0);
      setMessages([{ role: "assistant", content: `${summaryText(nextVision)}\n\n${nextQuestions[0].prompt}` }]);
      const suggested = suggestSize(nextRoom, nextVision);
      setDims({
        length: suggested.size.length,
        width: suggested.size.width,
        height: suggested.ceiling.height,
      });
      setEstimate(null);
      setImageUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  }

  function recordAnswer(text) {
    const question = questions[index];
    const answer = text.trim();
    if (!answer) return;
    const nextAnswers = { ...answers, [question.id]: answer };
    let nextRoom = room;
    let nextQuestions = questions;
    if (question.id === "room") {
      nextRoom = answer.toLowerCase().includes("kitchen") ? "kitchen" : "bathroom";
      nextQuestions = buildQuestions(vision, nextRoom);
    }
    const nextIndex = index + 1;
    const nextMessages = [...messages, { role: "user", content: answer }];
    nextMessages.push({
      role: "assistant",
      content: nextIndex < nextQuestions.length
        ? nextQuestions[nextIndex].prompt
        : "Pick the closest room size below. You do not need a tape measure.",
    });
    setAnswers(nextAnswers);
    setRoom(nextRoom);
    setQuestions(nextQuestions);
    setIndex(nextIndex);
    setMessages(nextMessages);
    setTyped("");
    setChoice(nextQuestions[nextIndex]?.options?.[0] || "");
  }

  async function generate() {
    if (dims.length <= 0 || dims.width <= 0 || dims.height <= 0) return;
    const budget = parseBudget(answers.budget);
    const nextEstimate = buildEstimate(room, dims.length, dims.width, dims.height, answers, budget);
    setEstimate(nextEstimate);
    setBusy("Renovating your photo...");
    setError("");
    try {
      const prompt = remodelPrompt(room, dims.length, dims.width, dims.height, answers, vision, budget);
      const result = await callRemodel({
        action: "generate",
        prompt,
        images: photos.map((photo) => photo.url),
      });
      setImageUrl(result.image);
      setImageBudget(budget);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  }

  const question = questions[index];
  const done = vision && index >= questions.length;
  const sizes = ROOM_SIZES[room] || ROOM_SIZES.bathroom;
  const sizeChanged = estimate && (
    estimate.length !== Number(dims.length)
    || estimate.width !== Number(dims.width)
    || estimate.height !== Number(dims.height)
  );
  const budgetChanged = imageUrl && imageBudget != null && imageBudget !== parseBudget(answers.budget);

  useEffect(() => {
    if (!done) return;
    const sizeOk = sizes.some((item) => item.length === Number(dims.length) && item.width === Number(dims.width));
    const ceilingOk = CEILING_CHOICES.some((item) => item.height === Number(dims.height));
    if (sizeOk && ceilingOk) return;
    const suggested = suggestSize(room, vision);
    setDims({
      length: sizeOk ? Number(dims.length) : suggested.size.length,
      width: sizeOk ? Number(dims.width) : suggested.size.width,
      height: ceilingOk ? Number(dims.height) : suggested.ceiling.height,
    });
  }, [done, room, vision, dims.length, dims.width, dims.height, sizes]);

  function raiseBudget(option) {
    const nextAnswers = { ...answers, budget: option };
    const budget = parseBudget(option);
    setAnswers(nextAnswers);
    setEstimate(buildEstimate(room, dims.length, dims.width, dims.height, nextAnswers, budget));
  }
  const stage = !photos.length ? 0 : !vision ? 1 : !done ? 2 : imageUrl ? 4 : 3;

  return (
    <section className="panel">
      <h2>Start from a photo</h2>
      <p className="muted">Drop one to three pictures. The questions stay on this room, and you confirm the size before a price appears.</p>
      <div className="steps" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className={item <= stage ? "step on" : "step"}><span /></div>
        ))}
      </div>
      <label
        className={hot ? "dropzone hot" : "dropzone"}
        onDragOver={(event) => { event.preventDefault(); setHot(true); }}
        onDragLeave={() => setHot(false)}
        onDrop={(event) => { event.preventDefault(); setHot(false); readFiles(event.dataTransfer.files); }}
      >
        <span>
          <strong>{hot ? "Drop it here" : "Drop a bathroom or kitchen photo"}</strong>
          <span className="muted">or click to browse · JPG, PNG</span>
        </span>
        <input aria-label="Bathroom or kitchen photos" type="file" accept="image/jpeg,image/png" multiple onChange={onFiles} />
      </label>
      {photos.length > 0 && (
        <div className="photo-row">
          {photos.map((photo) => <img key={photo.name} className="photo-card" src={photo.url} alt="" />)}
        </div>
      )}
      <div className="actions">
        {photos.length > 0 && <button type="button" className="btn clay" onClick={analyze} disabled={Boolean(busy)}>Analyze photos</button>}
        {photos.length > 0 && <button type="button" className="btn ghost" onClick={startOver}>Start over</button>}
      </div>
      {busy && !busy.startsWith("Renovating") && <p className="muted">{busy}</p>}
      {error && <p className="error">{error}</p>}

      {messages.map((message, messageIndex) => (
        <p key={messageIndex} className={`bubble ${message.role}`}>{message.content}</p>
      ))}

      {question && (
        <div className="ask">
          <p className="muted">Question {index + 1} of {questions.length}</p>
          <div className="chip-grid">
            {question.options.map((option) => (
              <button type="button" key={option} className="chip" onClick={() => recordAnswer(option)}>{option}</button>
            ))}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); recordAnswer(typed); }}>
            <input value={typed} placeholder="Or type your own answer" onChange={(event) => setTyped(event.target.value)} />
            <button className="btn ghost" type="submit">Send</button>
          </form>
        </div>
      )}

      {done && (
        <div>
          <h3>Your brief</h3>
          <div className="brief">
            {questions.map((item) => answers[item.id] && <span className="pill" key={item.id}>{LABELS[item.id]}: {answers[item.id]}</span>)}
          </div>
          <h3>Pick a size</h3>
          <p className="muted">Choose the closest typical size. You do not need the exact length, width, or ceiling height.</p>
          <div className="size-picks">
            <label className="field">
              Room size
              <select
                aria-label="Room size"
                value={sizes.find((item) => item.length === Number(dims.length) && item.width === Number(dims.width))?.label || sizes[1].label}
                onChange={(event) => {
                  const next = sizes.find((item) => item.label === event.target.value);
                  if (next) setDims({ ...dims, length: next.length, width: next.width });
                }}
              >
                {sizes.map((item) => <option key={item.label}>{item.label}</option>)}
              </select>
            </label>
            <label className="field">
              Ceiling
              <select
                aria-label="Ceiling height"
                value={CEILING_CHOICES.find((item) => item.height === Number(dims.height))?.label || CEILING_CHOICES[0].label}
                onChange={(event) => {
                  const next = CEILING_CHOICES.find((item) => item.label === event.target.value);
                  if (next) setDims({ ...dims, height: next.height });
                }}
              >
                {CEILING_CHOICES.map((item) => <option key={item.label}>{item.label}</option>)}
              </select>
            </label>
          </div>
          <button type="button" className="btn clay" style={{ marginTop: 14 }} disabled={Boolean(busy)} onClick={generate}>
            {busy.startsWith("Renovating") ? "Generating the design..." : imageUrl ? "Update redesign and estimate" : "Generate redesign and estimate"}
          </button>
          {(sizeChanged || budgetChanged) && !busy.startsWith("Renovating") && <p className="warn">The size or budget changed. Update the design so the picture matches the estimate.</p>}
          {busy.startsWith("Renovating") && <Generating />}
          {imageUrl && !busy.startsWith("Renovating") && (
            <>
              <div className="compare" style={{ "--pos": `${split}%` }}>
                <img src={imageUrl} alt="Remodeled room" />
                <img className="before" src={photos[0]?.url} alt="" />
                <em className="before-label">Before</em>
                <em className="after">After</em>
                <input aria-label="Compare before and after" type="range" min="4" max="96" value={split} onChange={(event) => setSplit(event.target.value)} />
              </div>
              <button type="button" className="btn ghost" style={{ marginTop: 10 }} onClick={() => setFullView("after")}>View full image</button>
              {fullView && (
                <Lightbox
                  src={fullView === "before" ? photos[0]?.url : imageUrl}
                  alt={fullView === "before" ? "Original room" : "Remodeled room"}
                  onClose={() => setFullView("")}
                  extra={(
                    <>
                      <button type="button" className={fullView === "before" ? "chip on" : "chip"} onClick={() => setFullView("before")}>Before</button>
                      <button type="button" className={fullView === "after" ? "chip on" : "chip"} onClick={() => setFullView("after")}>After</button>
                    </>
                  )}
                />
              )}
            </>
          )}
          {estimate && (
            <Estimate
              estimate={estimate}
              onRaiseBudget={raiseBudget}
              higherBudgets={BUDGET_OPTIONS.filter((option) => parseBudget(option) > Number(estimate.budget))}
            />
          )}
        </div>
      )}
    </section>
  );
}

export function Lightbox({ src, alt, onClose, extra }) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") closeRef.current();
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt || "Full image"} onClick={() => closeRef.current()}>
      <div className="lightbox-bar" onClick={(event) => event.stopPropagation()}>
        {extra}
        <button type="button" className="btn ghost light" onClick={() => closeRef.current()}>Close</button>
      </div>
      <img src={src} alt={alt || ""} onClick={(event) => event.stopPropagation()} />
    </div>,
    document.body,
  );
}

export function Generating() {
  useEffect(() => {
    document.querySelector(".generating")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);
  return (
    <div className="generating" role="status" aria-live="polite">
      <span className="sweep" />
      <div className="copy">
        <span className="spinner" />
        <strong>Generating the design</strong>
        <p>The new room image is being made. Stay on this page.</p>
      </div>
    </div>
  );
}

function moneyRange(low, high) {
  return `$${Number(low).toLocaleString()}–$${Number(high).toLocaleString()}`;
}

function lineFormula(item) {
  const rate = item.unitLow === item.unitHigh
    ? `$${item.unitLow.toLocaleString()}`
    : `$${item.unitLow.toLocaleString()}–$${item.unitHigh.toLocaleString()}`;
  return `${item.qty} ${item.unit} × ${rate}`;
}

function EstimateGroup({ title, items, low, high, totalHigh }) {
  if (!items.length) return null;
  return (
    <section className="quote-group">
      <header>
        <h4>{title}</h4>
        <strong>{moneyRange(low, high)}</strong>
      </header>
      {items.map((item) => (
        <article className="quote-line" key={`${item.group}-${item.name}`}>
          <div className="quote-line-top">
            <div>
              <strong>{item.name}</strong>
              <span>{lineFormula(item)}</span>
            </div>
            <b>{moneyRange(item.low, item.high)}</b>
          </div>
          {item.detail && <p>{item.detail}</p>}
          <div className="track"><i style={{ width: `${Math.max(6, (item.high / totalHigh) * 100)}%` }} /></div>
        </article>
      ))}
    </section>
  );
}

export function Estimate({ estimate, higherBudgets, onRaiseBudget }) {
  const materials = estimate.items.filter((item) => item.group === "Materials");
  const labor = estimate.items.filter((item) => item.group === "Labor");
  return (
    <div className="quote">
      <div className="quote-hero">
        <div>
          <p className="eyebrow">Planning estimate</p>
          <p className="quote-total">{moneyRange(estimate.totalLow, estimate.totalHigh)}</p>
          <p className="muted">{estimate.disclaimer}</p>
        </div>
        <div className="quote-split">
          <div>
            <span>Materials</span>
            <strong>{moneyRange(estimate.materialLow, estimate.materialHigh)}</strong>
          </div>
          <div>
            <span>Labor</span>
            <strong>{moneyRange(estimate.laborLow, estimate.laborHigh)}</strong>
          </div>
        </div>
      </div>
      <ul className="quote-notes">
        {estimate.notes.map((note) => <li key={note}>{note}</li>)}
      </ul>
      <EstimateGroup title="Materials" items={materials} low={estimate.materialLow} high={estimate.materialHigh} totalHigh={estimate.totalHigh} />
      <EstimateGroup title="Labor" items={labor} low={estimate.laborLow} high={estimate.laborHigh} totalHigh={estimate.totalHigh} />
      {estimate.budgetNote && (
        <div className="quote-budget">
          <p className="warn">{estimate.budgetNote}</p>
          {higherBudgets.length > 0 && (
            <div className="chip-grid">
              {higherBudgets.map((option) => (
                <button type="button" key={option} className="chip" onClick={() => onRaiseBudget(option)}>Raise to {option}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
