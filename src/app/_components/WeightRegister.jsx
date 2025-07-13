"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";

export default function WeightRegister({ userId, onPesoGuardado }) {
  const [showModal, setShowModal] = useState(false);
  const [nuevoPeso, setNuevoPeso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuardarPeso = async () => {
    const supabase = createClient();
    const pesoFloat = parseFloat(nuevoPeso);
    if (isNaN(pesoFloat)) return;

    setLoading(true);
    const fecha = new Date().toISOString().split("T")[0];

    const { data: existente } = await supabase
      .from("peso_progreso")
      .select("id")
      .eq("usuario_id", userId)
      .eq("fecha", fecha)
      .single();

    let error;
    if (existente) {
      ({ error } = await supabase
        .from("peso_progreso")
        .update({ peso: pesoFloat })
        .eq("id", existente.id));
    } else {
      ({ error } = await supabase
        .from("peso_progreso")
        .insert({
          usuario_id: userId,
          peso: pesoFloat,
          fecha,
        }));
    }

    setLoading(false);

    if (!error) {
      onPesoGuardado(pesoFloat); // ⬅️ actualiza el peso en la UI
      setShowModal(false);
      setNuevoPeso("");
    } else {
      console.error("Error al guardar peso:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-blue-900 text-white py-2 rounded-xl text-sm hover:bg-blue-800 transition flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Registrar peso
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-md w-80 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Registrar nuevo peso</h3>
            <input
              type="number"
              value={nuevoPeso}
              onChange={(e) => setNuevoPeso(e.target.value)}
              placeholder="Ej. 160.5"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarPeso}
                disabled={loading}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm hover:bg-blue-800 disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
