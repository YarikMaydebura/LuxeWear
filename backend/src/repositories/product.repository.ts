import { query, queryOne } from '../config/database'
import { Product, ProductFilters, PaginationParams, Category, ProductSize, ProductColor } from '../types'

interface ProductRow {
  id: number
  title: string
  slug: string
  description: string
  price: string
  original_price: string | null
  category_id: number
  sku: string
  is_active: boolean
  is_new: boolean
  is_best_seller: boolean
  on_sale: boolean
  created_at: Date
  category_name?: string
  category_slug?: string
  category_image?: string
  rating?: string
  review_count?: string
}

class ProductRepository {
  private async mapRow(row: ProductRow): Promise<Product> {
    const productId = row.id

    // Get images
    const images = await query<{ url: string }>(
      'SELECT url FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC',
      [productId]
    )

    // Get sizes
    const sizes = await query<{ id: number; name: string; in_stock: boolean }>(
      'SELECT id, name, in_stock FROM product_sizes WHERE product_id = $1',
      [productId]
    )

    // Get colors
    const colors = await query<{ id: number; name: string; hex_code: string; in_stock: boolean }>(
      'SELECT id, name, hex_code, in_stock FROM product_colors WHERE product_id = $1',
      [productId]
    )

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
      categoryId: row.category_id,
      category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug || '',
        image: row.category_image,
      } : undefined,
      sku: row.sku,
      isActive: row.is_active,
      isNew: row.is_new,
      isBestSeller: row.is_best_seller,
      onSale: row.on_sale,
      images: images.map((i) => i.url),
      sizes: sizes.map((s) => ({
        id: s.id,
        productId,
        name: s.name,
        inStock: s.in_stock,
      })),
      colors: colors.map((c) => ({
        id: c.id,
        productId,
        name: c.name,
        hexCode: c.hex_code,
        inStock: c.in_stock,
      })),
      rating: row.rating ? parseFloat(row.rating) : undefined,
      reviewCount: row.review_count ? parseInt(row.review_count) : undefined,
      createdAt: row.created_at,
    }
  }

  async findAll(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<{ products: Product[]; total: number }> {
    const conditions: string[] = ['p.is_active = true']
    const params: unknown[] = []
    let paramIndex = 1

    if (filters.categoryId) {
      conditions.push(`p.category_id = $${paramIndex++}`)
      params.push(filters.categoryId)
    }

    if (filters.categorySlug) {
      conditions.push(`c.slug = $${paramIndex++}`)
      params.push(filters.categorySlug)
    }

    if (filters.minPrice !== undefined) {
      conditions.push(`p.price >= $${paramIndex++}`)
      params.push(filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(`p.price <= $${paramIndex++}`)
      params.push(filters.maxPrice)
    }

    if (filters.isNew) {
      conditions.push('p.is_new = true')
    }

    if (filters.isBestSeller) {
      conditions.push('p.is_best_seller = true')
    }

    if (filters.onSale) {
      conditions.push('p.on_sale = true')
    }

    if (filters.search) {
      conditions.push(`to_tsvector('english', p.title || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', $${paramIndex++})`)
      params.push(filters.search)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Sort
    let orderBy = 'p.created_at DESC'
    switch (filters.sort) {
      case 'price_asc':
        orderBy = 'p.price ASC'
        break
      case 'price_desc':
        orderBy = 'p.price DESC'
        break
      case 'newest':
        orderBy = 'p.created_at DESC'
        break
      case 'name_asc':
        orderBy = 'p.title ASC'
        break
      case 'name_desc':
        orderBy = 'p.title DESC'
        break
    }

    // Count total
    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}`,
      params
    )
    const total = parseInt(countResult?.count || '0')

    // Get products
    const rows = await query<ProductRow>(
      `SELECT p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.image as category_image,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON p.id = r.product_id
       ${whereClause}
       GROUP BY p.id, c.name, c.slug, c.image
       ORDER BY ${orderBy}
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, pagination.limit, pagination.offset]
    )

    const products = await Promise.all(rows.map((row) => this.mapRow(row)))

    return { products, total }
  }

  async findById(id: number): Promise<Product | null> {
    const row = await queryOne<ProductRow>(
      `SELECT p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.image as category_image,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.id = $1
       GROUP BY p.id, c.name, c.slug, c.image`,
      [id]
    )
    return row ? this.mapRow(row) : null
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const row = await queryOne<ProductRow>(
      `SELECT p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.image as category_image,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.slug = $1
       GROUP BY p.id, c.name, c.slug, c.image`,
      [slug]
    )
    return row ? this.mapRow(row) : null
  }

  async findFeatured(limit = 8): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `SELECT p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.image as category_image,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.is_active = true AND (p.is_best_seller = true OR p.is_new = true)
       GROUP BY p.id, c.name, c.slug, c.image
       ORDER BY p.is_best_seller DESC, p.created_at DESC
       LIMIT $1`,
      [limit]
    )
    return Promise.all(rows.map((row) => this.mapRow(row)))
  }

  async findNewArrivals(limit = 8): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `SELECT p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.image as category_image,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.is_active = true AND p.is_new = true
       GROUP BY p.id, c.name, c.slug, c.image
       ORDER BY p.created_at DESC
       LIMIT $1`,
      [limit]
    )
    return Promise.all(rows.map((row) => this.mapRow(row)))
  }

  async findBestSellers(limit = 8): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `SELECT p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.image as category_image,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.is_active = true AND p.is_best_seller = true
       GROUP BY p.id, c.name, c.slug, c.image
       ORDER BY rating DESC
       LIMIT $1`,
      [limit]
    )
    return Promise.all(rows.map((row) => this.mapRow(row)))
  }

  async findOnSale(limit = 8): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `SELECT p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.image as category_image,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.is_active = true AND p.on_sale = true
       GROUP BY p.id, c.name, c.slug, c.image
       ORDER BY (p.original_price - p.price) / p.original_price DESC
       LIMIT $1`,
      [limit]
    )
    return Promise.all(rows.map((row) => this.mapRow(row)))
  }

  async search(searchQuery: string, limit = 20): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `SELECT p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.image as category_image,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count,
        ts_rank(to_tsvector('english', p.title || ' ' || COALESCE(p.description, '')), plainto_tsquery('english', $1)) as rank
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.is_active = true
         AND to_tsvector('english', p.title || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', $1)
       GROUP BY p.id, c.name, c.slug, c.image
       ORDER BY rank DESC
       LIMIT $2`,
      [searchQuery, limit]
    )
    return Promise.all(rows.map((row) => this.mapRow(row)))
  }
}

export const productRepository = new ProductRepository()
