'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, ShoppingBasket, CloudSun } from 'lucide-react'
import BottomNavBar from '@/app/_components/bottomNavBar'
import { useCartStore } from '../../_store/cartStore'

export default function MealBuilder() {
  const router = useRouter()
  const { items, addItem } = useCartStore()

  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [size, setSize] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')

  const handleOpenDetails = (item) => {
    setSelectedItem(item)
    setShowDetails(true)
  }

  const handleSave = () => {
    if (!selectedItem) return

    const newItem = {
      name: selectedItem.name,
      size,
      calories,
      protein,
      carbs,
      fats,
      quantity: 1,
    }

    addItem(newItem)
    setShowDetails(false)
    setSize('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFats('')
  }

  const goToCart = () => {
    router.push('/pages/basket')
  }

  const itemList = [
    { name: 'Huevo', img: '/huevo.jpg' },
    { name: 'Avena', img: '/avena.jpg' },
    { name: 'Plátano', img: '/platano.jpg' },
    { name: 'Tomate', img: '/tomate.jpg' },
  ]

  return (
    <div className="max-w-[430px] w-full mx-auto min-h-screen px-4 pt-6 pb-24 bg-white relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold lowercase">desayuno</h1>
        <div className="relative cursor-pointer" onClick={goToCart}>
          <ShoppingBasket className="w-6 h-6 text-black" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
            {items.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-800 mb-4">
        <CloudSun className="w-6 h-6 text-yellow-400" />
        <span className="text-sm font-medium">seleccionar ingredientes</span>
      </div>

      <div className="flex items-center border rounded-full px-3 py-1 mb-4">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="buscar"
          className="flex-1 outline-none text-sm placeholder-gray-400 bg-transparent"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {['todos', 'vegetales', 'proteínas', 'lácteos', 'granos'].map((cat, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              i === 0
                ? 'bg-[#173A8C] text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-20">
        {itemList.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl shadow-sm p-3 flex flex-col items-center text-center"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-20 h-20 object-contain mb-2"
            />
            <p className="font-medium text-sm text-gray-800">{item.name}</p>
            <button
              className="mt-2 bg-[#173A8C] text-white text-sm px-4 py-1 rounded-md font-semibold hover:bg-[#102b66]"
              onClick={() => handleOpenDetails(item)}
            >
              Agregar
            </button>
          </div>
        ))}
      </div>

      <button className="absolute bottom-24 right-6 bg-[#173A8C] text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-[#102b66]">
        confirmar
      </button>

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              {selectedItem?.name} - Detalles
            </h2>

            <input
              type="text"
              placeholder="Tamaño (ej. 100g, 1 taza)"
              className="w-full mb-2 p-2 border rounded-md text-sm"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
            <input
              type="number"
              placeholder="Calorías"
              className="w-full mb-2 p-2 border rounded-md text-sm"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
            <input
              type="number"
              placeholder="Proteínas (g)"
              className="w-full mb-2 p-2 border rounded-md text-sm"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
            />
            <input
              type="number"
              placeholder="Carbohidratos (g)"
              className="w-full mb-2 p-2 border rounded-md text-sm"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
            />
            <input
              type="number"
              placeholder="Grasas (g)"
              className="w-full mb-2 p-2 border rounded-md text-sm"
              value={fats}
              onChange={(e) => setFats(e.target.value)}
            />

            <button
              className="w-full mt-4 bg-[#173A8C] text-white py-2 rounded-md font-semibold hover:bg-[#102b66]"
              onClick={handleSave}
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      <BottomNavBar />
    </div>
  )
}
