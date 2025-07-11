'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '../../_store/cartStore'
import { ArrowLeft, Trash2 } from 'lucide-react'
import BottomNavBar from '@/app/_components/BottomNavBar'

export default function Basket() {
  const router = useRouter()
  const {
    items,
    addItem,
    updateItemQuantity,
    removeItemByName,
    clearCart
  } = useCartStore()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleIncrease = (item) => {
    addItem(item)
  }

  const handleDecrease = (item) => {
    const current = items.find(i => i.name === item.name)
    if (!current) return

    if (current.quantity <= 1) {
      removeItemByName(item.name)
    } else {
      updateItemQuantity(item.name, current.quantity - 1)
    }
  }

  return (
    <div className="max-w-[430px] w-full mx-auto min-h-screen px-4 pt-6 pb-24 bg-white relative">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => router.back()} className="text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Carrito</h1>
        <button onClick={clearCart} className="text-red-500 text-sm flex items-center gap-1">
          <Trash2 className="w-4 h-4" /> Vaciar
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No hay ingredientes en el carrito.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-xl p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img src={item.img} alt={item.name} className="w-14 h-14 object-contain rounded" />
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="bg-gray-300 text-black w-6 h-6 rounded-full text-sm font-bold"
                      onClick={() => handleDecrease(item)}
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      className="bg-yellow-500 text-white w-6 h-6 rounded-full text-sm font-bold hover:bg-yellow-600"
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItemByName(item.name)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="absolute bottom-24 right-6">
          <p className="text-sm text-gray-600">Total de items: {totalItems}</p>
        </div>
      )}

      {items.length > 0 && (
        <button
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md shadow hover:bg-yellow-600"
          onClick={() => {
            alert('Aún no implementado')
          }}
        >
          Confirmar
        </button>
      )}

      <BottomNavBar />
    </div>
  )
}
