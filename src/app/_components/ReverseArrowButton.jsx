import Link from "next/link";

export default function ReverseArrowButton({ onClick, href}) {
  return (
    <Link
    href={href}
      className="p-2 rounded-full hover:bg-gray-100 transition mb-4"
      aria-label="Volver"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 text-gray-700"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </Link>
  );
}