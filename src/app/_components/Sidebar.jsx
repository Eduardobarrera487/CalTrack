import Link from "next/link";

export default function Sidebar({ open, onClose }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <button
          className="self-end m-4 text-gray-500 hover:text-black text-2xl"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          &times;
        </button>
        <nav className="flex flex-col px-8 mt-8">
          <Link
            href="/about"
            className="text-lg text-gray-700 hover:text-black transition py-4 border-b border-gray-200"
          >
            Sobre nosotros
          </Link>
          <Link
            href="/pages/aiChat"
            className="text-lg text-gray-700 hover:text-black transition py-4 border-b border-gray-200"
          >
            IA Chat
          </Link>
          
        </nav>
      </div>
    </div>
  );
}