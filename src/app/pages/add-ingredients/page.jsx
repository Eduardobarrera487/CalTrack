'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'

export default function AddIngredientsPage() {
  const searchParams = useSearchParams()
  const recetaId = searchParams.get('recetaId')
  const router = useRouter()
  const supabase = createClient()

  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([])
  const [ingredienteId, setIngredienteId] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [ingredientesAgregados, setIngredientesAgregados] = useState([])

  useEffect(() => {
    if (recetaId) {
      fetchIngredientes()
      fetchAgregados()
    }
  }, [recetaId])

  const fetchIngredientes = async () => {
    const { data, error } = await supabase.from('ingredientes').select('*')
    if (error) {
      console.error('Error al cargar ingredientes:', error)
    } else {
      setIngredientesDisponibles(data || [])
    }
  }

  const fetchAgregados = async () => {
    const { data, error } = await supabase
      .from('receta_ingredientes')
      .select(`
        cantidad,
        ingrediente_id,
        ingredientes (
          nombre
        )
      `)
      .eq('receta_id', recetaId)

    if (error) {
      console.error('Error al cargar ingredientes agregados:', error.message || error)
    } else {
      console.log('Ingredientes agregados:', data)
      setIngredientesAgregados(data || [])
    }
  }

  const handleAgregar = async () => {
    if (!ingredienteId || !cantidad) return

    const { error } = await supabase.from('receta_ingredientes').insert([
      {
        receta_id: recetaId,
        ingrediente_id: ingredienteId,
        cantidad: parseFloat(cantidad),
      },
    ])

    if (error) {
      console.error('Error al guardar ingrediente:', error.message || error)
    } else {
      setIngredienteId('')
      setCantidad('')
      fetchAgregados()
    }
  }

  const handleConfirmar = () => {
    router.push('/pages/recipes')
  }

  return (
    <div
      className="max-w-[430px] mx-auto p-6 min-h-screen text-black bg-white"
    >
      <h1 className="text-2xl font-bold mb-6">Agregar Ingredientes</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Ingrediente</label>
          <select
            value={ingredienteId}
            onChange={(e) => setIngredienteId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">Seleccionar</option>
            {ingredientesDisponibles.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Cantidad (g)</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Ej. 100"
            min={1}
          />
        </div>

        <button
          onClick={handleAgregar}
          className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
        >
          Agregar Ingrediente
        </button>
      </div>

      <h2 className="text-lg font-bold mt-8 mb-3">Ingredientes agregados</h2>
      <ul className="space-y-2">
        {ingredientesAgregados.map((item, index) => (
          <li
            key={`${item.ingrediente_id}-${index}`}
            className="border p-3 rounded-lg bg-gray-100"
          >
            {item.ingredientes?.nombre || 'Desconocido'} — {item.cantidad} g
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <button
          onClick={handleConfirmar}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
        >
          Confirmar receta
        </button>
      </div>
    </div>
  )
}
