'use client'

import { useRouter } from 'next/navigation'
import BottomNavBar from '@/app/_components/BottomNavBar'
import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { createClient } from '../../../../utils/supabase/client'

export default function ActivityDashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const CALORIE_GOAL = 500

  const fetchExercises = async () => {
    setLoading(true)

    const { data: sessionData, error: sessionError } = await supabase.auth.getUser()
    const usuario_id = sessionData?.user?.id

    if (sessionError || !usuario_id) {
      console.error("Error obteniendo sesión del usuario:", sessionError)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('entrenamientos')
      .select('*')
      .eq('usuario_id', usuario_id)
      .order('id', { ascending: false })

    if (error) {
      console.error('Error cargando ejercicios:', error.message)
    } else {
      setHistory(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchExercises()
  }, [])

  const goToRecipes = () => {
    router.push('/pages/recipes')
  }

  const goToAddExercise = () => {
    router.push('/pages/add-exercise')
  }

  const handleDelete = async (id) => {
    const confirmDelete = confirm('¿Seguro quieres eliminar este ejercicio?')
    if (!confirmDelete) return

    const { error } = await supabase.from('entrenamientos').delete().eq('id', id)

    if (error) {
      alert('Error eliminando el ejercicio: ' + error.message)
    } else {
      setHistory((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const totalCalories = history.reduce(
    (sum, item) => sum + (item.calorias_quemadas || 0),
    0
  )

  const progressPercent = Math.min((totalCalories / CALORIE_GOAL) * 100, 100)

  const progressColor = () => {
    if (progressPercent < 40) return 'bg-red-500'
    if (progressPercent < 80) return 'bg-yellow-400'
    return 'bg-green-500'
  }

  return (
    <div className="max-w-[430px] w-full mx-auto min-h-screen pb-20 bg-white">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">CalTrack</h1>
        </div>

        <div className="bg-gray-200 rounded-2xl p-4 shadow">
          <p className="text-sm text-gray-700">Calorías quemadas hoy</p>
          <h2 className="text-3xl font-bold text-black">{totalCalories}</h2>

          <div className="mt-3 w-full bg-gray-300 rounded-full h-4 overflow-hidden">
            <div
              className={`${progressColor()} h-4 rounded-full transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-indigo-100 text-indigo-600 font-semibold py-2 rounded-xl">
            Entrenamientos
          </button>
          <button
            onClick={goToRecipes}
            className="flex-1 bg-gray-100 text-gray-600 font-semibold py-2 rounded-xl"
          >
            Recetas
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-black">Recomendados por IA</h3>
          <div className="space-y-3 mt-2">
            {/* Aquí tus recomendaciones... */}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="font-semibold text-lg mb-3 text-black">Ejercicios recientes</h3>

          {loading ? (
            <p className="text-gray-500 text-sm">Cargando ejercicios...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay ejercicios recientes.</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="bg-white rounded-md p-3 shadow-sm border border-gray-200 flex justify-between items-center"
                >
                  <div>
                    <div className="flex justify-between font-semibold text-gray-700">
                      <span>{item.nombre}</span>
                      <span>{item.duracion} min</span>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between mt-1">
                      <span>Calorías: {item.calorias_quemadas}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded"
                    aria-label={`Eliminar ejercicio ${item.nombre}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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

      <BottomNavBar active="Workouts" />
    </div>
  )
}
