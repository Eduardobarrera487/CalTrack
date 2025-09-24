"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useMemo } from "react";

export default function WeightChart({ history }) {
  const [selected, setSelected] = useState(1); // meses

  const buttons = [
    { label: "1 mes", value: 1 },
    { label: "2 meses", value: 2 },
    { label: "3 meses", value: 3 },
    { label: "6 meses", value: 6 },
  ];

  const dataFiltered = useMemo(() => {
    if (!Array.isArray(history)) return [];

    const now = new Date();
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - selected);

    const filtered = history
      .filter((item) => new Date(item.fecha) >= pastDate)
      .map((item) => ({
        day: new Date(item.fecha).toLocaleDateString("es-ES", {
          month: "short",
          day: "numeric",
        }),
        weight: item.peso,
      }));

    // Si solo hay un punto, duplicar uno artificialmente
    if (filtered.length === 1) {
      const original = filtered[0];
      return [
        { ...original, day: "Prev." },
        original,
      ];
    }

    return filtered;
  }, [history, selected]);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg px-3 py-2 border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-sm text-blue-900">
            {payload[0].value} lbs
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      {/* Botones de rango */}
      <div className="w-80 flex justify-between">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setSelected(btn.value)}
            className={`flex flex-col items-center justify-center w-[76px] h-14 rounded-lg text-sm font-medium font-inter transition-all ${
              selected === btn.value
                ? "bg-blue-900 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{btn.label.split(" ")[0]}</span>
            <span>{btn.label.split(" ")[1]}</span>
          </button>
        ))}
      </div>

      {/* Gráfica */}
      <div className="w-80 h-72 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        {dataFiltered.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataFiltered} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis
                tickFormatter={(value) => `${value} lbs`}
                tick={{ fontSize: 12, fill: "#374151" }}
                domain={["auto", "auto"]}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="url(#lineColor)"
                strokeWidth={3}
                dot={{ r: 4, fill: "#1E40AF" }}
                activeDot={{ r: 6, stroke: "#1E40AF", strokeWidth: 2, fill: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 text-sm">
            No hay datos para mostrar.
          </p>
        )}
      </div>
    </div>
  );
}
