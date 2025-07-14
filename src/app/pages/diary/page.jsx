'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'
import { Sun, Moon, CloudSun, Settings, Trash2 } from 'lucide-react'
import BottomNavBar from '@/app/_components/BottomNavBar'

export default function Diary() {
  const router = useRouter()
  const supabase = createClient()
  const [mealLog, setMealLog] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [mealToDelete, setMealToDelete] = useState(null)

  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser()
    const usuario_id = sessionData?.user?.id

    if (sessionError || !usuario_id) {
      console.error("Error obteniendo sesión del usuario:", sessionError)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('comidas')
      .select(`
        id,
        tipo,
        fecha,
        hora,
        comida_ingredientes (
          cantidad,
          ingrediente_id (
            nombre,
            calorias,
            proteinas,
            carbohidratos,
            grasas
          )
        )
      `)
      .eq('usuario_id', usuario_id)
      .order('fecha', { ascending: false })
      .order('hora', { ascending: false })

    if (error) {
      console.error('Error al obtener comidas:', error)
      setLoading(false)
      return
    }

    const parsed = data.map(comida => ({
      id: comida.id,
      tipo: comida.tipo,
      fecha: comida.fecha,
      hora: comida.hora,
      items: comida.comida_ingredientes.map(ci => ({
        nombre: ci.ingrediente_id.nombre,
        calorias: ci.ingrediente_id.calorias * (ci.cantidad / 100),
        proteinas: ci.ingrediente_id.proteinas * (ci.cantidad / 100),
        carbohidratos: ci.ingrediente_id.carbohidratos * (ci.cantidad / 100),
        grasas: ci.ingrediente_id.grasas * (ci.cantidad / 100),
        cantidad: ci.cantidad,
      }))
    }))

    setMealLog(parsed)
    setLoading(false)
  }

  const iconForMeal = (mealType) => {
    switch (mealType) {
      case 'desayuno': return <CloudSun className="text-yellow-500 w-7 h-7 drop-shadow" />
      case 'almuerzo': return <Sun className="text-yellow-600 w-7 h-7 drop-shadow" />
      case 'cena': return <Moon className="text-gray-700 w-7 h-7 drop-shadow" />
      default: return null
    }
  }

  const handleAddMeal = (mealLabel) => {
    const path = {
      'Desayuno': '/pages/breakfast',
      'Almuerzo': '/pages/lunch',
      'Cena': '/pages/dinner',
    }[mealLabel]
    if (path) router.push(path)
  }

  const confirmDeleteMeal = (mealId) => {
    setMealToDelete(mealId)
    setShowConfirmDelete(true)
  }

  const handleDeleteMeal = async () => {
    if (!mealToDelete) return

    const { error: deleteIngredientsError } = await supabase
      .from('comida_ingredientes')
      .delete()
      .eq('comida_id', mealToDelete)

    const { error: deleteComidaError } = await supabase
      .from('comidas')
      .delete()
      .eq('id', mealToDelete)

    if (deleteIngredientsError || deleteComidaError) {
      console.error("Error eliminando comida:", deleteIngredientsError || deleteComidaError)
      return
    }

    setShowConfirmDelete(false)
    setMealToDelete(null)
    fetchMeals()
  }

  return (
    <div className="max-w-[430px] w-full mx-auto min-h-screen pb-28 bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 flex flex-col">
      <div className="p-6 space-y-10 flex-grow">
        <header className="space-y-3 text-center bg-gradient-to-t from-[#7DA0CA] via-[#5483B3] to-[#052659] rounded-3xl p-8 shadow-lg text-white">
          <p className="text-lg font-light max-w-xs mx-auto drop-shadow-sm">
            Selecciona el tiempo de comida para registrar tus alimentos.
          </p>
        </header>

        <section className="grid grid-cols-3 gap-6 px-2">
          {['Desayuno', 'Almuerzo', 'Cena'].map(label => (
            <div key={label} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-xl active:scale-95">
              {iconForMeal(label.toLowerCase())}
              <h3 className="mt-3 text-base font-semibold text-gray-900">{label}</h3>
              <button
                className="mt-4 bg-black text-white text-xs font-semibold px-5 py-1.5 rounded-full shadow-md hover:bg-gray-900 active:scale-95 transition"
                onClick={() => handleAddMeal(label)}
              >
                Agregar
              </button>
            </div>
          ))}
        </section>

        <section className="space-y-8 px-2 mt-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Comidas recientes
          </h2>

          {loading ? <p className="text-center text-gray-500">Cargando...</p> : (
            <div className="space-y-5">
              {mealLog.length === 0 ? (
                <p className="text-center text-gray-500">No hay comidas registradas.</p>
              ) : (
                mealLog.map(meal => (
                  <div
                    key={meal.id}
                    className="bg-white p-5 rounded-2xl shadow-xl hover:shadow-2xl"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {iconForMeal(meal.tipo)}
                        <div>
                          <p className="capitalize font-bold text-gray-900 text-lg">{meal.tipo}</p>
                          <p className="text-xs text-gray-500">{meal.fecha} {meal.hora}</p>
                          <p className="text-xs text-gray-500">{meal.items.length} ingrediente(s)</p>
                        </div>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => confirmDeleteMeal(meal.id)}
                        aria-label="Eliminar comida"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">¿Eliminar esta comida?</h2>
            <p className="text-sm text-gray-700 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => setShowConfirmDelete(false)}
              >Cancelar</button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={handleDeleteMeal}
              >Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar />
    </div>
  )
}
