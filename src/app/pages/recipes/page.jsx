"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Clock3, Heart } from "lucide-react";
import BottomNavBar from "@/app/_components/BottomNavBar";


export default function HomeScreen() {
  const router = useRouter();
  const pathname = usePathname();

  const [activeCategory, setActiveCategory] = useState("");

  const [activeTab, setActiveTab] = useState("Inicio");

  const categories = [
    { id: 1, label: "Entrenamiento", href: "/pages/workout" },
    { id: 2, label: "Recetas", href: "/pages/recipes" },
  ];

  useEffect(() => {
    if (pathname.startsWith("/pages/workout")) {
      setActiveCategory("Entrenamiento");
      setActiveTab(""); 
    } else if (pathname.startsWith("/pages/recipes")) {
      setActiveCategory("Recetas");
      setActiveTab("");
    } /*else if (pathname === "/pages/calories") {
      setActiveCategory("");
      setActiveTab("Inicio");
    } else if (pathname === "/pages/search") {
      setActiveCategory("");
      setActiveTab("Buscar");
    } else if (pathname === "/pages/create") {
      setActiveCategory("");
      setActiveTab("Crear");
    } else if (pathname === "/") {
      setActiveCategory("");
      setActiveTab("Perfil");
    } else {
      setActiveCategory("");
      setActiveTab("");
    }*/
  }, [pathname]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category.label);
    router.push(category.href);
  };

  const handleTabClick = (tabName, href) => {
    setActiveTab(tabName);
    if (href) router.push(href);
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-100 flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-lg font-bold text-amber-600">CalTrack</h1>
        
      </header>

      <section className="flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition ${
              activeCategory === cat.label
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </section>

      <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-violet-500 hover:bg-violet-600 text-white rounded-full p-1.5 shadow-md">
        <Plus className="w-5 h-5" />
      </button>
      <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-500 hover:bg-violet-600 text-white rounded-full p-1.5 shadow-md">
        <Plus className="w-5 h-5" />
      </button>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <article className="bg-white rounded-xl shadow overflow-hidden">
          <div className="relative h-48 w-full">
            <img
              src="/pastaprimaveral.jpg"
              alt="Pasta Primavera"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <img
                src="https://randomuser.me/api/portraits/women/40.jpg"
                alt="Chef Maria"
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
              <span className="font-medium">Chef Maria</span>
            </div>
            <h2 className="text-lg font-semibold">Pasta Primavera</h2>
            <p className="text-sm text-gray-600">Una deliciosa pasta con vegetales frescos</p>

            <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
              <span className="flex items-center gap-1">
                <Clock3 className="w-4 h-4" /> 30 min
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> 128
              </span>
            </div>
          </div>
        </article>

        <div className="grid grid-cols-2 gap-4">
          <article className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="relative h-24 w-full">
              <img
                src="/tacos.jpg"
                alt="Tacos Mexicanos"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 space-y-1">
              <h3 className="text-sm font-semibold">Tacos Mexicanos</h3>
              <div className="flex items-center text-xs text-gray-600 gap-1">
                <Clock3 className="w-3 h-3" /> 20 min
              </div>
            </div>
          </article>

          <article className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="relative h-24 w-full">
              <img
                src="/ensalada.jpg"
                alt="Ensalada Verde"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 space-y-1">
              <h3 className="text-sm font-semibold">Ensalada Verde</h3>
              <div className="flex items-center text-xs text-gray-600 gap-1">
                <Clock3 className="w-3 h-3" /> 15 min
              </div>
            </div>
          </article>
        </div>
      </main>

      <BottomNavBar active="Workouts" />
      
    </div>
  );
}
