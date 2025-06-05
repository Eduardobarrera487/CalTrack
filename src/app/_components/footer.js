import Link from "next/link";

export default function CustomFooter() {
  return (
    <footer className="flex flex-row justify-center items-center gap-12 border-t-2 border-gray-300 py-2 bg-white">
      <Link href="/home" className="flex flex-col items-center text-gray-700 hover:text-black transition">
        <img src="/home.png" alt="Inicio" className="h-7 w-7 mb-1" />
        <span className="text-xs">Inicio</span>
      </Link>
      <Link href="/comidas" className="flex flex-col items-center text-gray-700 hover:text-black transition">
        <img src="/lunch.png" alt="Comidas" className="h-7 w-7 mb-1" />
        <span className="text-xs">Comidas</span>
      </Link>
      <Link href="/perfil" className="flex flex-col items-center text-gray-700 hover:text-black transition">
        <img src="/user.png" alt="Perfil" className="h-7 w-7 mb-1" />
        <span className="text-xs">Perfil</span>
      </Link>
      <Link href="/rutinas" className="flex flex-col items-center text-gray-700 hover:text-black transition">
        <img src="/weights.png" alt="Rutinas" className="h-7 w-7 mb-1" />
        <span className="text-xs">Rutinas</span>
      </Link>
    </footer>
  );
}