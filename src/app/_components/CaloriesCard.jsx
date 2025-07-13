"use client";

import { MoreVertical } from "lucide-react";

export default function CaloriesCard({ data }) {
  if (!data) return null;

  const {
    meta_calorias = 2000,
    consumidas = 0,
    proteinas = 0,
    carbohidratos = 0,
    grasas = 0,
  } = data;

  const progress = Math.min((consumidas / meta_calorias) * 100, 100);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Calories</h2>
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex justify-center items-center relative">
        <div className="w-40 h-40 rounded-full border-[15px] border-gray-100 relative">
          <div
            className="absolute inset-0 rounded-full border-[15px] border-blue-900 transition-all duration-300"
            style={{
              clipPath: `inset(${100 - progress}% 0 0 0)`,
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-3xl font-bold text-gray-900">{consumidas}</span>
            <span className="text-sm text-gray-500">/ {meta_calorias} kcal</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-center text-sm">
        <div>
          <div className="w-3 h-3 mx-auto mb-1 rounded-full bg-blue-900" />
          <div className="font-medium text-gray-900">{proteinas}g</div>
          <div className="text-gray-500 text-xs">Protein</div>
        </div>
        <div>
          <div className="w-3 h-3 mx-auto mb-1 rounded-full bg-emerald-500" />
          <div className="font-medium text-gray-900">{carbohidratos}g</div>
          <div className="text-gray-500 text-xs">Carbs</div>
        </div>
        <div>
          <div className="w-3 h-3 mx-auto mb-1 rounded-full bg-orange-500" />
          <div className="font-medium text-gray-900">{grasas}g</div>
          <div className="text-gray-500 text-xs">Fats</div>
        </div>
      </div>
    </div>
  );
}
