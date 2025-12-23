import { query, queryOne } from '../config/database'
import { Category } from '../types'

class CategoryRepository {
  private mapRow(row: Record<string, unknown>): Category {
    return {
      id: row.id as number,
      name: row.name as string,
      slug: row.slug as string,
      image: row.image as string | undefined,
    }
  }

  async findAll(): Promise<Category[]> {
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM categories ORDER BY name'
    )
    return rows.map(this.mapRow)
  }

  async findById(id: number): Promise<Category | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    )
    return row ? this.mapRow(row) : null
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM categories WHERE slug = $1',
      [slug]
    )
    return row ? this.mapRow(row) : null
  }
}

export const categoryRepository = new CategoryRepository()
