import { query, queryOne } from '../config/database'
import { WishlistItem } from '../types'

interface WishlistItemRow {
  user_id: string
  product_id: number
  added_at: Date
}

class WishlistRepository {
  private mapRow(row: WishlistItemRow): WishlistItem {
    return {
      userId: row.user_id,
      productId: row.product_id,
      addedAt: row.added_at,
    }
  }

  async findByUserId(userId: string): Promise<WishlistItem[]> {
    const rows = await query<WishlistItemRow>(
      'SELECT * FROM wishlist_items WHERE user_id = $1 ORDER BY added_at DESC',
      [userId]
    )
    return rows.map(this.mapRow)
  }

  async findByUserAndProduct(userId: string, productId: number): Promise<WishlistItem | null> {
    const row = await queryOne<WishlistItemRow>(
      'SELECT * FROM wishlist_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    )
    return row ? this.mapRow(row) : null
  }

  async add(userId: string, productId: number): Promise<WishlistItem> {
    const rows = await query<WishlistItemRow>(
      `INSERT INTO wishlist_items (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO UPDATE SET added_at = NOW()
       RETURNING *`,
      [userId, productId]
    )
    return this.mapRow(rows[0])
  }

  async remove(userId: string, productId: number): Promise<void> {
    await query(
      'DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    )
  }

  async clear(userId: string): Promise<void> {
    await query('DELETE FROM wishlist_items WHERE user_id = $1', [userId])
  }
}

export const wishlistRepository = new WishlistRepository()
