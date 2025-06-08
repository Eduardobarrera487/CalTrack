"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProgressCard() {
  return (
    <div className="w-full bg-white rounded-lg outline outline-1 outline-gray-200 p-4 space-y-4">
      {/* Título + flecha */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Progress</h2>
        <Link href="/pages/progress">
          <ArrowRight className="w-4 h-4 text-gray-400 hover:text-gray-600 transition" />
        </Link>
      </div>

      {/* Peso actual y meta */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-bold text-gray-900">72.5 kg</div>
          <div className="text-sm text-gray-500">Goal: 68 kg</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-emerald-500">-2.1 kg</div>
          <div className="text-xs text-gray-500">This month</div>
        </div>
      </div>

      {/* Subtarjetas */}
      <div className="grid grid-cols-2 gap-4">
        {/* Calorías */}
        <div className="bg-white rounded-lg outline outline-1 outline-gray-200 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-4 bg-orange-500 rounded" />
            <span className="text-sm text-gray-500">Burned</span>
          </div>
          <div className="text-xl font-bold text-gray-900">420 kcal</div>
        </div>

        {/* Agua */}
        <div className="bg-white rounded-lg outline outline-1 outline-gray-200 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-4 bg-blue-500 rounded" />
            <span className="text-sm text-gray-500">Water</span>
          </div>
          <div className="text-xl font-bold text-gray-900">1.2 L</div>
        </div>
      </div>
    </div>
  );
}
