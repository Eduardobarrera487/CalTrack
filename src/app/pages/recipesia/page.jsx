"use client";

import Image from "next/image";
import { Search, Star, Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavBar from "@/app/_components/bottomNavBar";

export default function RecetasIA() {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const router = useRouter();

  const categories = ["Todas", "Usuarios", "Desarrollador"];

  const handleCategoryClick = (cat) => {
    if (cat === "Todas") {
      router.push('/pages/recipes')
;
    } else {
      setActiveCategory(cat);
    }
  };

  return (
    <div className="max-w-[430px] w-full mx-auto min-h-screen pb-16 bg-white px-4 pt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Recetas IA</h1>
        <button className="text-gray-500">
          <svg width="20" height="20" fill="currentColor">
            <circle cx="10" cy="10" r="2" />
            <circle cx="4" cy="10" r="2" />
            <circle cx="16" cy="10" r="2" />
          </svg>
        </button>
      </div>

      <div className="bg-orange-100 rounded-2xl p-4">
        <div className="text-sm font-semibold text-orange-800">Generador IA</div>
        <div className="text-xs text-orange-700">Crea recetas personalizadas</div>
        <button className="mt-2 w-full bg-orange-500 text-white text-sm font-semibold py-2 rounded-xl">
          Generar Nueva Receta
        </button>
      </div>

      <div className="flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`flex-1 text-sm py-1 rounded-full font-medium border ${
              activeCategory === cat
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar recetas..."
          className="w-full pl-10 pr-3 py-2 text-sm border rounded-xl bg-gray-100"
        />
        <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2">Destacada del Día</h2>
        <div className="bg-white rounded-xl shadow p-2">
          <div className="relative">
            <Image
              src="/pastacarbonara.jpg"
              alt="Pasta Carbonara"
              width={400}
              height={200}
              className="rounded-xl w-full h-40 object-cover"
            />
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
              IA
            </div>
            <div className="absolute top-2 right-2 bg-white rounded-full p-1">
              <Heart className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          <div className="p-2">
            <div className="text-sm font-semibold">Pasta Carbonara Perfecta</div>
            <div className="flex items-center text-xs text-gray-500 gap-2 mt-1">
              <span>25 min</span>
              <span>·</span>
              <span>4 personas</span>
              <span>·</span>
              <Star size={12} className="text-yellow-400" />
              <span>4.8</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-xs">
                <Image
                  src="/developer.jpg"
                  alt="Desarrollador"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span>Desarrollador AI</span>
              </div>
              <button className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                Ver Receta
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2">Categorías</h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-2 rounded-xl font-semibold">
            Italiana
          </div>
          <div className="bg-red-100 text-red-800 text-xs px-3 py-2 rounded-xl font-semibold">
            Mexicana
          </div>
          <div className="bg-green-100 text-green-800 text-xs px-3 py-2 rounded-xl font-semibold">
            Saludable
          </div>
          <div className="bg-blue-100 text-blue-800 text-xs px-3 py-2 rounded-xl font-semibold">
            Mariscos
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold">Recetas Recientes</h2>
          <button className="text-xs text-orange-500 font-semibold">Ver todas</button>
        </div>

        <div className="space-y-2">
          <div className="flex gap-3 items-center">
            <Image
              src="/galletas.jpg"
              alt="Galletas"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Galletas de Chocolate</div>
              <div className="text-xs text-gray-500">30 min · 4.5</div>
              <div className="text-xs text-red-500">👤 @maria_chef</div>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Image
              src="/ensalada.jpg"
              alt="Ensalada"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Ensalada Mediterránea</div>
              <div className="text-xs text-gray-500">15 min · 4.9</div>
              <div className="text-xs text-green-600">🤖 IA</div>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Image
              src="/pizza.jpg"
              alt="Pizza"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Pizza Casera</div>
              <div className="text-xs text-gray-500">45 min · 4.7</div>
              <div className="text-xs text-red-500">👤 @carlos_cook</div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
