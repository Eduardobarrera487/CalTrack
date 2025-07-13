"use client";

import { Plus } from "lucide-react";
import { format } from "date-fns";

export default function WeightHistory({ history }) {
  return (
    <div className="w-96 flex flex-col gap-4 mt-8 relative">
      <h2 className="text-lg font-semibold text-gray-900 ml-6">Historial de Peso</h2>
      <div className="flex flex-col gap-4 px-6">
        {history.map((entry, idx) => (
          <div
            key={idx}
            className="w-full h-20 bg-white rounded-lg outline outline-offset-[-1px] outline-gray-200 px-4 py-3 flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-900 leading-normal">{entry.peso} kg</span>
              <span className="text-sm text-gray-600 leading-tight">
                {format(new Date(entry.fecha), "dd MMM yyyy")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="absolute bottom-0 right-6 w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center shadow-lg">
        <Plus size={28} />
      </button>
    </div>
  );
}
