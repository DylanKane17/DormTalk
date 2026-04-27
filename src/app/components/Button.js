export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const baseStyles =
    "px-4 py-2.5 rounded-xl font-semibold tracking-tight transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent";

  const variants = {
    primary:
      "text-white bg-[linear-gradient(135deg,var(--brand-blue),var(--brand-green))] hover:brightness-105 active:brightness-95 focus:ring-[var(--brand-blue)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
    secondary:
      "bg-[var(--surface)] text-[var(--brand-blue-strong)] border border-[var(--border-strong)] hover:bg-[var(--surface-elevated)] active:brightness-95 focus:ring-[var(--brand-blue)]",
    danger:
      "bg-[color-mix(in_oklch,var(--error)_88%,black_8%)] text-white hover:brightness-110 active:brightness-95 focus:ring-[var(--error)] shadow-[var(--shadow-sm)]",
    success:
      "bg-[var(--brand-green-strong)] text-white hover:brightness-108 active:brightness-95 focus:ring-[var(--brand-green-strong)] shadow-[var(--shadow-sm)]",
    ghost:
      "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)] active:brightness-95 focus:ring-[var(--brand-blue)]",
    outline:
      "bg-transparent text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface)] hover:border-[var(--border-strong)] active:brightness-95 focus:ring-[var(--brand-blue)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
