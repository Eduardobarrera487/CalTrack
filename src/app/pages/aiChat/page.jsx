'use client';
import { useState } from "react";
import ReverseArrowButton from '@/app/_components/ReverseArrowButton';
import ThreeDotsButton from '@/app/_components/ThreeDotsButton';
import SendButton from '@/app/_components/SendButton';
import ClipButton from '@/app/_components/ClipButton';
import Sidebar from '@/app/_components/Sidebar';
import BottomNavBar from "@/app/_components/BottomNavBar";

export default function AiChat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white min-h-screen p-2 pt-8 gap-3 font-[family-name:var(--font-geist-sans)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <header className="flex flex-row gap-5 items-center justify-between mb-4 border-b border-gray-300 shadow-lg shadow-gray-200">
        <ReverseArrowButton string="/pages/calories" />
        <nav className="flex items-center gap-3">
          <div className="flex items-start justify-between mb-4">
            <img
              src="/heart-rate.png"
              alt="Logo"
              className="h-12 w-12 rounded-full p-2 object-cover"
            />
          </div>
          <h1 className="text-[1rem] font-bold text-start mb-4 text-black">Asistente de salud IA</h1>
        </nav>
        <ThreeDotsButton onClick={() => setSidebarOpen(true)} />
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="text-gray-700">¡Hola! Estoy aquí para responder tus preguntas sobre salud.</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <p className="text-cyan-800"> Quiero una dieta saludable</p>
          </div>
        </div>
      </main>

      <footer className="flex justify-center items-center mt-4 border-t-2 border-gray-300 mb-15">
        <div className="p-4 rounded-lg shadow-md w-full max-w-md flex gap-2">
          <ClipButton />
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            className="w-full text-gray-700 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <SendButton />
        </div>
      </footer>
      <BottomNavBar active=""/>
    </div>
  );
}