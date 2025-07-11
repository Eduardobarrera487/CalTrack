'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sun, Moon, CloudSun, Settings } from 'lucide-react'
import BottomNavBar from '@/app/_components/BottomNavBar'

export default function Diary() {
  const router = useRouter()
  const [mealLog, setMealLog] = useState([])

  useEffect(() => {
    localStorage.removeItem('mealLog') // <-- Aquí eliminas el historial al recargar
    const savedLog = JSON.parse(localStorage.getItem('mealLog') || '[]')
    setMealLog(savedLog)
  }, [])

  const iconForMeal = (mealType) => {
    switch (mealType) {
      case 'desayuno':
        return <CloudSun className="text-yellow-500 w-7 h-7 drop-shadow" />
      case 'almuerzo':
        return <Sun className="text-yellow-600 w-7 h-7 drop-shadow" />
      case 'cena':
        return <Moon className="text-gray-700 w-7 h-7 drop-shadow" />
      default:
        return null
    }
  }

  const handleAddMeal = (mealLabel) => {
    const routesMap = {
      'Desayuno': '/pages/breakfast',
      'Almuerzo': '/pages/lunch',
      'Cena': '/pages/dinner',
    }
    const path = routesMap[mealLabel]
    if (path) router.push(path)
  }

  const handleEditMeal = (index, mealType) => {
    const routesMap = {
      desayuno: '/pages/breakfast',
      almuerzo: '/pages/lunch',
      cena: '/pages/dinner',
    }
    const path = routesMap[mealType]
    if (path) {
      router.push(`${path}?editIndex=${index}`)
    }
  }

  return (
    <div className="max-w-[430px] w-full mx-auto min-h-screen pb-24 bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100">
      <div className="p-6 space-y-10">
        <header className="space-y-3 text-center bg-gradient-to-t from-[#7DA0CA] via-[#5483B3] to-[#052659] rounded-3xl p-8 shadow-lg text-white">
          <p className="text-lg font-light max-w-xs mx-auto drop-shadow-sm">
            Selecciona el tiempo de comida para registrar tus alimentos.
          </p>
        </header>

        <section className="grid grid-cols-3 gap-6 px-2">
          {[
            {
              label: 'Desayuno',
              icon: <CloudSun className="mx-auto h-8 w-8 text-yellow-400 drop-shadow" />,
            },
            {
              label: 'Almuerzo',
              icon: <Sun className="mx-auto h-8 w-8 text-yellow-600 drop-shadow" />,
            },
            {
              label: 'Cena',
              icon: <Moon className="mx-auto h-8 w-8 text-gray-700 drop-shadow" />,
            },
          ].map((meal) => (
            <div
              key={meal.label}
              className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center cursor-pointer transition transform hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
            >
              {meal.icon}
              <h3 className="mt-3 text-base font-semibold text-gray-900">{meal.label}</h3>
              <button
                className="mt-4 bg-black text-white text-xs font-semibold px-5 py-1.5 rounded-full shadow-md hover:bg-gray-900 active:scale-95 transition"
                onClick={() => handleAddMeal(meal.label)}
              >
                Agregar
              </button>
            </div>
          ))}
        </section>

        <section className="space-y-8 px-2">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Comidas recientes
          </h2>

          <div className="space-y-5">
            {mealLog.length === 0 ? (
              <p className="text-center text-gray-500">No hay comidas registradas.</p>
            ) : (
              mealLog.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-xl transition hover:shadow-2xl cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {iconForMeal(item.mealType)}
                    <div>
                      <p className="capitalize font-bold text-gray-900 text-lg">{item.mealType}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {item.calories ? `${item.calories} kcal` : '0 kcal'}
                  </div>
                  <Settings
                    className="text-gray-400 w-6 h-6 cursor-pointer hover:text-gray-600 transition"
                    onClick={() => handleEditMeal(index, item.mealType)}
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <BottomNavBar />
    </div>
  )
}
