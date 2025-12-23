import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/types'

/**
 * Custom hook for cart operations
 * Provides a clean interface to the cart store with additional helpers
 */
export function useCart() {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const getTotal = useCartStore((state) => state.getTotal)
  const getItemCount = useCartStore((state) => state.getItemCount)

  /**
   * Add product to cart with validation
   */
  const addToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    quantity: number = 1
  ): { success: boolean; message: string } => {
    // Validate size selection if product has sizes
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return {
        success: false,
        message: 'Please select a size',
      }
    }

    // Validate color selection if product has colors
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      return {
        success: false,
        message: 'Please select a color',
      }
    }

    // Validate quantity
    if (quantity < 1) {
      return {
        success: false,
        message: 'Quantity must be at least 1',
      }
    }

    try {
      addItem(product, selectedSize, selectedColor, quantity)
      return {
        success: true,
        message: 'Added to cart',
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add to cart',
      }
    }
  }

  /**
   * Check if a specific product variant is in cart
   */
  const isInCart = (
    productId: number,
    selectedSize?: string,
    selectedColor?: string
  ): boolean => {
    return items.some(
      (item) =>
        item.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    )
  }

  /**
   * Get quantity of a specific product variant in cart
   */
  const getItemQuantity = (
    productId: number,
    selectedSize?: string,
    selectedColor?: string
  ): number => {
    const item = items.find(
      (item) =>
        item.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    )
    return item?.quantity || 0
  }

  /**
   * Increment item quantity
   */
  const incrementQuantity = (cartItemId: string) => {
    const item = items.find((i) => i.cartItemId === cartItemId)
    if (item) {
      updateQuantity(cartItemId, item.quantity + 1)
    }
  }

  /**
   * Decrement item quantity (minimum 1)
   */
  const decrementQuantity = (cartItemId: string) => {
    const item = items.find((i) => i.cartItemId === cartItemId)
    if (item && item.quantity > 1) {
      updateQuantity(cartItemId, item.quantity - 1)
    }
  }

  /**
   * Get cart subtotal (before shipping and taxes)
   */
  const getSubtotal = (): number => {
    return getTotal()
  }

  /**
   * Get estimated shipping (free shipping over $100)
   */
  const getShipping = (): number => {
    const subtotal = getSubtotal()
    return subtotal >= 100 ? 0 : 10
  }

  /**
   * Get estimated tax (10% for demo purposes)
   */
  const getTax = (): number => {
    return getSubtotal() * 0.1
  }

  /**
   * Get grand total (subtotal + shipping + tax)
   */
  const getGrandTotal = (): number => {
    return getSubtotal() + getShipping() + getTax()
  }

  /**
   * Check if cart qualifies for free shipping
   */
  const hasFreeShipping = (): boolean => {
    return getSubtotal() >= 100
  }

  /**
   * Get amount needed for free shipping
   */
  const getFreeShippingRemaining = (): number => {
    const remaining = 100 - getSubtotal()
    return remaining > 0 ? remaining : 0
  }

  return {
    // State
    items,
    itemCount: getItemCount(),
    isEmpty: items.length === 0,

    // Basic operations
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,

    // Helper functions
    isInCart,
    getItemQuantity,
    incrementQuantity,
    decrementQuantity,

    // Calculations
    subtotal: getSubtotal(),
    shipping: getShipping(),
    tax: getTax(),
    total: getGrandTotal(),
    hasFreeShipping: hasFreeShipping(),
    freeShippingRemaining: getFreeShippingRemaining(),
  }
}
