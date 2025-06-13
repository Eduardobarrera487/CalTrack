export default function ThreeDotsButton({ onClick }) {
  return (
    <button
      className="p-2 rounded-full hover:bg-gray-100 transition mb-4"
      aria-label="Opciones"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-6 h-6 text-gray-700"
      >
        <circle cx="12" cy="5" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="19" r="2" />
      </svg>
    </button>
  );
}