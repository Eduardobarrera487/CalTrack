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
  const [misRecetas, setMisRecetas] = useState([]) // Para recetas guardadas en localStorage

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
      console.log("Respuesta IA:", response)

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
      console.error("Error al obtener recomendaciones de IA:", err)
      setIaRecipes([])
    }

    setIaLoading(false)
  }

  // Cargar recetas desde DB
  useEffect(() => {
    const fetchRecipesWithNutrition = async () => {
      const { data, error } = await supabase
        .from('recetas')
        .select(`
          id,
          nombre,
          fuente,
          receta_ingredientes (
            cantidad,
            ingredientes (
              calorias,
              proteinas,
              carbohidratos,
              grasas,
              nombre
            )
          )
        `)
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

  // Cargar perfil y recomendaciones IA
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

      if (objetivoUser && peso > 0) {
        fetchIaRecipeRecommendations(objetivoUser, peso)
      }
    }

    cargarDatosYRecomendaciones()
  }, [])

  // Cargar recetas guardadas en localStorage (Mis recetas)
  useEffect(() => {
    const stored = localStorage.getItem('misRecetas')
    if (stored) setMisRecetas(JSON.parse(stored))
  }, [])

  // Guardar receta en localStorage y estado Mis Recetas
  const guardarRecetaLocal = (receta) => {
    if (misRecetas.some(r => r.nombre === receta.nombre)) return

    const nuevasRecetas = [receta, ...misRecetas]
    setMisRecetas(nuevasRecetas)
    localStorage.setItem('misRecetas', JSON.stringify(nuevasRecetas))
  }

  const closeDetails = () => setShowDetailsId(null)

  if (loading) {
    return (
      <div className="max-w-[430px] mx-auto p-6 min-h-screen bg-white text-black flex justify-center items-center">
        <p>Cargando recetas...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[430px] mx-auto p-6 min-h-screen bg-white text-black pl-2 pr-2">
      <h1 className="text-2xl font-bold mb-6">Recetas</h1>

      {/* Recomendaciones IA */}
      <h2 className="text-lg font-semibold mb-3">Recomendaciones por IA</h2>
      {iaLoading ? (
        <ul className="space-y-3 mb-6">
          {[1, 2, 3].map((_, i) => (
            <li key={i} className="border p-3 rounded-md bg-blue-50 animate-pulse">
              <div className="h-4 bg-blue-100 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-blue-100 rounded w-full"></div>
            </li>
          ))}
        </ul>
      ) : iaRecipes.length > 0 ? (
        <ul className="space-y-3 mb-6">
          {iaRecipes.map((receta, i) => {
            const yaEnMisRecetas = misRecetas.some(r => r.nombre === receta.nombre)
            return (
              <li
                key={i}
                className="border p-3 rounded-md bg-blue-50 flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="font-semibold mb-1">{receta.nombre}</p>
                  <p className="text-sm text-gray-600">
                    Calorías: {receta.calorias ?? 'N/A'} kcal ·{' '}
                    Proteínas: {receta.proteinas ?? 'N/A'} g ·{' '}
                    Carbohidratos: {receta.carbohidratos ?? 'N/A'} g ·{' '}
                    Grasas: {receta.grasas ?? 'N/A'} g
                  </p>
                </div>
                <div>
                  <button
                    disabled={yaEnMisRecetas}
                    className={`px-3 py-1 text-sm rounded-lg font-semibold ${yaEnMisRecetas
                      ? 'bg-gray-300 text-white cursor-not-allowed'
                      : 'bg-green-700 text-white hover:bg-green-800'
                      }`}
                    onClick={() => guardarRecetaLocal(receta)}
                  >
                    {yaEnMisRecetas ? 'Guardada' : 'Añadir a mis recetas'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mb-4">No hay recomendaciones disponibles aún.</p>
      )}

      {/* Mis Recetas guardadas en localStorage */}
      <h2 className="text-lg font-semibold mt-10 mb-3">Mis Recetas</h2>
      {misRecetas.length === 0 ? (
        <p className="text-gray-500 mb-10">No has guardado ninguna receta localmente.</p>
      ) : (
        <ul className="space-y-4 mb-10">
          {misRecetas.map((receta, i) => (
            <li key={i} className="border rounded-lg p-4 bg-yellow-50">
              <h3 className="text-xl font-semibold">{receta.nombre}</h3>
              <p>
                Calorías: {receta.calorias ?? 'N/A'} kcal · Proteínas: {receta.proteinas ?? 'N/A'} g · Carbohidratos: {receta.carbohidratos ?? 'N/A'} g · Grasas: {receta.grasas ?? 'N/A'} g
              </p>
              <p className="mt-2 text-sm italic text-gray-600">Fuente: {receta.fuente}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Recetas desde DB */}
      <h2 className="text-lg font-semibold mt-10 mb-3">Lista de recetas</h2>
      {recipes.length === 0 ? (
        <p>No hay recetas registradas.</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map((receta) => {
            const preparacionLocal = localStorage.getItem(`preparacion_${receta.id}`) || 'No disponible'

            return (
              <li key={receta.id} className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-1">{receta.nombre}</h2>
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
                  className="mt-2 bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition"
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
                      className="bg-white rounded-xl max-w-lg w-full p-6 relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={closeDetails}
                        className="absolute top-3 right-3 text-gray-600 hover:text-black font-bold text-xl"
                        aria-label="Cerrar detalles"
                      >
                        &times;
                      </button>

                      <h3 className="text-2xl font-bold mb-4">{receta.nombre}</h3>
                      <p className="mb-2"><strong>Fuente:</strong> {receta.fuente || 'No disponible'}</p>

                      <h4 className="font-semibold mb-1">Ingredientes:</h4>
                      <ul className="mb-4 list-disc list-inside max-h-40 overflow-y-auto">
                        {receta.receta_ingredientes?.length === 0 && <li>No hay ingredientes.</li>}
                        {receta.receta_ingredientes?.map(({ cantidad, ingredientes }, i) => (
                          <li key={i}>
                            {ingredientes?.nombre || 'Desconocido'} — {cantidad} g
                          </li>
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

          <button
            onClick={() => window.location.href = '/pages/add-recipe'}
            className="mb-10 mt-6 w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
          >
            Agregar Receta Nueva
          </button>

        </ul>


      )}

      <BottomNavBar active="Workouts" />
    </div>
  )
}



