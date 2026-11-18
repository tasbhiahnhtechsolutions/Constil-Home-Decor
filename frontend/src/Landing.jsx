import Logo from "./Logo";

export default function Landing({ onChoose, notice }) {
  return (
    <div className="gate">
      <header className="topbar">
        <Logo onDark />
        <span className="muted">Bathroom & kitchen</span>
      </header>

      <section className="gate-copy">
        <p className="eyebrow">Before anything else</p>
        <h1>How should this room begin?</h1>
        <p>One choice, then the next page. A photo of the room you have, or a design you build from scratch.</p>
      </section>

      <div className="doors">
        <button type="button" className="door" onClick={() => onChoose("photo")}>
          <img className="door-photo" src="/visuals/bathroom.jpg" alt="A real bathroom with a freestanding tub and vessel sink" />
          <span className="door-copy">
            <span className="kicker">01 · Photo</span>
            <strong>Start with a photo</strong>
            <span>Drop the bathroom or kitchen you already have. The questions, the redesign, and the estimate stay on that room.</span>
            <em>Open the photo studio</em>
          </span>
        </button>
        <button type="button" className="door" onClick={() => onChoose("custom")}>
          <img className="door-photo" src="/visuals/kitchen.jpg" alt="A real kitchen with white cabinets and a marble island" />
          <span className="door-copy">
            <span className="kicker">02 · Customize</span>
            <strong>Design without a photo</strong>
            <span>Pick the room, then tap style, color, and the feature that belongs to that space.</span>
            <em>Build it from choices</em>
          </span>
        </button>
      </div>

      <ul className="facts">
        <li>Bathroom choices never include a kitchen.</li>
        <li>You pick a typical size. No tape measure.</li>
        <li>The range is a USD planning estimate.</li>
      </ul>
      {notice}
    </div>
  );
}
