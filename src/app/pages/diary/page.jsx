 'use client'

import { Sun, Moon, CloudSun, Settings } from 'lucide-react'
import BottomNavBar from '@/app/_components/BottomNavBar'

export default function Diary() {
  return (
    <div className="max-w-[430px] w-full mx-auto min-h-screen pb-24 bg-white">
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Ingreso de alimentos</h1>
          <p className="text-sm text-gray-600">Selecciona el tiempo de comida para registrar tus alimentos.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            {
              label: 'Desayuno',
              icon: <CloudSun className="mx-auto h-8 w-8 text-gray-500" />,
              time: '6:00 am - 11:00 am',
            },
            {
              label: 'Almuerzo',
              icon: <Sun className="mx-auto h-8 w-8 text-yellow-500" />,
              time: '11:00 am - 4:00 pm',
            },
            {
              label: 'Cena',
              icon: <Moon className="mx-auto h-8 w-8 text-gray-600" />,
              time: '4:00 pm - 10:00 pm',
            },
          ].map((meal) => (
            <div key={meal.label} className="space-y-1">
              {meal.icon}
              <h3 className="text-sm font-semibold">{meal.label}</h3>
              <p className="text-xs text-gray-500">{meal.time}</p>
              <button className="mt-1 text-xs px-3 py-1 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600">
                agregar
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="font-bold text-lg">comidas recientes</h2>

          <div className="space-y-2">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <CloudSun className="text-yellow-400 w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold">desayuno</p>
                  <p className="text-xs text-gray-500">8:50 am</p>
                </div>
              </div>
              <Settings className="text-gray-500 w-5 h-5" />
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <Sun className="text-yellow-500 w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold">almuerzo</p>
                  <p className="text-xs text-gray-500">1:00 pm</p>
                </div>
              </div>
              <Settings className="text-gray-500 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <BottomNavBar />
    </div>
  )
}       