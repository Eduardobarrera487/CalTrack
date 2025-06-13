"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import BottomNavBar from "@/app/_components/bottomNavBar"
import { useState, useEffect } from "react"

export default function ActivityDashboard() {
  const router = useRouter()
  const [history, setHistory] = useState([])

  const goToRecipes = () => {
    router.push('/pages/recipes')
  }

  const goToAddExercise = () => {
    router.push('/pages/add-exercise')
  }

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("exerciseHistory")) || []
    setHistory(stored)
  }, [])

  return (
    <div className="max-w-[430px] w-full mx-auto min-h-screen pb-20 bg-white">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">CalTrack</h1>
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image src="/user.jpg" alt="Perfil" width={36} height={36} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-4 shadow">
          <p className="text-sm">Calorías quemadas hoy</p>
          <h2 className="text-3xl font-bold">320</h2>
          <p className="text-sm">Meta: 500 cal</p>
          <div className="mt-2 w-full bg-white/30 rounded-full h-2">
            <div className="bg-white h-2 rounded-full w-[64%]" />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-indigo-100 text-indigo-600 font-semibold py-2 rounded-xl">Entrenamientos</button>
          <button
            onClick={goToRecipes}
            className="flex-1 bg-gray-100 text-gray-600 font-semibold py-2 rounded-xl"
          >
            Recetas
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Recomendados por IA</h3>
          <div className="space-y-3 mt-2">
            <div className="bg-pink-100 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-pink-700">Cardio Intenso</h4>
                  <p className="text-sm text-pink-600">Quema hasta 250 calorías</p>
                </div>
                <span className="text-xs text-pink-700 font-semibold">30 min</span>
              </div>
              <button className="mt-2 bg-pink-600 text-white py-1 px-3 rounded-lg text-sm font-medium">Agregar recordatorio</button>
            </div>

            <div className="bg-green-100 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-green-700">Yoga Matutino</h4>
                  <p className="text-sm text-green-600">Perfecto para empezar el día</p>
                </div>
                <span className="text-xs text-green-700 font-semibold">20 min</span>
              </div>
              <button className="mt-2 bg-green-600 text-white py-1 px-3 rounded-lg text-sm font-medium">Agregar recordatorio</button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="font-semibold text-lg mb-3">Ejercicios recientes</h3>
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay ejercicios recientes.</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((item, i) => (
                <li
                  key={i}
                  className="bg-white rounded-md p-3 shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>{item.type}</span>
                    <span>{item.duration} min</span>
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between mt-1">
                    <span>Inicio: {item.startTime}</span>
                    <span>Fin: {item.endTime}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={goToAddExercise}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            + Agregar Ejercicio
          </button>
        </div>
      </div>

      <BottomNavBar />
    </div>
  )
}
