import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, size?: string, color?: string, quantity?: number) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, quantity = 1) => {
        const cartItemId = `${product.id}-${size || 'none'}-${color || 'none'}`
        const existingItem = get().items.find((item) => item.cartItemId === cartItemId)

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [
              ...get().items,
              {
                ...product,
                selectedSize: size,
                selectedColor: color,
                quantity,
                cartItemId,
              },
            ],
          })
        }
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter((item) => item.cartItemId !== cartItemId) })
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity === 0) {
          get().removeItem(cartItemId)
        } else {
          set({
            items: get().items.map((item) =>
              item.cartItemId === cartItemId ? { ...item, quantity } : item
            ),
          })
        }
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'luxe-cart-storage',
    }
  )
)
