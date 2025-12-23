import { wishlistRepository } from '../repositories/wishlist.repository'
import { productRepository } from '../repositories/product.repository'
import { WishlistItem, Product } from '../types'
import { ApiError } from '../utils/api-error'

interface WishlistItemWithProduct extends WishlistItem {
  product: Product
}

class WishlistService {
  async getWishlist(userId: string): Promise<WishlistItemWithProduct[]> {
    const items = await wishlistRepository.findByUserId(userId)

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await productRepository.findById(item.productId)
        return {
          ...item,
          product: product!,
        }
      })
    )

    // Filter out items where product no longer exists
    return itemsWithProducts.filter((item) => item.product !== undefined)
  }

  async addToWishlist(userId: string, productId: number): Promise<WishlistItemWithProduct> {
    // Validate product exists
    const product = await productRepository.findById(productId)
    if (!product) {
      throw ApiError.notFound('Product not found')
    }

    const item = await wishlistRepository.add(userId, productId)
    return { ...item, product }
  }

  async removeFromWishlist(userId: string, productId: number): Promise<void> {
    await wishlistRepository.remove(userId, productId)
  }

  async syncWishlist(userId: string, productIds: number[]): Promise<WishlistItemWithProduct[]> {
    // Add all local wishlist items to server
    for (const productId of productIds) {
      const product = await productRepository.findById(productId)
      if (product) {
        await wishlistRepository.add(userId, productId)
      }
    }

    return this.getWishlist(userId)
  }
}

export const wishlistService = new WishlistService()
