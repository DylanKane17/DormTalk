export default function Textarea({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  rows = 4,
  error = "",
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-200">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-vertical placeholder-gray-400"
      />
      {error && <span className="text-sm text-red-400">{error}</span>}
    </div>
  );
}
