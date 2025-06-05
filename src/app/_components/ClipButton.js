export default function ClipButton({ onClick }) {
  return (
    <button
      className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
      aria-label="Adjuntar archivo"
      onClick={onClick}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 text-gray-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 13.5V7a4.5 4.5 0 00-9 0v8a6 6 0 0012 0v-5.5"
        />
      </svg>
    </button>
  );
}