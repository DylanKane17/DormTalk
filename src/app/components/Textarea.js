export default function Textarea({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  rows = 4,
  error = "",
  disabled = false,
  maxLength,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-[var(--text-secondary)]">
          {label}
          {required && <span className="text-[var(--error)] ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className={`px-4 py-2.5 bg-[var(--surface)] border rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] placeholder:opacity-40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent resize-vertical disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? "border-[var(--error)]/70 focus:ring-[var(--error)]"
            : "border-[var(--border)] hover:border-[var(--border-strong)]"
        }`}
        {...props}
      />
      {error && <span className="text-sm text-[var(--error)]">{error}</span>}
      {maxLength && (
        <span className="text-xs text-[var(--text-tertiary)] text-right">
          {value?.length || 0}/{maxLength}
        </span>
      )}
    </div>
  );
}
