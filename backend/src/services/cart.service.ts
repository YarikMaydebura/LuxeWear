import { cartRepository } from '../repositories/cart.repository'
import { productRepository } from '../repositories/product.repository'
import { CartItem, Product } from '../types'
import { ApiError } from '../utils/api-error'
import { AddToCartInput, SyncCartInput } from '../validators/cart.validator'

interface CartItemWithProduct extends CartItem {
  product: Product
}

class CartService {
  async getCart(userId: string): Promise<CartItemWithProduct[]> {
    const items = await cartRepository.findByUserId(userId)

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

  async addToCart(userId: string, data: AddToCartInput): Promise<CartItemWithProduct> {
    // Validate product exists
    const product = await productRepository.findById(data.productId)
    if (!product) {
      throw ApiError.notFound('Product not found')
    }

    const item = await cartRepository.upsert(
      userId,
      data.productId,
      data.quantity,
      data.selectedSize,
      data.selectedColor
    )

    return { ...item, product }
  }

  async updateCartItem(userId: string, itemId: number, quantity: number): Promise<CartItemWithProduct> {
    const item = await cartRepository.findById(itemId)
    if (!item || item.userId !== userId) {
      throw ApiError.notFound('Cart item not found')
    }

    const updatedItem = await cartRepository.update(itemId, quantity)
    if (!updatedItem) {
      throw ApiError.internal('Failed to update cart item')
    }

    const product = await productRepository.findById(updatedItem.productId)
    return { ...updatedItem, product: product! }
  }

  async removeFromCart(userId: string, itemId: number): Promise<void> {
    const item = await cartRepository.findById(itemId)
    if (!item || item.userId !== userId) {
      throw ApiError.notFound('Cart item not found')
    }

    await cartRepository.delete(itemId)
  }

  async clearCart(userId: string): Promise<void> {
    await cartRepository.deleteByUserId(userId)
  }

  async syncCart(userId: string, data: SyncCartInput): Promise<CartItemWithProduct[]> {
    // Get current server cart
    const serverItems = await cartRepository.findByUserId(userId)

    // Merge: for each local item, add to server (upsert)
    for (const localItem of data.items) {
      const product = await productRepository.findById(localItem.productId)
      if (!product) continue

      await cartRepository.upsert(
        userId,
        localItem.productId,
        localItem.quantity,
        localItem.selectedSize,
        localItem.selectedColor
      )
    }

    return this.getCart(userId)
  }
}

export const cartService = new CartService()
