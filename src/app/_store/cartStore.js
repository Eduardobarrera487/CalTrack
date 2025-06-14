// src/app/_store/cartStore.js
import { create } from 'zustand'

export const useCartStore = create((set) => ({
  items: [],

  addItem: (newItem) =>
    set((state) => {
      const exists = state.items.find(item => item.name === newItem.name)
      if (exists) {
        return {
          items: state.items.map(item =>
            item.name === newItem.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return { items: [...state.items, { ...newItem, quantity: 1 }] }
    }),

  updateItemQuantity: (name, quantity) =>
    set((state) => ({
      items: state.items.map(item =>
        item.name === name ? { ...item, quantity } : item
      ),
    })),

  removeItemByName: (name) =>
    set((state) => ({
      items: state.items.filter((item) => item.name !== name),
    })),

  removeItem: (indexToRemove) =>
    set((state) => ({
      items: state.items.filter((_, index) => index !== indexToRemove),
    })),

  clearCart: () => set({ items: [] }),
}))
