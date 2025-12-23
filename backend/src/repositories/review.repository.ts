import { query, queryOne } from '../config/database'
import { Review } from '../types'

interface ReviewRow {
  id: string
  product_id: number
  user_id: string
  user_name: string
  rating: number
  title: string
  text: string
  is_verified_purchase: boolean
  helpful_count: number
  created_at: Date
}

interface CreateReviewData {
  productId: number
  userId: string
  userName: string
  rating: number
  title: string
  text: string
  isVerifiedPurchase: boolean
}

interface UpdateReviewData {
  rating?: number
  title?: string
  text?: string
}

class ReviewRepository {
  private mapRow(row: ReviewRow): Review {
    return {
      id: row.id,
      productId: row.product_id,
      userId: row.user_id,
      userName: row.user_name,
      rating: row.rating,
      title: row.title,
      text: row.text,
      isVerifiedPurchase: row.is_verified_purchase,
      helpfulCount: row.helpful_count,
      createdAt: row.created_at,
    }
  }

  async findByProductId(productId: number): Promise<Review[]> {
    const rows = await query<ReviewRow>(
      `SELECT r.*, CONCAT(u.first_name, ' ', LEFT(u.last_name, 1), '.') as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    )
    return rows.map(this.mapRow)
  }

  async findById(id: string): Promise<Review | null> {
    const row = await queryOne<ReviewRow>(
      `SELECT r.*, CONCAT(u.first_name, ' ', LEFT(u.last_name, 1), '.') as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = $1`,
      [id]
    )
    return row ? this.mapRow(row) : null
  }

  async findByUserAndProduct(userId: string, productId: number): Promise<Review | null> {
    const row = await queryOne<ReviewRow>(
      `SELECT r.*, CONCAT(u.first_name, ' ', LEFT(u.last_name, 1), '.') as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.user_id = $1 AND r.product_id = $2`,
      [userId, productId]
    )
    return row ? this.mapRow(row) : null
  }

  async create(data: CreateReviewData): Promise<Review> {
    const rows = await query<ReviewRow>(
      `INSERT INTO reviews (product_id, user_id, rating, title, text, is_verified_purchase)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *, (SELECT CONCAT(first_name, ' ', LEFT(last_name, 1), '.') FROM users WHERE id = $2) as user_name`,
      [data.productId, data.userId, data.rating, data.title, data.text, data.isVerifiedPurchase]
    )
    return this.mapRow(rows[0])
  }

  async update(id: string, data: UpdateReviewData): Promise<Review | null> {
    const fields: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    if (data.rating !== undefined) {
      fields.push(`rating = $${paramIndex++}`)
      values.push(data.rating)
    }
    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`)
      values.push(data.title)
    }
    if (data.text !== undefined) {
      fields.push(`text = $${paramIndex++}`)
      values.push(data.text)
    }

    if (fields.length === 0) return this.findById(id)

    values.push(id)

    await query(
      `UPDATE reviews SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
      values
    )

    return this.findById(id)
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM reviews WHERE id = $1', [id])
  }

  async incrementHelpful(id: string): Promise<void> {
    await query(
      'UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = $1',
      [id]
    )
  }

  async hasUserVoted(reviewId: string, userId: string): Promise<boolean> {
    const result = await queryOne<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM review_votes WHERE review_id = $1 AND user_id = $2) as exists',
      [reviewId, userId]
    )
    return result?.exists || false
  }

  async addVote(reviewId: string, userId: string): Promise<void> {
    await query(
      'INSERT INTO review_votes (review_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [reviewId, userId]
    )
    await this.incrementHelpful(reviewId)
  }

  async getProductRating(productId: number): Promise<{ average: number; count: number }> {
    const result = await queryOne<{ avg: string | null; count: string }>(
      'SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = $1',
      [productId]
    )
    return {
      average: result?.avg ? parseFloat(result.avg) : 0,
      count: parseInt(result?.count || '0'),
    }
  }
}

export const reviewRepository = new ReviewRepository()
