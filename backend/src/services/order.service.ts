import { orderRepository } from '../repositories/order.repository'
import { productRepository } from '../repositories/product.repository'
import { Order, OrderStatus } from '../types'
import { ApiError } from '../utils/api-error'
import { CreateOrderInput } from '../validators/order.validator'

class OrderService {
  async getUserOrders(userId: string): Promise<Order[]> {
    return orderRepository.findByUserId(userId)
  }

  async getOrderById(userId: string, orderId: string): Promise<Order> {
    const order = await orderRepository.findById(orderId)
    if (!order) {
      throw ApiError.notFound('Order not found')
    }

    if (order.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to view this order')
    }

    return order
  }

  async createOrder(userId: string, data: CreateOrderInput): Promise<Order> {
    // Validate products and get snapshots
    const itemsWithSnapshots = await Promise.all(
      data.items.map(async (item) => {
        const product = await productRepository.findById(item.productId)
        if (!product) {
          throw ApiError.badRequest(`Product with ID ${item.productId} not found`)
        }

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          productSnapshot: {
            id: product.id,
            title: product.title,
            price: product.price,
            images: product.images.slice(0, 1),
          },
        }
      })
    )

    const order = await orderRepository.create({
      userId,
      items: itemsWithSnapshots,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      subtotal: data.subtotal,
      shipping: data.shipping,
      tax: data.tax,
      total: data.total,
    })

    return order
  }

  async cancelOrder(userId: string, orderId: string): Promise<Order> {
    const order = await this.getOrderById(userId, orderId)

    if (order.status !== 'pending') {
      throw ApiError.badRequest('Only pending orders can be cancelled')
    }

    const updatedOrder = await orderRepository.updateStatus(orderId, 'cancelled')
    if (!updatedOrder) {
      throw ApiError.internal('Failed to cancel order')
    }

    return updatedOrder
  }
}

export const orderService = new OrderService()
