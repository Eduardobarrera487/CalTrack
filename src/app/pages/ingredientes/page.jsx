'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../../utils/supabase/client'

export default function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchIngredientes = async () => {
      setLoading(true)
      setError(null)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
      if (error) {
        setError(error.message)
      } else {
        setIngredientes(data)
      }
      setLoading(false)
    }
    fetchIngredientes()
  }, [])

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-xl mx-auto p-4 bg-white">
      <h1 className="text-xl font-bold mb-4 text-black">Lista de Ingredientes</h1>
      <ul className="space-y-2">
        {ingredientes.map((ing) => (
          <li key={ing.id} className="p-2 bg-gray-100 rounded text-black">
            Nombre: {ing.nombre}
            Calorias: {ing.calorias}
          </li>
        ))}
      </ul>
    </div>
  )
}