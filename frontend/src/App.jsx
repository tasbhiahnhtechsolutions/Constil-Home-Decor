import { useEffect, useState } from "react";
import { insforgeConfigured } from "./api";
import Landing from "./Landing";
import PhotoFlow from "./PhotoFlow";
import ManualForm from "./ManualForm";
import Logo from "./Logo";

function readMode() {
  const start = new URLSearchParams(window.location.search).get("start");
  return start === "photo" || start === "custom" ? start : null;
}

export default function App() {
  const [mode, setMode] = useState(readMode);

  useEffect(() => {
    const onPop = () => setMode(readMode());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function choose(next) {
    const url = new URL(window.location.href);
    url.searchParams.set("start", next);
    window.history.pushState({ start: next }, "", url);
    setMode(next);
  }

  function back() {
    const url = new URL(window.location.href);
    url.searchParams.delete("start");
    window.history.pushState({}, "", url);
    setMode(null);
  }

  const notice = !insforgeConfigured && (
    <p className="notice">InsForge is not connected yet. Add VITE_INSFORGE_URL and VITE_INSFORGE_ANON_KEY to the project .env.</p>
  );

  if (!mode) return <Landing onChoose={choose} notice={notice} />;

  return (
    <div className="studio">
      <header className="topbar">
        <Logo />
        <button type="button" className="btn ghost" onClick={back}>Back to the choice</button>
      </header>
      <section className="hero">
        <p className="eyebrow">{mode === "photo" ? "Photo studio" : "Customize"}</p>
        <h1>{mode === "photo" ? "Start from the room you already have." : "Build the room from choices."}</h1>
        <p>
          {mode === "photo"
            ? "Drop one to three pictures. Answer a short round of choices, confirm the size, then see the remodel and a planning range."
            : "The options change with the room. A bathroom stays a bathroom, and a kitchen stays a kitchen."}
        </p>
      </section>
      {mode === "photo" ? <PhotoFlow /> : <ManualForm />}
    </div>
  );
}
