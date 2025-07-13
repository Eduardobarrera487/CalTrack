"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProgressCard({ pesoActual, metaPeso, diferenciaMes, caloriasQuemadas }) {
  return (
    <div className="w-full bg-white rounded-lg outline outline-gray-200 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Progress</h2>
        <Link href="/pages/progress">
          <ArrowRight className="w-4 h-4 text-gray-400 hover:text-gray-600 transition" />
        </Link>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-bold text-gray-900">{pesoActual.toFixed(1)} kg</div>
          <div className="text-sm text-gray-500">
            Goal: {metaPeso ? `${metaPeso} kg` : "No goal"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-emerald-500">
            {diferenciaMes >= 0 ? `-${diferenciaMes} kg` : `+${Math.abs(diferenciaMes)} kg`}
          </div>
          <div className="text-xs text-gray-500">This month</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg outline outline-gray-200 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-4 bg-orange-500 rounded" />
            <span className="text-sm text-gray-500">Burned</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{caloriasQuemadas} kcal</div>
        </div>

        <div className="bg-white rounded-lg outline outline-gray-200 p-4 space-y-2">
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
