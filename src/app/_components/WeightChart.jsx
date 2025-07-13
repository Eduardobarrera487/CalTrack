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
        day: new Date(item.fecha).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        weight: item.peso,
      }));

    // Si solo hay un punto, duplicar uno artificialmente
    if (filtered.length === 1) {
      const original = filtered[0];
      return [
        {
          ...original,
          day: "Prev.",
        },
        original,
      ];
    }

    return filtered;
  }, [history, selected]);

  return (
    <div className="flex flex-col items-center w-full max-w-md gap-4">
      <div className="w-80 h-14 flex justify-between">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setSelected(btn.value)}
            className={`w-[76px] h-14 rounded-lg text-sm font-medium font-inter ${
              selected === btn.value
                ? "bg-blue-900 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <span>{btn.label.split(" ")[0]}</span>
              <span>{btn.label.split(" ")[1]}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="w-80 h-72 bg-white rounded-lg outline outline-offset-[-1px] outline-gray-200 p-4">
        {dataFiltered.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataFiltered}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#1E40AF"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 text-sm">No hay datos para mostrar.</p>
        )}
      </div>
    </div>
  );
}
