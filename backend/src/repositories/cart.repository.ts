import { query, queryOne } from '../config/database'
import { CartItem } from '../types'

interface CartItemRow {
  id: number
  user_id: string
  product_id: number
  quantity: number
  selected_size: string | null
  selected_color: string | null
  created_at: Date
}

class CartRepository {
  private mapRow(row: CartItemRow): CartItem {
    return {
      id: row.id,
      userId: row.user_id,
      productId: row.product_id,
      quantity: row.quantity,
      selectedSize: row.selected_size || undefined,
      selectedColor: row.selected_color || undefined,
    }
  }

  async findByUserId(userId: string): Promise<CartItem[]> {
    const rows = await query<CartItemRow>(
      'SELECT * FROM cart_items WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    return rows.map(this.mapRow)
  }

  async findById(id: number): Promise<CartItem | null> {
    const row = await queryOne<CartItemRow>(
      'SELECT * FROM cart_items WHERE id = $1',
      [id]
    )
    return row ? this.mapRow(row) : null
  }

  async findByUserAndProduct(
    userId: string,
    productId: number,
    selectedSize?: string,
    selectedColor?: string
  ): Promise<CartItem | null> {
    const row = await queryOne<CartItemRow>(
      `SELECT * FROM cart_items
       WHERE user_id = $1
         AND product_id = $2
         AND (selected_size IS NOT DISTINCT FROM $3)
         AND (selected_color IS NOT DISTINCT FROM $4)`,
      [userId, productId, selectedSize || null, selectedColor || null]
    )
    return row ? this.mapRow(row) : null
  }

  async create(
    userId: string,
    productId: number,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ): Promise<CartItem> {
    const rows = await query<CartItemRow>(
      `INSERT INTO cart_items (user_id, product_id, quantity, selected_size, selected_color)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, productId, quantity, selectedSize || null, selectedColor || null]
    )
    return this.mapRow(rows[0])
  }

  async update(id: number, quantity: number): Promise<CartItem | null> {
    const rows = await query<CartItemRow>(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id]
    )
    return rows[0] ? this.mapRow(rows[0]) : null
  }

  async upsert(
    userId: string,
    productId: number,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ): Promise<CartItem> {
    const rows = await query<CartItemRow>(
      `INSERT INTO cart_items (user_id, product_id, quantity, selected_size, selected_color)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, product_id, selected_size, selected_color)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [userId, productId, quantity, selectedSize || null, selectedColor || null]
    )
    return this.mapRow(rows[0])
  }

  async delete(id: number): Promise<void> {
    await query('DELETE FROM cart_items WHERE id = $1', [id])
  }

  async deleteByUserId(userId: string): Promise<void> {
    await query('DELETE FROM cart_items WHERE user_id = $1', [userId])
  }
}

export const cartRepository = new CartRepository()
