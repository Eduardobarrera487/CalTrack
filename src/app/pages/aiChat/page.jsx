'use client';
import { useState, useRef } from "react";
import ReverseArrowButton from '@/app/_components/ReverseArrowButton';
import ThreeDotsButton from '@/app/_components/ThreeDotsButton';
import SendButton from '@/app/_components/SendButton';
import Sidebar from '@/app/_components/Sidebar';
import BottomNavBar from "@/app/_components/BottomNavBar";
import AIConnection from "@/app/_components/aiConnection";
import ReactMarkdown from 'react-markdown';

function LoadingDots() {
  return (
    <span className="inline-block w-6 text-center align-middle">
      <span className="animate-bounce inline-block">.</span>
      <span className="animate-bounce inline-block" style={{ animationDelay: '0.2s' }}>.</span>
      <span className="animate-bounce inline-block" style={{ animationDelay: '0.4s' }}>.</span>
    </span>
  );
}

export default function AiChat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "¡Hola! Estoy aquí para responder tus preguntas sobre salud.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Función para enviar mensaje
  const handleSend = async () => {
    const value = inputRef.current?.value.trim();
    if (value && !loading) {
      // Agrega el mensaje del usuario
      setMessages((prev) => [
        ...prev,
        { type: "user", text: value }
      ]);
      inputRef.current.value = '';
      setLoading(true);
      // Muestra animación de carga
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: <LoadingDots key="loading" />, loading: true }
      ]);
      // Obtiene la respuesta de la IA
      const response = await AIConnection(value);
      setMessages((prev) => {
        // Reemplaza el mensaje de loading por la respuesta real
        const last = prev.slice(0, -1);
        return [
          ...last,
          { type: "ai", text: response }
        ];
      });
      setLoading(false);
    }
  };

  return (
    <>

      <div className="md:px-30 flex flex-col bg-white min-h-screen p-2 pt-8 gap-3 font-[family-name:var(--font-geist-sans)] relative">
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

        <main className="flex-1 overflow-y-auto p-4 pb-44"> {/* aumenta el pb para dejar espacio */}
          <div className="flex flex-col gap-4 mt-4">
            {messages.map((msg, idx) =>
              msg.type === "ai" ? (
                <div key={idx} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <div className="text-gray-700">
                    {msg.loading
                      ? <LoadingDots />
                      : <ReactMarkdown>{String(msg.text)}</ReactMarkdown>
                    }
                  </div>
                </div>
              ) : (
                <div key={idx} className="bg-blue-100 p-4 rounded-lg shadow-md self-end">
                  <p className="text-cyan-800">{msg.text}</p>
                </div>
              )
            )}
          </div>
        </main>

        {/* Input en posición absoluta, fijo arriba del BottomNavBar */}
        <div className="fixed left-0 right-0 bottom-16 flex justify-center items-center border-t-2 border-gray-300 bg-white z-20">
          <div className="p-4 rounded-lg shadow-md w-full md:px-30 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe tu mensaje..."
              className="w-full text-gray-700 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  await handleSend();
                }
              }}
            />
            <SendButton onClick={handleSend} disabled={loading} />
          </div>
        </div>

      </div>
      <BottomNavBar active="Chat IA" />

    </>
  );
}