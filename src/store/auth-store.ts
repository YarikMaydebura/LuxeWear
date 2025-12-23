import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Address } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  addresses: Address[]
  isLoading: boolean

  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void

  // Address management
  addAddress: (address: Address) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void

  // Computed
  isAuthenticated: () => boolean
  getDefaultAddress: () => Address | undefined
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      addresses: [],
      isLoading: false,

      setUser: (user) => set({ user }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => set({ user: null, token: null }),

      // Address management
      addAddress: (address) => {
        const addresses = get().addresses
        // If this is the first address or marked as default, update others
        if (address.isDefault || addresses.length === 0) {
          set({
            addresses: [
              ...addresses.map((a) => ({ ...a, isDefault: false })),
              { ...address, isDefault: true },
            ],
          })
        } else {
          set({ addresses: [...addresses, address] })
        }
      },

      updateAddress: (id, updates) => {
        set({
          addresses: get().addresses.map((address) =>
            address.id === id ? { ...address, ...updates } : address
          ),
        })
      },

      removeAddress: (id) => {
        const addresses = get().addresses.filter((a) => a.id !== id)
        // If removed address was default, make first one default
        if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
          addresses[0].isDefault = true
        }
        set({ addresses })
      },

      setDefaultAddress: (id) => {
        set({
          addresses: get().addresses.map((address) => ({
            ...address,
            isDefault: address.id === id,
          })),
        })
      },

      // Computed
      isAuthenticated: () => !!get().user && !!get().token,

      getDefaultAddress: () => get().addresses.find((a) => a.isDefault),
    }),
    {
      name: 'luxe-auth-storage',
    }
  )
)
