// src/app/_components/CaloriesCard.jsx
import { MoreVertical } from "lucide-react";

export default function CaloriesCard() {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Calories</h2>
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* Círculo de progreso */}
      <div className="flex justify-center items-center relative">
        <div className="w-40 h-40 rounded-full border-[15px] border-gray-100 relative">
          <div
            className="absolute inset-0 rounded-full border-[15px] border-blue-900"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-3xl font-bold text-gray-900">1,800</span>
            <span className="text-sm text-gray-500">/ 2,500 kcal</span>
          </div>
        </div>
      </div>

      {/* Macronutrientes */}
      <div className="flex justify-between text-center text-sm">
        <div>
          <div className="w-3 h-3 mx-auto mb-1 rounded-full bg-blue-900" />
          <div className="font-medium text-gray-900">135g</div>
          <div className="text-gray-500 text-xs">Protein</div>
        </div>
        <div>
          <div className="w-3 h-3 mx-auto mb-1 rounded-full bg-emerald-500" />
          <div className="font-medium text-gray-900">200g</div>
          <div className="text-gray-500 text-xs">Carbs</div>
        </div>
        <div>
          <div className="w-3 h-3 mx-auto mb-1 rounded-full bg-orange-500" />
          <div className="font-medium text-gray-900">70g</div>
          <div className="text-gray-500 text-xs">Fats</div>
        </div>
      </div>
    </div>
  );
}
