"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddExercisePage() {
  const router = useRouter()

  const [type, setType] = useState("")
  const [duration, setDuration] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!type || !duration || !startTime || !endTime) {
      alert("Por favor completa todos los campos.")
      return
    }

    const newExercise = {
      type,
      duration,
      startTime,
      endTime,
    }

    const current = JSON.parse(localStorage.getItem("exerciseHistory")) || []
    const updated = [...current, newExercise]
    localStorage.setItem("exerciseHistory", JSON.stringify(updated))

    router.push("/pages/workout")
  }

  return (
    <div className="max-w-[430px] mx-auto p-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6">Agregar Ejercicio</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de ejercicio</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Ej: Correr, Yoga..."
            className="mt-1 w-full border rounded-lg p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Duración (minutos)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ej: 30"
            className="mt-1 w-full border rounded-lg p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hora de inicio</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 w-full border rounded-lg p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hora de finalización</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 w-full border rounded-lg p-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Guardar ejercicio
        </button>
      </form>
    </div>
  )
}
