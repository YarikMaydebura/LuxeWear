import { query, queryOne, pool } from '../config/database'
import { Order, OrderItem, OrderStatus } from '../types'
import { generateOrderId } from '../utils/order-id'

interface OrderRow {
  id: string
  user_id: string
  subtotal: string
  shipping: string
  tax: string
  total: string
  status: OrderStatus
  shipping_address: object
  payment_method: string
  created_at: Date
}

interface OrderItemRow {
  id: number
  order_id: string
  product_id: number
  quantity: number
  price: string
  selected_size: string | null
  selected_color: string | null
  product_snapshot: object
}

interface CreateOrderData {
  userId: string
  items: {
    productId: number
    quantity: number
    price: number
    selectedSize?: string
    selectedColor?: string
    productSnapshot: object
  }[]
  shippingAddress: object
  paymentMethod: string
  subtotal: number
  shipping: number
  tax: number
  total: number
}

class OrderRepository {
  private mapRow(row: OrderRow, items: OrderItemRow[] = []): Order {
    return {
      id: row.id,
      userId: row.user_id,
      subtotal: parseFloat(row.subtotal),
      shipping: parseFloat(row.shipping),
      tax: parseFloat(row.tax),
      total: parseFloat(row.total),
      status: row.status,
      shippingAddress: row.shipping_address as Order['shippingAddress'],
      paymentMethod: row.payment_method,
      items: items.map((item) => ({
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        quantity: item.quantity,
        price: parseFloat(item.price),
        selectedSize: item.selected_size || undefined,
        selectedColor: item.selected_color || undefined,
        productSnapshot: item.product_snapshot as OrderItem['productSnapshot'],
      })),
      createdAt: row.created_at,
    }
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await query<OrderRow>(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )

    const result: Order[] = []
    for (const order of orders) {
      const items = await query<OrderItemRow>(
        'SELECT * FROM order_items WHERE order_id = $1',
        [order.id]
      )
      result.push(this.mapRow(order, items))
    }

    return result
  }

  async findById(id: string): Promise<Order | null> {
    const order = await queryOne<OrderRow>(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    )

    if (!order) return null

    const items = await query<OrderItemRow>(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    )

    return this.mapRow(order, items)
  }

  async create(data: CreateOrderData): Promise<Order> {
    const client = await pool.connect()
    const orderId = generateOrderId()

    try {
      await client.query('BEGIN')

      // Create order
      const orderResult = await client.query<OrderRow>(
        `INSERT INTO orders (id, user_id, subtotal, shipping, tax, total, shipping_address, payment_method)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          orderId,
          data.userId,
          data.subtotal,
          data.shipping,
          data.tax,
          data.total,
          JSON.stringify(data.shippingAddress),
          data.paymentMethod,
        ]
      )

      // Create order items
      const items: OrderItemRow[] = []
      for (const item of data.items) {
        const itemResult = await client.query<OrderItemRow>(
          `INSERT INTO order_items (order_id, product_id, quantity, price, selected_size, selected_color, product_snapshot)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [
            orderId,
            item.productId,
            item.quantity,
            item.price,
            item.selectedSize || null,
            item.selectedColor || null,
            JSON.stringify(item.productSnapshot),
          ]
        )
        items.push(itemResult.rows[0])
      }

      await client.query('COMMIT')

      return this.mapRow(orderResult.rows[0], items)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    await query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      [status, id]
    )
    return this.findById(id)
  }

  async hasUserPurchasedProduct(userId: string, productId: number): Promise<boolean> {
    const result = await queryOne<{ exists: boolean }>(
      `SELECT EXISTS(
        SELECT 1 FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status != 'cancelled'
      ) as exists`,
      [userId, productId]
    )
    return result?.exists || false
  }
}

export const orderRepository = new OrderRepository()
