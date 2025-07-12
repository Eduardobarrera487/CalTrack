'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '../../../../utils/supabase/client'

export default function AddExercisePage() {
  const router = useRouter()
  const supabase = createClient()

  const [tipo, setTipo] = useState('')
  const [duracion, setDuracion] = useState('')
  const [intensidad, setIntensidad] = useState('media')

  const ejercicios = [
    'Correr',
    'Caminar',
    'Nadar',
    'Bicicleta',
    'Levantamiento de pesas',
    'Yoga',
    'HIIT',
    'Boxeo',
    'Zumba',
    'Bailar',
    'Caminata rápida',
    'Senderismo',
    'Escalar',
    'Pilates',
    'Spinning',
    'Remo',
    'Jumping jacks',
    'Saltar la cuerda',
    'Tai Chi',
    'Kickboxing',
    'CrossFit',
    'Ciclismo indoor',
    'Baile aeróbico',
    'Fútbol',
    'Básquetbol',
    'Tenis',
    'Voleibol',
  ]

  const calcularCalorias = (ejercicio, duracionMin, intensidad) => {
    const base = {
      baja: 3.5,
      media: 6,
      alta: 10,
    }
    const factor = base[intensidad] || 6
    return Math.round(factor * duracionMin)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!tipo || !duracion || !intensidad) {
      alert('Por favor completa todos los campos.')
      return
    }

    const duracionNum = parseInt(duracion)
    const caloriasQuemadas = calcularCalorias(tipo, duracionNum, intensidad)

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const usuario_id = user?.id

    if (userError || !usuario_id) {
      console.error('Error obteniendo usuario:', userError?.message || userError)
      alert('Hubo un problema con la sesión del usuario.')
      return
    }

    // Insertar sin intensidad, solo guardamos calorías
    const { error } = await supabase.from('entrenamientos').insert({
      usuario_id,
      nombre: tipo,
      duracion: duracionNum,
      calorias_quemadas: caloriasQuemadas,
      // No enviamos 'intensidad'
    })

    if (error) {
      console.error('Error guardando ejercicio:', error?.message || error)
      alert('Hubo un error al guardar el ejercicio.')
    } else {
      router.push('/pages/workout')
    }
  }

  return (
    <div className="max-w-[430px] mx-auto p-6 min-h-screen bg-white text-black">
      {/* Botón de regreso */}
      <button
        onClick={() => router.push('/pages/workout')}
        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 mb-6"
        aria-label="Regresar"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Volver</span>
      </button>

      <h1 className="text-2xl font-bold mb-6">Agregar Ejercicio</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de ejercicio */}
        <div>
          <label className="block text-sm font-medium">Tipo de ejercicio</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="mt-1 w-full border rounded-lg p-2 text-sm"
          >
            <option value="">Seleccionar</option>
            {ejercicios.map((ej, i) => (
              <option key={i} value={ej}>{ej}</option>
            ))}
          </select>
        </div>

        {/* Duración */}
        <div>
          <label className="block text-sm font-medium">Duración (minutos)</label>
          <input
            type="number"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            placeholder="Ej: 30"
            className="mt-1 w-full border rounded-lg p-2 text-sm"
          />
        </div>

        {/* Intensidad */}
        <div>
          <label className="block text-sm font-medium">Intensidad</label>
          <select
            value={intensidad}
            onChange={(e) => setIntensidad(e.target.value)}
            className="mt-1 w-full border rounded-lg p-2 text-sm"
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        {/* Botón */}
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
