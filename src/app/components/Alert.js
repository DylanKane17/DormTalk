"use client";

export default function Alert({ type = "info", message, onClose }) {
  if (!message) return null;

  const types = {
    success: "bg-green-900/30 text-green-300 border-green-700",
    error: "bg-red-900/30 text-red-300 border-red-700",
    info: "bg-cyan-900/30 text-cyan-300 border-cyan-700",
    warning: "bg-yellow-900/30 text-yellow-300 border-yellow-700",
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
