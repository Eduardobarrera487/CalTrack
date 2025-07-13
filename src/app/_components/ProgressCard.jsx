"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProgressCard({ pesoActual, objetivo, diferenciaMes, caloriasQuemadas }) {
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
          <div className="text-2xl font-bold text-gray-900">{pesoActual.toFixed(1)} lbs</div>
          <div className="text-sm text-gray-500">
            Goal: {objetivo || "No goal"}
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-sm font-medium ${
              diferenciaMes > 0 ? "text-emerald-500" :
              diferenciaMes < 0 ? "text-red-500" :
              "text-gray-500"
            }`}
          >
            {diferenciaMes > 0
              ? `-${diferenciaMes} lbs`
              : diferenciaMes < 0
              ? `+${Math.abs(diferenciaMes)} lbs`
              : "0 lbs"}
          </div>
          <div className="text-xs text-gray-500">This month</div>
        </div>
      </div>

      <div className="bg-white rounded-lg outline outline-gray-200 p-4 space-y-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-4 bg-orange-500 rounded" />
          <span className="text-sm text-gray-500">Burned</span>
        </div>
        <div className="text-xl font-bold text-gray-900">{caloriasQuemadas ?? 0} kcal</div>
      </div>
    </div>
  );
}
