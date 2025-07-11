"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const mockData = {
  1: [{ day: "01", weight: 74 }, { day: "10", weight: 73 }, { day: "20", weight: 72.5 }],
  2: [{ day: "01", weight: 75 }, { day: "10", weight: 73.5 }, { day: "20", weight: 72.2 }],
  3: [{ day: "01", weight: 76 }, { day: "10", weight: 74 }, { day: "20", weight: 72 }],
  6: [{ day: "01", weight: 78 }, { day: "15", weight: 75 }, { day: "30", weight: 72 }],
};

export default function WeightChart() {
  const [selected, setSelected] = useState(1);

  const buttons = [
    { label: "1 mes", value: 1 },
    { label: "2 meses", value: 2 },
    { label: "3 meses", value: 3 },
    { label: "6 meses", value: 6 },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-md gap-4">
      {/* Selector de meses */}
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
              <span>{btn.value}</span>
              <span>{btn.label.split(" ")[1]}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Gráfica */}
      <div className="w-80 h-72 bg-white rounded-lg outline  outline-offset-[-1px] outline-gray-200 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData[selected]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={['auto', 'auto']} />
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
      </div>
    </div>
  );
}
