'use client';
import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

export default function HeadBar() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = `Hoy, ${now.toLocaleDateString('es-ES', options)}`;
    setCurrentDate(formattedDate);
  }, []);

  return (
    <header className="w-full max-w-md px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
      {/* Logo y Fecha */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-inter">CalTrack</h1>
        <p className="text-sm text-gray-800 font-inter">{currentDate}</p>
      </div>

      {/* Iconos */}
      <div className="flex items-center gap-4">
        {/* Ícono de perfil */}
        <button
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/pages/userConfig';
          }}
          aria-label="Perfil"
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
