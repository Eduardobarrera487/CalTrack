"use client";

import { Plus } from "lucide-react";

const weightData = [
  { weight: "72.5 kg", date: "06 Jun 2025" },
  { weight: "73.0 kg", date: "05 Jun 2025" },
  { weight: "73.2 kg", date: "04 Jun 2025" },
];

export default function WeightHistory() {
  return (
    <div className="w-96 flex flex-col gap-4 mt-8 relative">
      <h2 className="text-lg font-semibold text-gray-900 ml-6">Historial de Peso</h2>
      <div className="flex flex-col gap-4 px-6">
        {weightData.map((entry, idx) => (
          <div
            key={idx}
            className="w-full h-20 bg-white rounded-lg outline  outline-offset-[-1px] outline-gray-200 px-4 py-3 flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-900 leading-normal">{entry.weight}</span>
              <span className="text-sm text-gray-600 leading-tight">{entry.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Botón flotante con icono de más */}
      <button className="absolute bottom-0 right-6 w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center shadow-lg">
        <Plus size={28} />
      </button>
    </div>
  );
}
