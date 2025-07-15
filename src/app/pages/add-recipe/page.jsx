'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'

export default function AddRecipePage() {
  const router = useRouter()
  const supabase = createClient()

  const [nombre, setNombre] = useState('')
  const [tiempo, setTiempo] = useState('')
  const [porciones, setPorciones] = useState('')
  const [calificacion, setCalificacion] = useState('')
  const [preparacion, setPreparacion] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!nombre.trim()) {
      alert('El nombre es obligatorio')
      return
    }

    const { data: userData, error: userError } = await supabase.auth.getUser()
    const usuario_id = userData?.user?.id

    if (userError || !usuario_id) {
      alert('Error con la sesión del usuario')
      console.error(userError)
      return
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('perfiles')
      .select('nombre')
      .eq('id', usuario_id)
      .single()

    if (perfilError || !perfil?.nombre) {
      alert('No se pudo obtener el nombre del usuario')
      console.error(perfilError)
      return
    }

    const fuente = perfil.nombre

    const { data, error } = await supabase
      .from('recetas')
      .insert([{ nombre, fuente, tiempo, porciones, calificacion }])
      .select()
      .single()

    if (error) {
      alert('Error al guardar la receta: ' + error.message)
      console.error(error)
      return
    }

    localStorage.setItem(`preparacion_${data.id}`, preparacion)

    router.push(`/pages/add-ingredients?recetaId=${data.id}`)
  }

  return (
    <div className="max-w-[430px] mx-auto p-6 min-h-screen bg-white text-black">
      <button
        onClick={() => router.push('/pages/recipes')}
        className="mb-4 text-blue-700 hover:text-blue-900 font-semibold"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-6">Agregar Receta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded p-2 text-black"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Tiempo (minutos)</label>
          <input
            type="number"
            value={tiempo}
            onChange={(e) => setTiempo(e.target.value)}
            className="w-full border rounded p-2 text-black"
            min={0}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Porciones</label>
          <input
            type="number"
            value={porciones}
            onChange={(e) => setPorciones(e.target.value)}
            className="w-full border rounded p-2 text-black"
            min={1}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Calificación</label>
          <input
            type="number"
            value={calificacion}
            onChange={(e) => setCalificacion(e.target.value)}
            className="w-full border rounded p-2 text-black"
            min={0}
            max={5}
            step={0.1}
            placeholder="0 - 5"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Preparación</label>
          <textarea
            value={preparacion}
            onChange={(e) => setPreparacion(e.target.value)}
            className="w-full border rounded p-2 text-black"
            rows={5}
            placeholder="Escribe aquí la preparación (no se guarda en la base de datos)"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
        >
          Guardar Receta
        </button>
      </form>
    </div>
  )
}
