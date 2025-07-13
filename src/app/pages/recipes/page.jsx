'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../../utils/supabase/client'

export default function RecipesPage() {
  const supabase = createClient()

  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDetailsId, setShowDetailsId] = useState(null) 

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

  const closeDetails = () => setShowDetailsId(null)

  if (loading) {
    return (
      <div className="max-w-[430px] mx-auto p-6 min-h-screen bg-white text-black flex justify-center items-center">
        <p>Cargando recetas...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[430px] mx-auto p-6 min-h-screen bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Recetas</h1>

      {recipes.length === 0 ? (
        <p>No hay recetas registradas.</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map((receta) => {
            const preparacionLocal = localStorage.getItem(`preparacion_${receta.id}`) || 'No disponible'

            return (
              <li
                key={receta.id}
                className="border rounded-lg p-4"
              >
                <h2 className="text-xl font-semibold mb-1">{receta.nombre}</h2>
                {receta.fuente && (
                  <p className="text-gray-600 mb-1">
                    <strong>Fuente:</strong> {receta.fuente}
                  </p>
                )}
                <p className="mb-1">
                  <strong>Calorías:</strong> {receta.totalCalorias} kcal
                </p>
                <p className="mb-1">
                  <strong>Proteínas:</strong> {receta.totalProteinas} g
                </p>
                <p className="mb-1">
                  <strong>Carbohidratos:</strong> {receta.totalCarbohidratos} g
                </p>
                <p className="mb-1">
                  <strong>Grasas:</strong> {receta.totalGrasas} g
                </p>

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

                      <p className="mb-2">
                        <strong>Fuente:</strong> {receta.fuente || 'No disponible'}
                      </p>

                      <h4 className="font-semibold mb-1">Ingredientes:</h4>
                      <ul className="mb-4 list-disc list-inside max-h-40 overflow-y-auto">
                        {receta.receta_ingredientes.length === 0 && <li>No hay ingredientes.</li>}
                        {receta.receta_ingredientes.map(({ cantidad, ingredientes }, i) => (
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
        </ul>
      )}

      <button
        onClick={() => window.location.href = '/pages/add-recipe'}
        className="mt-6 w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
      >
        Agregar Receta Nueva
      </button>
    </div>
  )
}
