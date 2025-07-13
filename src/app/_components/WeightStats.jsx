"use client";

export default function WeightStats({ currentWeight, goalWeight }) {
  const difference = (currentWeight - goalWeight).toFixed(1);

  return (
    <div className="w-80 h-20 bg-white rounded-lg outline outline-offset-[-1px] outline-gray-200 p-4 flex items-center justify-between">
      <div className="flex flex-col items-center justify-center w-24">
        <span className="text-gray-600 text-sm font-normal leading-tight">Peso actual</span>
        <span className="text-gray-900 text-lg font-semibold leading-7">{currentWeight} kg</span>
      </div>

      <div className="flex flex-col items-center justify-center w-24">
        <span className="text-gray-600 text-sm font-normal leading-tight">Meta</span>
        <span className="text-emerald-500 text-lg font-semibold leading-7">{goalWeight} kg</span>
      </div>

      <div className="flex flex-col items-center justify-center w-24">
        <span className="text-gray-600 text-sm font-normal leading-tight">Diferencia</span>
        <span className="text-orange-500 text-lg font-semibold leading-7">{difference} kg</span>
      </div>
    </div>
  );
}
