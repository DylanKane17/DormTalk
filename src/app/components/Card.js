export default function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`bg-blue-50 dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 p-6 transition-all duration-200 ${
        hover
          ? "hover:shadow-lg hover:scale-[1.01] cursor-pointer"
          : "shadow-sm"
      } ${className}`}
    >
      {children}
    </div>
  );
}
