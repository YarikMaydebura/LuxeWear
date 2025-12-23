import { pool } from '../src/config/database'
import { logger } from '../src/utils/logger'

interface FakeStoreProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

const categoryMapping: Record<string, string> = {
  "men's clothing": 'mens-clothing',
  "women's clothing": 'womens-clothing',
  jewelery: 'jewelery',
  electronics: 'electronics',
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateSku(category: string, id: number): string {
  const prefix = category.substring(0, 3).toUpperCase()
  return `${prefix}-${id.toString().padStart(4, '0')}`
}

function generateSizes(category: string): string[] {
  if (category.includes('clothing')) {
    return ['XS', 'S', 'M', 'L', 'XL']
  }
  if (category === 'jewelery') {
    return ['One Size']
  }
  return ['Standard']
}

function generateColors(category: string): { name: string; hex: string }[] {
  if (category.includes('clothing')) {
    return [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Gray', hex: '#6b7280' },
    ]
  }
  if (category === 'jewelery') {
    return [
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Silver', hex: '#c0c0c0' },
      { name: 'Rose Gold', hex: '#b76e79' },
    ]
  }
  return [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
  ]
}

async function seedFromFakeStore() {
  const client = await pool.connect()

  try {
    logger.info('Fetching products from FakeStore API...')
    const response = await fetch('https://fakestoreapi.com/products')
    const products = (await response.json()) as FakeStoreProduct[]

    logger.info(`Fetched ${products.length} products`)

    await client.query('BEGIN')

    for (const product of products) {
      const categorySlug = categoryMapping[product.category]

      // Get category ID
      const categoryResult = await client.query(
        'SELECT id FROM categories WHERE slug = $1',
        [categorySlug]
      )

      if (categoryResult.rows.length === 0) {
        logger.warn(`Category not found for: ${product.category}`)
        continue
      }

      const categoryId = categoryResult.rows[0].id
      const slug = generateSlug(product.title)
      const sku = generateSku(categorySlug, product.id)
      const isNew = product.id % 5 === 0
      const isBestSeller = product.rating.rate >= 4.5
      const onSale = product.id % 4 === 0
      const originalPrice = onSale ? Math.round(product.price * 1.25 * 100) / 100 : null

      // Insert product
      const productResult = await client.query(
        `INSERT INTO products (title, slug, description, price, original_price, category_id, sku, is_new, is_best_seller, on_sale)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           price = EXCLUDED.price,
           original_price = EXCLUDED.original_price,
           is_new = EXCLUDED.is_new,
           is_best_seller = EXCLUDED.is_best_seller,
           on_sale = EXCLUDED.on_sale
         RETURNING id`,
        [product.title, slug, product.description, product.price, originalPrice, categoryId, sku, isNew, isBestSeller, onSale]
      )

      const productId = productResult.rows[0].id

      // Insert product image
      await client.query(
        `INSERT INTO product_images (product_id, url, is_primary) VALUES ($1, $2, true)
         ON CONFLICT DO NOTHING`,
        [productId, product.image]
      )

      // Insert sizes
      const sizes = generateSizes(product.category)
      for (const size of sizes) {
        await client.query(
          `INSERT INTO product_sizes (product_id, name, in_stock) VALUES ($1, $2, true)
           ON CONFLICT DO NOTHING`,
          [productId, size]
        )
      }

      // Insert colors
      const colors = generateColors(product.category)
      for (const color of colors) {
        await client.query(
          `INSERT INTO product_colors (product_id, name, hex_code, in_stock) VALUES ($1, $2, $3, true)
           ON CONFLICT DO NOTHING`,
          [productId, color.name, color.hex]
        )
      }

      logger.info(`Seeded product: ${product.title}`)
    }

    await client.query('COMMIT')
    logger.info('Seeding completed successfully!')
  } catch (error) {
    await client.query('ROLLBACK')
    logger.error('Seeding failed:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seedFromFakeStore()
