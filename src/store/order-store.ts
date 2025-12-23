import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order, CartItem, Address, OrderStatus } from '@/types'

interface OrderStore {
  orders: Order[]

  // Actions
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  getOrderById: (orderId: string) => Order | undefined
  getOrdersByUserId: (userId: string) => Order[]
  clearOrders: () => void
}

// Generate unique order ID
const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: generateOrderId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set({ orders: [newOrder, ...get().orders] })
        return newOrder
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          ),
        })
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId)
      },

      getOrdersByUserId: (userId) => {
        return get().orders.filter((order) => order.userId === userId)
      },

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'luxe-order-storage',
    }
  )
)

// Helper to create a mock order for demo purposes
export function createMockOrder(
  userId: string,
  items: CartItem[],
  shippingAddress: Address
): Omit<Order, 'id' | 'createdAt' | 'updatedAt'> {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.1

  return {
    userId,
    items,
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    status: 'processing',
    shippingAddress,
    paymentMethod: 'Credit Card',
  }
}
