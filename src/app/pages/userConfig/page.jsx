"use client";
import { useState } from "react";
import ReverseArrowButton from "@/app/_components/ReverseArrowButton";
import Sidebar from "@/app/_components/Sidebar";
import CustomButton from "@/app/_components/button";
import CustomInput from "@/app/_components/input";
import BottomNavBar from "@/app/_components/BottomNavBar";

export default function UserConfig() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white min-h-screen p-2 pt-8 gap-3 font-[family-name:var(--font-geist-sans)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <header className="flex flex-row gap-5 items-center  mb-4 border-b border-gray-300 shadow-lg shadow-gray-200">
        <ReverseArrowButton string="/pages/calories" />
        <nav className="flex items-center gap-3">
          <div className="flex items-start justify-between mb-4">
            <img
              src="/user.png"
              alt="Usuario"
              className="h-12 w-12 rounded-full p-2 object-cover"
            />
          </div>
          <h1 className="text-[1rem] font-bold text-start mb-4 text-black ">
            Configuración de usuario
          </h1>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <section className="max-w-md mx-auto bg-gray-50 rounded-xl shadow-md p-6 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <img
              src="/user.png"
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
            />
            <button className="text-sm text-gray-600 hover:underline ">
              Cambiar foto de perfil    
            </button>
          </div>
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="name">
                Nombre
              </label>
              <CustomInput
                id="name"
                type="text"
                placeholder="Tu nombre"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="email">
                Correo electrónico
              </label>
              <CustomInput
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="password">
                Contraseña
              </label>
              <CustomInput
                id="password"
                type="password"
                placeholder="Nueva contraseña"
                className="w-full"
              />
            </div>
            
            <CustomButton
              type="submit"
              className="w-full text-white"
              text="Guardar Cambios"
            >
            </CustomButton>
          </form>
        </section>
      </main>
        <BottomNavBar active="Profile"/>
    </div>
  );
}