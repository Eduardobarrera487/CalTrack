'use client'

import Image from "next/image"
import BottomNavBar from "@/app/_components/bottomNavBar"

export default function ActivityDashboard() {
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
          <button className="flex-1 bg-gray-100 text-gray-600 font-semibold py-2 rounded-xl">Recetas</button>
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

        <div>
          <h3 className="font-semibold text-lg">Rutinas de Ejercicio</h3>
          <div className="space-y-3 mt-2">
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Correr</h4>
                  <p className="text-sm text-gray-500">Cardio básico</p>
                </div>
                <div className="text-sm text-right">
                  <p>150 cal</p>
                  <p className="text-gray-500">30 min</p>
                </div>
              </div>
              <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded-lg text-sm font-medium">Agregar al total</button>
            </div>

            <div className="bg-red-50 p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Pesas</h4>
                  <p className="text-sm text-gray-500">Fuerza y resistencia</p>
                </div>
                <div className="text-sm text-right">
                  <p>200 cal</p>
                  <p className="text-gray-500">45 min</p>
                </div>
              </div>
              <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded-lg text-sm font-medium">Agregar al total</button>
            </div>

            <div className="bg-green-50 p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Yoga</h4>
                  <p className="text-sm text-gray-500">Flexibilidad y relajación</p>
                </div>
                <div className="text-sm text-right">
                  <p>120 cal</p>
                  <p className="text-gray-500">60 min</p>
                </div>
              </div>
              <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded-lg text-sm font-medium">Agregar al total</button>
            </div>

            <div className="bg-orange-50 p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Ciclismo</h4>
                  <p className="text-sm text-gray-500">Cardio intenso</p>
                </div>
                <div className="text-sm text-right">
                  <p>180 cal</p>
                  <p className="text-gray-500">40 min</p>
                </div>
              </div>
              <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded-lg text-sm font-medium">Agregar al total</button>
            </div>
          </div>
        </div>
      </div>

      <BottomNavBar />
    </div>
  )
}
