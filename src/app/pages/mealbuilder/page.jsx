
'use client'

import { useRouter } from 'next/navigation'
import { Search, ShoppingBasket, CloudSun } from 'lucide-react'
import BottomNavBar from '@/app/_components/bottomNavBar'
import { useCartStore } from '../../_store/cartStore'

export default function MealBuilder() {
  const router = useRouter()
  const { items, addItem, removeItemByName, updateItemQuantity } = useCartStore()

  const goToCart = () => {
    router.push('/pages/basket')
  }

  const handleAdd = (item) => {
    addItem(item)
  }

  const handleRemove = (item) => {
    const exists = items.find(i => i.name === item.name)
    if (!exists) return

    if (exists.quantity === 1) {
      removeItemByName(item.name)
    } else {
      updateItemQuantity(item.name, exists.quantity - 1)
    }
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
              i === 0 ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-20">
        {itemList.map((item, index) => {
          const existingItem = items.find(i => i.name === item.name)
          const quantity = existingItem?.quantity || 0

          return (
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

              <div className="flex items-center gap-2 mt-2">
                <button
                  className="bg-gray-300 text-black w-6 h-6 rounded-full text-sm font-bold"
                  onClick={() => handleRemove(item)}
                >
                  −
                </button>
                <span className="text-sm w-6 text-center">{quantity}</span>
                <button
                  className="bg-yellow-500 text-white w-6 h-6 rounded-full text-sm font-bold hover:bg-yellow-600"
                  onClick={() => handleAdd(item)}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button className="absolute bottom-24 right-6 bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-600">
        confirmar
      </button>

      <BottomNavBar />
    </div>
  )
}
