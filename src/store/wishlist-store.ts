import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem } from '@/types'

interface WishlistStore {
  items: WishlistItem[]
  addItem: (productId: number) => void
  removeItem: (productId: number) => void
  toggleItem: (productId: number) => void
  clearWishlist: () => void
  isInWishlist: (productId: number) => boolean
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        const exists = get().items.find((item) => item.productId === productId)
        if (!exists) {
          set({
            items: [...get().items, { productId, addedAt: new Date().toISOString() }],
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        })
      },

      toggleItem: (productId) => {
        const exists = get().items.find((item) => item.productId === productId)
        if (exists) {
          get().removeItem(productId)
        } else {
          get().addItem(productId)
        }
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId)
      },

      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'luxe-wishlist-storage',
    }
  )
)
