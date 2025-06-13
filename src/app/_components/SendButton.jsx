export default function SendButton({ onClick }) {
  return (
    <button
      className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-900 transition flex items-center justify-center"
      aria-label="Enviar"
      onClick={onClick}
      type="submit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10.5l16.5-6.5-6.5 16.5-2.5-7-7-2.5z"
        />
      </svg>
    </button>
  );
}