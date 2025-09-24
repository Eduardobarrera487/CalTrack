'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'
import BottomNavBar from '@/app/_components/BottomNavBar'
import { useCartStore } from '../../_store/cartStore'
import { ShoppingBasket, ArrowLeft, Search } from 'lucide-react'

export default function Lunch() {
  const router = useRouter()
  const supabase = createClient()
  const [itemsList, setItemsList] = useState([])
  const { items, addItem, clearCart } = useCartStore()

  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredItems = itemsList.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  const handleConfirm = async () => {
    const now = new Date()
    const fecha = now.toISOString().split('T')[0]
    const hora = now.toTimeString().split(' ')[0]

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const usuario_id = user?.id

    if (userError || !usuario_id) {
      console.error("Error obteniendo usuario:", userError?.message || userError)
      return
    }

    const { data: comidaData, error: insertError } = await supabase
      .from('comidas')
      .insert({
        usuario_id,
        tipo: 'almuerzo',
        fecha,
        hora,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error("Error al insertar en comidas:", insertError)
      return
    }

    const comidaId = comidaData.id

    const ingredientesToInsert = items.map(item => ({
      comida_id: comidaId,
      ingrediente_id: item.id,
      cantidad: item.quantity * 100,
    }))

    const { error: insertIngredientesError } = await supabase
      .from('comida_ingredientes')
      .insert(ingredientesToInsert)

    if (insertIngredientesError) {
      console.error('Error insertando en comida_ingredientes:', insertIngredientesError)
      return
    }

    clearCart()
    router.push('/pages/diary')
  }

  return (
    <>
    <div className="w-full md:pl-30 mx-auto bg-white min-h-screen p-4 font-sans">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.push('/pages/diary')}>
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 lowercase">almuerzo</h1>
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

      <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Buscar ingrediente"
          className="flex-1 text-sm text-black placeholder-gray-400 bg-transparent outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pb-36">
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

      <div className=" mt-6 fixed bottom-17 left-0 right-0 px-4 z-50 max-w-[430px] mx-auto">
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-900 text-white py-3 rounded-full text-lg hover:bg-blue-800 transition"
        >
          Confirmar almuerzo
        </button>
      </div>

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

      
    </div>
    <BottomNavBar active="Meals" />
    </>
  )
}
