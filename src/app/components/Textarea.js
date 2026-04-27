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
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
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
        className={`px-4 py-2.5 bg-white border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 hover:border-gray-400"
        }`}
        {...props}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
      {maxLength && (
        <span className="text-xs text-gray-500 text-right">
          {value?.length || 0}/{maxLength}
        </span>
      )}
    </div>
  );
}
