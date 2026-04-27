export default function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`ui-shell rounded-2xl p-6 transition-all duration-300 ${
        hover
          ? "hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
          : "shadow-[var(--shadow-sm)]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
