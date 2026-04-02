export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-gray-800 rounded-lg shadow-md shadow-cyan-900/20 border border-gray-700 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
