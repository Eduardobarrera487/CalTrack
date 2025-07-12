'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'
import BottomNavBar from '@/app/_components/BottomNavBar'
import { useCartStore } from '../../_store/cartStore'
import { ShoppingBasket, ArrowLeft, Search } from 'lucide-react'

export default function Dinner() {
  const router = useRouter()
  const supabase = createClient()
  const [itemsList, setItemsList] = useState([])
  const { items, addItem, clearCart } = useCartStore()
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [search, setSearch] = useState('')

  const [nutrients, setNutrients] = useState({
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
  })

  useEffect(() => {
    supabase
      .from('ingredientes')
      .select('*')
      .then(({ data, error }) => {
        if (error) console.error('Error al cargar ingredientes:', error)
        else setItemsList(data)
      })
  }, [])

  const handleOpenDetails = (item) => {
    setSelectedItem(item)
    setQuantity(1)
    setNutrients({
      calorias: item.calorias,
      proteinas: item.proteinas,
      carbohidratos: item.carbohidratos,
      grasas: item.grasas,
    })
    setShowDetails(true)
  }

  const handleQuantityChange = (value) => {
    const qty = parseInt(value) || 0
    setQuantity(qty)
    if (!selectedItem) return
    setNutrients({
      calorias: qty * selectedItem.calorias,
      proteinas: qty * selectedItem.proteinas,
      carbohidratos: qty * selectedItem.carbohidratos,
      grasas: qty * selectedItem.grasas,
    })
  }

  const handleSave = () => {
    if (!selectedItem) return
    const newItem = {
      id: selectedItem.id,
      name: selectedItem.nombre,
      quantity,
      size: quantity * 100,
      ...nutrients,
    }
    addItem(newItem)
    setShowDetails(false)
    setQuantity(1)
  }

  const handleConfirm = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

    const logItems = items.map(item => ({
      ...item,
      time: timeString,
      mealType: 'cena',
    }))

    const prevLog = JSON.parse(localStorage.getItem('mealLog') || '[]')
    localStorage.setItem('mealLog', JSON.stringify([...prevLog, ...logItems]))
    clearCart()
    router.push('/pages/diary')
  }

  const filteredItems = itemsList.filter(item =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-screen p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => router.push('/pages/diary')}>
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 lowercase">cena</h1>
        <div
          className="relative cursor-pointer"
          onClick={() => router.push('/pages/basket')}
        >
          <ShoppingBasket className="w-6 h-6 text-black" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
            {items.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </div>
      </div>

      <div className="flex items-center border rounded-full px-3 py-2 mb-4">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Buscar ingredientes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none text-sm placeholder-gray-400 bg-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-gray-100 rounded-2xl p-3 shadow hover:shadow-md transition">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.nombre}
                className="w-full h-24 object-cover rounded-xl mb-2"
              />
            )}
            <p className="text-center font-semibold text-gray-800">{item.nombre}</p>
            <button
              className="w-full mt-2 bg-blue-800 text-white py-2 rounded-xl hover:bg-blue-900 transition"
              onClick={() => handleOpenDetails(item)}
            >
              Agregar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 px-4 pb-24">
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-900 text-white py-3 rounded-2xl text-lg hover:bg-blue-800 transition"
        >
          Confirmar cena
        </button>
      </div>

      {/* Modal detalles */}
      {showDetails && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
              {selectedItem.nombre} (100g por unidad)
            </h2>

            <label className="block mb-4 text-gray-700 font-medium">
              Cantidad (x100g):
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="w-full border border-black text-black rounded-xl p-2 mt-1"
              />
            </label>

            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              <div className="text-orange-500 font-semibold"><strong>Calorías:</strong> {nutrients.calorias} kcal</div>
              <div className="text-green-600 font-semibold"><strong>Proteínas:</strong> {nutrients.proteinas} g</div>
              <div className="text-blue-600 font-semibold"><strong>Carbohidratos:</strong> {nutrients.carbohidratos} g</div>
              <div className="text-red-600 font-semibold"><strong>Grasas:</strong> {nutrients.grasas} g</div>
            </div>

            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-black"
                onClick={() => setShowDetails(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800"
                onClick={handleSave}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar active="Meals" />
    </div>
  )
}
