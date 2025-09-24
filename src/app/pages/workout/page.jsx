'use client'

import { useRouter } from 'next/navigation'
import BottomNavBar from '@/app/_components/BottomNavBar'
import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { createClient } from '../../../../utils/supabase/client'
import AIConnection from '@/app/_components/aiConnection'

export default function ActivityDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [iaRecommendations, setIaRecommendations] = useState([])
  const [iaLoading, setIaLoading] = useState(false)
  const [objetivo, setObjetivo] = useState('')
  const [pesoActual, setPesoActual] = useState(0)
  const [historySnapshot, setHistorySnapshot] = useState([])
  const [calorieGoal, setCalorieGoal] = useState(null)

  // --- Helpers ---
  const sanitize = (s) =>
    s
      ? s.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
      : ''

  // Asignar meta diaria según objetivo (usa sanitize para tildes/mayúsculas)
  const calculateCalorieGoal = (objetivo) => {
  if (!objetivo) return 300

  const o = objetivo
    .toString()
    .toLowerCase()
    .normalize("NFD") // descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // elimina las tildes
    .trim()

  switch (o) {
    case "perder_peso": return 500
    case "mantener_peso": return 300
    case "ganar_peso": return 200
    case "ganar_musculo": return 400
    case "definir_musculo": return 450
    default:
      return 300
  }
}

  // ------------------------
  // CARGA INICIAL
  // ------------------------
  useEffect(() => {
    const cargarTodo = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data: perfil, error: perfilError } = await supabase
        .from("perfiles")
        .select("objetivo, peso")
        .eq("id", user.id)
        .single()

      if (perfilError) {
        console.error('Error cargando perfil:', perfilError)
      }

      const objetivoUser = perfil?.objetivo ?? ''
      setObjetivo(objetivoUser)
      setPesoActual(perfil?.peso ?? 0)
      setCalorieGoal(calculateCalorieGoal(objetivoUser))

      // primero obtén ejercicios y luego recomendaciones IA
      await fetchExercises()
      fetchIaRecommendations(objetivoUser, perfil?.peso ?? 0, history)
    }

    cargarTodo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // solo al montar

  // ------------------------
  // RE-CALCULO: cuando cambie objetivo
  // ------------------------
  useEffect(() => {
    // si objetivo cambia, recalcule la meta automáticamente
    if (objetivo) {
      setCalorieGoal(calculateCalorieGoal(objetivo))
    }
  }, [objetivo])

  // ------------------------
  // EJERCICIOS
  // ------------------------
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
      .order('fecha', { ascending: false })

    if (error) console.error('Error cargando ejercicios:', error.message)
    else setHistory(data || [])
    setLoading(false)
  }

  const getTodaysExercises = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    return history.filter(item => (new Date(item.fecha)).toISOString().split('T')[0] === todayStr)
  }

  const todaysExercises = getTodaysExercises()
  const totalCaloriesToday = todaysExercises.reduce((sum, item) => sum + (item.calorias_quemadas || 0), 0)
  // proteger contra division por cero / null
  const progressPercent = calorieGoal ? Math.min((totalCaloriesToday / calorieGoal) * 100, 100) : 0

  const progressColor = () => {
    if (progressPercent < 40) return 'bg-red-500'
    if (progressPercent < 80) return 'bg-yellow-400'
    return 'bg-green-500'
  }

  // ------------------------
  // IA Recomendaciones
  // ------------------------
  const fetchIaRecommendations = async (obj = objetivo, peso = pesoActual, hist = history) => {
    setIaLoading(true)

    const historyString = hist.length > 0
      ? hist.map(item => `${item.nombre} (${item.duracion} min)`).join(", ")
      : "Sin ejercicios previos"

    const prompt = `Mi objetivo es: ${obj}. Mi peso inicial del mes es: ${peso} kg.
Estos son mis ejercicios recientes: ${historyString}, si no tengo, solo toma en cuenta el objetivo y peso.
Sugiere exactamente 3 ejercicios recomendados para mí, parecidos a los anteriores. 
Responde solo la lista en markdown, cada uno en este formato: 
- Nombre (minutos min, calorías estimadas cal). 
No pongas explicaciones ni texto extra.`

    try {
      const response = await AIConnection(prompt)
      const lines = response
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => {
          const match = line.match(/- (.+) \((\d+) min, (\d+) cal\)/)
          if (match) return { nombre: match[1], duracion: match[2], calorias_quemadas: match[3] }
          return null
        })
        .filter(Boolean)
      setIaRecommendations(lines)
    } catch (err) {
      console.error('Error IA:', err)
      setIaRecommendations([])
    }
    setIaLoading(false)
  }

  // Si history/objetivo/pesoActual cambian, actualiza recomendaciones
  useEffect(() => {
    const isSame =
      history.length === historySnapshot.length &&
      history.every((item, idx) =>
        item.nombre === historySnapshot[idx]?.nombre &&
        item.duracion === historySnapshot[idx]?.duracion
      )

    if (!isSame && history.length > 0) {
      setHistorySnapshot([...history])
      if (objetivo && pesoActual) fetchIaRecommendations()
    }
    // También si solo cambia el objetivo (y ya hay peso), queremos nuevas recomendaciones
    // (el efecto anterior cubre objetivo en la condicion del fetchIaRecommendations, pero si prefieres forzar siempre:)
    // if (objetivo && pesoActual && history.length === 0) fetchIaRecommendations()
  }, [history, objetivo, pesoActual]) // eslint-disable-line react-hooks/exhaustive-deps

  // ------------------------
  // CRUD Entrenamientos
  // ------------------------
  const handleSubmit = async (ejercicio) => {
    const { error } = await supabase.from('entrenamientos').insert({
      usuario_id: userId,
      nombre: ejercicio.nombre,
      duracion: Number(ejercicio.duracion),
      calorias_quemadas: Number(ejercicio.calorias_quemadas),
      fecha: new Date().toISOString()
    })

    if (!error) {
      setHistory(prev => [
        {
          id: Date.now(),
          nombre: ejercicio.nombre,
          duracion: ejercicio.duracion,
          calorias_quemadas: Number(ejercicio.calorias_quemadas),
          fecha: new Date().toISOString()
        },
        ...prev
      ])
    } else {
      console.error('Error insert entrenamiento:', error)
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = confirm('¿Seguro quieres eliminar este ejercicio?')
    if (!confirmDelete) return
    const { error } = await supabase.from('entrenamientos').delete().eq('id', id)
    if (error) alert('Error eliminando el ejercicio: ' + error.message)
    else setHistory(prev => prev.filter(item => item.id !== id))
  }

  const goToRecipes = () => router.push('/pages/recipes')
  const goToAddExercise = () => router.push('/pages/add-exercise')

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar PC */}
      <div className="hidden md:flex md:flex-col md:w-20 md:py-4 md:border-r md:border-gray-200">
        <BottomNavBar active="Ejercicios" />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 max-w-5xl mx-auto p-4 md:pl-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-black">CalTrack</h1>
          </div>

          <div className="bg-gray-200 rounded-2xl p-4 shadow">
            <p className="text-sm text-gray-700">Calorías quemadas hoy</p>
            <h2 className="text-3xl font-bold text-black">{totalCaloriesToday} kcal</h2>

            <div className="mt-3 w-full bg-gray-300 rounded-full h-4 overflow-hidden">
              <div
                className={`${progressColor()} h-4 rounded-full transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs mt-1 text-gray-600">Meta diaria: {calorieGoal ?? '—'} kcal</p>
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
              {iaLoading ? (
                <>
                  <div className="bg-gray-200 animate-pulse rounded-md h-14 w-full" />
                  <div className="bg-gray-200 animate-pulse rounded-md h-14 w-full" />
                  <div className="bg-gray-200 animate-pulse rounded-md h-14 w-full" />
                </>
              ) : iaRecommendations.length > 0 ? (
                iaRecommendations.map((ej, idx) => {
                  const exists = history.some(
                    item => item.nombre === ej.nombre && String(item.duracion) === String(ej.duracion)
                  )
                  return (
                    <div key={idx} className="bg-blue-50 p-3 rounded-xl flex justify-between items-center shadow">
                      <div>
                        <h4 className="font-semibold text-black">{ej.nombre}</h4>
                        <p className="text-sm text-gray-500">Duración: {ej.duracion} min</p>
                        <p className="text-xs text-gray-500">Calorías estimadas: {ej.calorias_quemadas}</p>
                      </div>
                      <button
                        className={`ml-2 px-3 py-1 rounded-lg text-sm font-semibold transition ${exists
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        onClick={async () => { if (exists) return; await handleSubmit(ej) }}
                        disabled={exists}
                      >
                        {exists ? "Ya añadido" : "Añadir"}
                      </button>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500 text-sm">No hay recomendaciones aún.</p>
              )}
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
                        <span> - {item.duracion} min</span>
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
      </div>

      {/* Navbar inferior solo móviles */}
      <BottomNavBar active="Ejercicios" />
    </div>
  )
}
