'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../../utils/supabase/client'
import BottomNavBar from '@/app/_components/BottomNavBar'
import AIConnection from '@/app/_components/aiConnection'

export default function RecipesPage() {
  const supabase = createClient()

  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDetailsId, setShowDetailsId] = useState(null)
  const [objetivo, setObjetivo] = useState("")
  const [pesoActual, setPesoActual] = useState(0)
  const [iaRecipes, setIaRecipes] = useState([])
  const [iaLoading, setIaLoading] = useState(false)
  const [misRecetas, setMisRecetas] = useState([])

  const fetchIaRecipeRecommendations = async (objetivo, peso) => {
    setIaLoading(true)

    const prompt = `Mi objetivo es: ${objetivo}. Mi peso actual es: ${peso} kg.
Sugiere exactamente 3 recetas saludables según mi objetivo. Usa este **formato exacto**, sin cambiar ni añadir nada:

- Nombre (20 min, 2, 4.5/5).
  Calorías: 300 kcal
  Proteínas: 25 g
  Carbohidratos: 20 g
  Grasas: 10 g

Es importante que no pongas texto antes o después.`

    try {
      const response = await AIConnection(prompt)

      const matches = response.split(/(?=- )/g)

      const parsedRecipes = matches.map(block => {
        const firstLineMatch = block.match(/^- (.+?) \((\d+) min, (\d+), ([0-9.]+)\/5\)\.?/)
        if (!firstLineMatch) return null
        const caloriesMatch = block.match(/Calor[ií]as:\s*([\d.]+)\s*kcal/i)
        const proteinMatch = block.match(/Prote[ií]nas:\s*([\d.]+)\s*g/i)
        const carbsMatch = block.match(/Carbohidratos:\s*([\d.]+)\s*g/i)
        const fatsMatch = block.match(/Grasas:\s*([\d.]+)\s*g/i)
        return {
          nombre: firstLineMatch[1],
          tiempo: Number(firstLineMatch[2]),
          porciones: Number(firstLineMatch[3]),
          calificacion: Number(firstLineMatch[4]),
          calorias: caloriesMatch ? Number(caloriesMatch[1]) : null,
          proteinas: proteinMatch ? Number(proteinMatch[1]) : null,
          carbohidratos: carbsMatch ? Number(carbsMatch[1]) : null,
          grasas: fatsMatch ? Number(fatsMatch[1]) : null,
          fuente: "IA"
        }
      }).filter(Boolean)

      setIaRecipes(parsedRecipes)
    } catch (err) {
      setIaRecipes([])
    }

    setIaLoading(false)
  }

  useEffect(() => {
    const fetchRecipesWithNutrition = async () => {
      const { data, error } = await supabase
        .from('recetas')
        .select(`id, nombre, fuente, receta_ingredientes (cantidad, ingredientes (calorias, proteinas, carbohidratos, grasas, nombre))`)
        .order('nombre', { ascending: true })

      if (error) {
        console.error('Error al cargar recetas:', error)
        setLoading(false)
        return
      }

      const recipesWithTotals = data.map((receta) => {
        let totalCalorias = 0
        let totalProteinas = 0
        let totalCarbohidratos = 0
        let totalGrasas = 0
        receta.receta_ingredientes.forEach(({ cantidad, ingredientes }) => {
          if (ingredientes) {
            totalCalorias += (ingredientes.calorias || 0) * cantidad
            totalProteinas += (ingredientes.proteinas || 0) * cantidad
            totalCarbohidratos += (ingredientes.carbohidratos || 0) * cantidad
            totalGrasas += (ingredientes.grasas || 0) * cantidad
          }
        })
        return {
          ...receta,
          totalCalorias: totalCalorias.toFixed(1),
          totalProteinas: totalProteinas.toFixed(1),
          totalCarbohidratos: totalCarbohidratos.toFixed(1),
          totalGrasas: totalGrasas.toFixed(1),
        }
      })

      setRecipes(recipesWithTotals)
      setLoading(false)
    }

    fetchRecipesWithNutrition()
  }, [supabase])

  useEffect(() => {
    const cargarDatosYRecomendaciones = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("objetivo, peso")
        .eq("id", user.id)
        .single()

      const objetivoUser = perfil?.objetivo ?? ""
      const peso = perfil?.peso ?? 0
      setObjetivo(objetivoUser)
      setPesoActual(peso)
      if (objetivoUser && peso > 0) fetchIaRecipeRecommendations(objetivoUser, peso)
    }

    cargarDatosYRecomendaciones()
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('misRecetas')
    if (stored) setMisRecetas(JSON.parse(stored))
  }, [])

  const guardarRecetaLocal = (receta) => {
    if (misRecetas.some(r => r.nombre === receta.nombre)) return
    const nuevasRecetas = [receta, ...misRecetas]
    setMisRecetas(nuevasRecetas)
    localStorage.setItem('misRecetas', JSON.stringify(nuevasRecetas))
  }

  const closeDetails = () => setShowDetailsId(null)

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white text-black">
        <p>Cargando recetas...</p>
      </div>
    )
  }

  return (
    <>

      <div className="w-full mx-auto p-6 md:p-10 md:max-w-full md:pl-30 min-h-screen bg-white text-black pb-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">Recetas</h1>

        {/* Recomendaciones IA */}
        <h2 className="text-xl md:text-2xl font-semibold mb-3">Recomendaciones por IA</h2>
        {iaLoading ? (
          <ul className="space-y-3 mb-6 md:grid md:grid-cols-3 md:gap-4">
            {[1, 2, 3].map((_, i) => (
              <li key={i} className="border p-4 rounded-md bg-blue-50 animate-pulse h-36"></li>
            ))}
          </ul>
        ) : iaRecipes.length > 0 ? (
          <ul className="space-y-3 mb-6 md:grid md:grid-cols-3 md:gap-4">
            {iaRecipes.map((receta, i) => {
              const yaEnMisRecetas = misRecetas.some(r => r.nombre === receta.nombre)
              return (
                <li key={i} className="border p-4 rounded-md bg-blue-50 flex flex-col justify-between h-36">
                  <div>
                    <p className="font-semibold mb-2">{receta.nombre}</p>
                    <p className="text-sm text-gray-600">
                      Calorías: {receta.calorias ?? 'N/A'} kcal<br />
                      Proteínas: {receta.proteinas ?? 'N/A'} g<br />
                      Carbohidratos: {receta.carbohidratos ?? 'N/A'} g<br />
                      Grasas: {receta.grasas ?? 'N/A'} g
                    </p>
                  </div>
                  <button
                    disabled={yaEnMisRecetas}
                    className={`mt-2 px-3 py-1 text-sm rounded-lg font-semibold ${yaEnMisRecetas ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-green-700 text-white hover:bg-green-800'}`}
                    onClick={() => guardarRecetaLocal(receta)}
                  >
                    {yaEnMisRecetas ? 'Guardada' : 'Añadir'}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mb-4">No hay recomendaciones disponibles aún.</p>
        )}

        {/* Mis Recetas */}
        <h2 className="text-xl md:text-2xl font-semibold mt-10 mb-3">Mis Recetas</h2>
        {misRecetas.length === 0 ? (
          <p className="text-gray-500 mb-10">No has guardado ninguna receta localmente.</p>
        ) : (
          <ul className="space-y-4 mb-10 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
            {misRecetas.map((receta, i) => (
              <li key={i} className="border rounded-lg p-4 bg-yellow-50 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{receta.nombre}</h3>
                  <p className="text-sm mt-1">
                    Calorías: {receta.calorias ?? 'N/A'} kcal · Proteínas: {receta.proteinas ?? 'N/A'} g<br />
                    Carbohidratos: {receta.carbohidratos ?? 'N/A'} g · Grasas: {receta.grasas ?? 'N/A'} g
                  </p>
                </div>
                <p className="mt-2 text-sm italic text-gray-600">Fuente: {receta.fuente}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Recetas DB */}
        <h2 className="text-xl md:text-2xl font-semibold mt-10 mb-3">Lista de recetas</h2>
        <ul className="flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-8 md:p-10">
          {recipes.map((receta) => {
            const preparacionLocal = localStorage.getItem(`preparacion_${receta.id}`) || 'No disponible'
            return (
              <li
                key={receta.id}
                className="border rounded-lg p-4 flex-1 min-w-[280px] max-w-sm shadow hover:shadow-lg transition"
              >
                <h2 className="text-lg md:text-xl font-semibold mb-1">{receta.nombre}</h2>
                {receta.fuente && (
                  <p className="text-gray-600 mb-1">
                    <strong>Fuente:</strong> {receta.fuente}
                  </p>
                )}
                <p className="mb-1"><strong>Calorías:</strong> {receta.totalCalorias} kcal</p>
                <p className="mb-1"><strong>Proteínas:</strong> {receta.totalProteinas} g</p>
                <p className="mb-1"><strong>Carbohidratos:</strong> {receta.totalCarbohidratos} g</p>
                <p className="mb-1"><strong>Grasas:</strong> {receta.totalGrasas} g</p>

                <button
                  className="mt-2 bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition w-full"
                  onClick={() => setShowDetailsId(receta.id)}
                >
                  Ver detalles
                </button>

                {showDetailsId === receta.id && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
                    onClick={closeDetails}
                  >
                    <div
                      className="bg-white rounded-xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={closeDetails}
                        className="absolute top-3 right-3 text-gray-600 hover:text-black font-bold text-2xl"
                        aria-label="Cerrar detalles"
                      >
                        &times;
                      </button>

                      <h3 className="text-2xl font-bold mb-4">{receta.nombre}</h3>
                      <p className="mb-2"><strong>Fuente:</strong> {receta.fuente || 'No disponible'}</p>

                      <h4 className="font-semibold mb-1">Ingredientes:</h4>
                      <ul className="mb-4 list-disc list-inside max-h-60 overflow-y-auto">
                        {receta.receta_ingredientes?.length === 0 && <li>No hay ingredientes.</li>}
                        {receta.receta_ingredientes?.map(({ cantidad, ingredientes }, i) => (
                          <li key={i}>{ingredientes?.nombre || 'Desconocido'} — {cantidad} g</li>
                        ))}
                      </ul>

                      <h4 className="font-semibold mb-1">Preparación:</h4>
                      <p className="whitespace-pre-wrap">{preparacionLocal}</p>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {/* Botón fuera del ul */}
        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = '/pages/add-recipe')}
            className="mb-10 mt-6 w-full md:w-auto md:px-10 bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
          >
            Agregar Receta Nueva
          </button>
        </div>
      </div>
      <BottomNavBar active="Workouts" />

    </>
  )
}
