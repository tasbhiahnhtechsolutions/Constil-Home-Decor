export default function Logo({ onDark = false }) {
  return (
    <span className={onDark ? "logo on-dark" : "logo"} aria-label="CONSTIL">
      CONST<span>IL</span>
    </span>
  );
}
