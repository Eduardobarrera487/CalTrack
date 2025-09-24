"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import es from "date-fns/locale/es";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="bg-white shadow-2xl rounded-xl p-3 border border-gray-100 text-center"
      >
        <p className="text-sm font-semibold text-gray-800">
          {format(new Date(label), "dd MMM yyyy, HH:mm", { locale: es })}
        </p>
        <p
          className="text-lg font-bold"
          style={{ color: payload[0].stroke }}
        >
          {payload[0].value} lbs
        </p>
      </motion.div>
    );
  }
  return null;
}

// Determina color según tendencia
const getDotColor = (current, previous) => {
  if (!previous) return "#1d4ed8";
  if (current.peso > previous.peso) return "#ef4444"; // subida
  if (current.peso < previous.peso) return "#10b981"; // bajada
  return "#1d4ed8"; // estable
};

export default function WeightChart({ history }) {
  // Mostrar un punto por día, tomando el último registro
  const filteredHistory = history.reduce((acc, item) => {
    const dateKey = item.fecha.split("T")[0];
    acc[dateKey] = item;
    return acc;
  }, {});

  const data = Object.values(filteredHistory).sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 shadow-2xl"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="fecha"
            tickFormatter={(date) =>
              format(new Date(date), "dd MMM", { locale: es })
            }
            tick={{ fontSize: 12, fill: "#374151" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#374151" }}
            domain={["auto", "auto"]}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="peso"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#weightGradient)"
            activeDot={(props) => {
              const { cx, cy, index } = props;
              const current = data[index];
              const previous = data[index - 1] || null;
              return (
                <AnimatePresence>
                  <motion.circle
                    key={current.fecha}
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#fff"
                    stroke={getDotColor(current, previous)}
                    strokeWidth={3}
                    style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,0.25))" }}
                    initial={{ opacity: 0, r: 0 }}
                    animate={{ opacity: 1, r: 6 }}
                    exit={{ opacity: 0, r: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              );
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
