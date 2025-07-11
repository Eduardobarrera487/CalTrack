'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import BottomNavBar from '@/app/_components/BottomNavBar'
import { Heart } from 'lucide-react'

const recipes = {
  1: {
    name: "Pasta Primavera",
    image: "/pastaprimaveral.jpg",
    chef: "Chef Maria",
    time: "30 min",
    calories: 450,
    protein: "20g",
    carbs: "50g",
    ingredients: ["200g pasta", "Verduras mixtas", "Aceite de oliva", "Ajo"],
    steps: [
      "Hervir la pasta hasta que esté al dente.",
      "Saltear las verduras con ajo.",
      "Mezclar todo y servir caliente."
    ],
    chefImg: "https://randomuser.me/api/portraits/women/40.jpg",
  },
  2: {
    name: "Tacos Mexicanos",
    image: "/tacos.jpg",
    chef: "Chef Juan",
    time: "20 min",
    calories: 550,
    protein: "25g",
    carbs: "45g",
    ingredients: ["Tortillas", "Carne", "Cilantro", "Cebolla"],
    steps: [
      "Cocinar la carne con condimentos.",
      "Servir en tortillas calientes.",
      "Agregar cilantro y cebolla."
    ],
    chefImg: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  3: {
    name: "Ensalada Verde",
    image: "/ensalada.jpg",
    chef: "Chef Miguel",
    time: "15 min",
    calories: 320,
    protein: "15g",
    carbs: "42g",
    ingredients: ["2 tomates", "1 pepino", "200g queso feta"],
    steps: [
      "Cortar los tomates y pepino.",
      "Desmenuzar el queso.",
      "Mezclar todo en un bowl."
    ],
    chefImg: "/chef.jpg",
  }
}

export default function RecipePage() {
  const { id } = useParams()
  const recipe = recipes[id]

  if (!recipe) {
    return <div className="text-center mt-10 text-red-500">Receta no encontrada</div>
  }

  return (
    <div className="max-w-[430px] w-full mx-auto min-h-screen pb-20 bg-white">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border">
        <div className="relative">
          <Image
            src={recipe.image}
            alt={recipe.name}
            width={400}
            height={300}
            className="object-cover w-full h-56"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
            <Heart size={20} className="text-gray-500" />
          </div>
          <div className="absolute bottom-2 left-2 bg-white/80 text-sm rounded-full px-2 py-1 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
              {recipe.chefImg.startsWith('http') ? (
                <img
                  src={recipe.chefImg}
                  alt={recipe.chef}
                  width={24}
                  height={24}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={recipe.chefImg}
                  alt={recipe.chef}
                  width={24}
                  height={24}
                />
              )}
            </div>
            <span className="text-xs font-medium">{recipe.chef}</span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{recipe.name}</h2>
            <span className="text-sm text-gray-500">{recipe.time}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 border-y py-2">
            <div><strong className="text-black">{recipe.calories}</strong> Calorías</div>
            <div><strong className="text-black">{recipe.protein}</strong> Proteínas</div>
            <div><strong className="text-black">{recipe.carbs}</strong> Carbos</div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mt-2">Ingredientes</h3>
            <ul className="text-sm list-disc list-inside text-gray-700">
              {recipe.ingredients.map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mt-2">Preparación</h3>
            <ol className="text-sm list-decimal list-inside text-gray-700">
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <button className="mt-4 w-full bg-green-500 text-white font-semibold py-2 rounded-xl hover:bg-green-600 transition">
            + Añadir al Diario
          </button>
        </div>
      </div>

      <BottomNavBar />
    </div>
  )
}

