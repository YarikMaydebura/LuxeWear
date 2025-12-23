import { useWishlistStore } from '@/store/wishlist-store'
import type { Product } from '@/types'

/**
 * Custom hook for wishlist operations
 * Provides a clean interface to the wishlist store with additional helpers
 */
export function useWishlist() {
  const items = useWishlistStore((state) => state.items)
  const addItem = useWishlistStore((state) => state.addItem)
  const removeItem = useWishlistStore((state) => state.removeItem)
  const toggleItem = useWishlistStore((state) => state.toggleItem)
  const clearWishlist = useWishlistStore((state) => state.clearWishlist)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const getItemCount = useWishlistStore((state) => state.getItemCount)

  /**
   * Add product to wishlist with feedback
   */
  const addToWishlist = (product: Product): { success: boolean; message: string } => {
    if (isInWishlist(product.id)) {
      return {
        success: false,
        message: 'Already in wishlist',
      }
    }

    try {
      addItem(product.id)
      return {
        success: true,
        message: 'Added to wishlist',
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add to wishlist',
      }
    }
  }

  /**
   * Remove product from wishlist with feedback
   */
  const removeFromWishlist = (productId: number): { success: boolean; message: string } => {
    if (!isInWishlist(productId)) {
      return {
        success: false,
        message: 'Not in wishlist',
      }
    }

    try {
      removeItem(productId)
      return {
        success: true,
        message: 'Removed from wishlist',
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to remove from wishlist',
      }
    }
  }

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   */
  const toggleWishlist = (product: Product): { success: boolean; message: string } => {
    try {
      const wasInWishlist = isInWishlist(product.id)
      toggleItem(product.id)
      return {
        success: true,
        message: wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update wishlist',
      }
    }
  }

  /**
   * Get wishlist items sorted by date added (most recent first)
   */
  const getSortedItems = () => {
    return [...items].reverse()
  }

  return {
    // State
    items,
    itemCount: getItemCount(),
    isEmpty: items.length === 0,

    // Basic operations
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,

    // Helper functions
    getSortedItems,
  }
}
