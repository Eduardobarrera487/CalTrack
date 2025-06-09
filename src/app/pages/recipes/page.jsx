"use client";
import { useState } from "react";
import { Menu, Plus, Clock3, Heart, Home, Search, SquarePlus, User } from "lucide-react";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Inicio");
  const categories = [
    { id: 1, label: "Todas" },
    { id: 2, label: "Desarrollador" },
    { id: 3, label: "Usuarios" },
    { id: 4, label: "IA" },
  ];

  return (
    <div className="relative mx-auto max-w-xs min-h-screen bg-gray-100 shadow-lg flex flex-col overflow-hidden">
      
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-lg font-bold text-amber-600">CalTrack</h1>
        <Menu className="w-5 h-5 text-gray-700" />
      </header>

      
      <section className="flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {}}
            className={`whitespace-nowrap px-4 py-1 rounded-full text-sm font-medium border ${
              cat.id === 1 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700"
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

      
      <nav className="bg-white border-t p-2 flex justify-between text-xs text-gray-600">
        <button onClick={() => setActiveTab("Inicio")} className="flex flex-col items-center flex-1 gap-0.5">
          <Home className={`w-5 h-5 ${activeTab === "Inicio" ? "text-amber-600" : ""}`} />
          Inicio
        </button>
        <button onClick={() => setActiveTab("Buscar")} className="flex flex-col items-center flex-1 gap-0.5">
          <Search className="w-5 h-5" />
          Buscar
        </button>
        <button onClick={() => setActiveTab("Crear")} className="flex flex-col items-center flex-1 gap-0.5">
          <SquarePlus className="w-5 h-5" />
          Crear
        </button>
        <button onClick={() => setActiveTab("Perfil")} className="flex flex-col items-center flex-1 gap-0.5">
          <User className="w-5 h-5" />
          Perfil
        </button>
      </nav>
    </div>
  );
}

