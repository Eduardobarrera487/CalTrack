'use client'

import Image from "next/image"
import { Heart } from "lucide-react"
import BottomNavBar from "@/app/_components/bottomNavBar"

export default function RecipeCard() {
  return (
    <div className="max-w-[430px] w-full mx-auto min-h-screen pb-20 bg-white">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border">
        <div className="relative">
          <Image
            src="/ensalada.jpg"
            alt="Ensalada Mediterránea"
            width={400}
            height={300}
            className="object-cover w-full h-56"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
            <Heart size={20} className="text-gray-500" />
          </div>
          <div className="absolute bottom-2 left-2 bg-white/80 text-sm rounded-full px-2 py-1 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
              <Image src="/chef.jpg" alt="Chef Miguel" width={24} height={24} />
            </div>
            <span className="text-xs font-medium">Chef Miguel</span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Ensalada Mediterránea</h2>
            <span className="text-sm text-gray-500">25 min</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 border-y py-2">
            <div><strong className="text-black">320</strong> Calorías</div>
            <div><strong className="text-black">15g</strong> Proteínas</div>
            <div><strong className="text-black">42g</strong> Carbos</div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mt-2">Ingredientes</h3>
            <ul className="text-sm list-disc list-inside text-gray-700">
              <li>2 tomates medianos</li>
              <li>1 pepino</li>
              <li>200g de queso feta</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mt-2">Preparación</h3>
            <ol className="text-sm list-decimal list-inside text-gray-700">
              <li>Cortar los tomates y el pepino en cubos medianos.</li>
              <li>Desmenuzar el queso feta.</li>
              <li>Mezclar todos los ingredientes en un bowl.</li>
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
