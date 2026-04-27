"use client";

export default function Alert({ type = "info", message, onClose }) {
  if (!message) return null;

  const types = {
    success:
      "bg-[color-mix(in_oklch,var(--brand-green)_20%,transparent)] text-[var(--text-primary)] border-[color-mix(in_oklch,var(--brand-green)_45%,var(--border))]",
    error:
      "bg-[color-mix(in_oklch,var(--error)_16%,transparent)] text-[var(--text-primary)] border-[color-mix(in_oklch,var(--error)_44%,var(--border))]",
    info:
      "bg-[color-mix(in_oklch,var(--brand-blue)_16%,transparent)] text-[var(--text-primary)] border-[color-mix(in_oklch,var(--brand-blue)_42%,var(--border))]",
    warning:
      "bg-[color-mix(in_oklch,var(--warning)_22%,transparent)] text-[var(--text-primary)] border-[color-mix(in_oklch,var(--warning)_44%,var(--border))]",
  };

  return (
    <div
      className={`p-4 rounded-lg border ${types[type]} flex justify-between items-start`}
    >
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-current opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}
