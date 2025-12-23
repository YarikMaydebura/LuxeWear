import { pool } from '../src/config/database'
import { logger } from '../src/utils/logger'

interface ProductData {
  title: string
  description: string
  price: number
  categorySlug: string
  image: string
  isNew: boolean
  isBestSeller: boolean
  onSale: boolean
}

const additionalProducts: ProductData[] = [
  // Men's Clothing
  {
    title: "Classic Oxford Button-Down Shirt",
    description: "Timeless oxford cloth button-down shirt crafted from premium cotton. Perfect for both casual and business occasions. Features a tailored fit with a button-down collar.",
    price: 89.99,
    categorySlug: "mens-clothing",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: false
  },
  {
    title: "Premium Wool Blazer",
    description: "Sophisticated wool blend blazer with a modern slim fit. Features notch lapels, two-button closure, and functional pockets. Perfect for formal occasions.",
    price: 299.99,
    categorySlug: "mens-clothing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    isNew: false,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "Vintage Denim Jacket",
    description: "Classic denim jacket with a vintage wash. Features button closure, chest pockets, and side pockets. Made from 100% cotton denim.",
    price: 129.99,
    categorySlug: "mens-clothing",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800",
    isNew: false,
    isBestSeller: true,
    onSale: true
  },
  {
    title: "Athletic Performance Polo",
    description: "Moisture-wicking polo shirt designed for active lifestyles. Features breathable fabric, UV protection, and a classic collar design.",
    price: 59.99,
    categorySlug: "mens-clothing",
    image: "https://images.unsplash.com/photo-1625910513413-5fc42c0d8fe2?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: false
  },
  {
    title: "Slim Fit Chino Pants",
    description: "Versatile chino pants with a slim, modern fit. Made from stretch cotton for all-day comfort. Perfect for work or weekend wear.",
    price: 79.99,
    categorySlug: "mens-clothing",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
    isNew: false,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "Cashmere V-Neck Sweater",
    description: "Luxurious pure cashmere sweater with a classic V-neck design. Ultra-soft and lightweight, perfect for layering.",
    price: 249.99,
    categorySlug: "mens-clothing",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: true
  },
  {
    title: "Leather Belt Premium",
    description: "Genuine leather belt with a polished metal buckle. Handcrafted from full-grain leather for durability and style.",
    price: 69.99,
    categorySlug: "mens-clothing",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    isNew: false,
    isBestSeller: false,
    onSale: false
  },
  {
    title: "Quilted Puffer Jacket",
    description: "Warm quilted puffer jacket with synthetic down fill. Features a zip closure, stand collar, and zippered pockets.",
    price: 189.99,
    categorySlug: "mens-clothing",
    image: "https://images.unsplash.com/photo-1544923246-77307dd628b7?w=800",
    isNew: true,
    isBestSeller: true,
    onSale: false
  },

  // Women's Clothing
  {
    title: "Elegant Wrap Dress",
    description: "Flattering wrap dress with a V-neckline and tie waist. Made from flowing fabric that drapes beautifully. Perfect for any occasion.",
    price: 149.99,
    categorySlug: "womens-clothing",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    isNew: true,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "High-Waisted Wide Leg Pants",
    description: "Sophisticated wide-leg pants with a high waist. Features a flattering silhouette and comfortable elastic waistband.",
    price: 89.99,
    categorySlug: "womens-clothing",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
    isNew: false,
    isBestSeller: false,
    onSale: true
  },
  {
    title: "Silk Blouse Collection",
    description: "Luxurious silk blouse with a classic collar and button front. Features a relaxed fit and elegant drape.",
    price: 179.99,
    categorySlug: "womens-clothing",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: false
  },
  {
    title: "Cozy Knit Cardigan",
    description: "Oversized knit cardigan perfect for layering. Features an open front, dropped shoulders, and ribbed trim.",
    price: 99.99,
    categorySlug: "womens-clothing",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
    isNew: false,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "Pleated Midi Skirt",
    description: "Elegant pleated midi skirt with a flattering A-line silhouette. Features an elastic waistband and flowing fabric.",
    price: 79.99,
    categorySlug: "womens-clothing",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0edd2?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: true
  },
  {
    title: "Tailored Blazer Women",
    description: "Sharp tailored blazer with a single-button closure. Features notch lapels and flap pockets for a polished look.",
    price: 199.99,
    categorySlug: "womens-clothing",
    image: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800",
    isNew: false,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "Floral Maxi Dress",
    description: "Stunning floral print maxi dress with a tiered skirt. Features adjustable straps and a smocked bodice.",
    price: 129.99,
    categorySlug: "womens-clothing",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: false
  },
  {
    title: "Cashmere Turtleneck",
    description: "Ultra-soft cashmere turtleneck sweater. Features a relaxed fit and ribbed trim at cuffs and hem.",
    price: 279.99,
    categorySlug: "womens-clothing",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800",
    isNew: false,
    isBestSeller: true,
    onSale: true
  },

  // Jewelery
  {
    title: "Diamond Tennis Bracelet",
    description: "Stunning tennis bracelet featuring brilliant-cut diamonds set in 18k white gold. A timeless piece for any jewelry collection.",
    price: 2499.99,
    categorySlug: "jewelery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
    isNew: true,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "Pearl Drop Earrings",
    description: "Elegant freshwater pearl drop earrings with sterling silver hooks. Classic design perfect for any occasion.",
    price: 149.99,
    categorySlug: "jewelery",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
    isNew: false,
    isBestSeller: false,
    onSale: false
  },
  {
    title: "Vintage Emerald Ring",
    description: "Exquisite emerald ring set in 14k gold with diamond accents. Vintage-inspired design with modern craftsmanship.",
    price: 899.99,
    categorySlug: "jewelery",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: true
  },
  {
    title: "Layered Gold Necklace Set",
    description: "Set of three layered gold necklaces in varying lengths. Delicate chains with minimalist pendants.",
    price: 199.99,
    categorySlug: "jewelery",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
    isNew: false,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "Sapphire Stud Earrings",
    description: "Beautiful sapphire stud earrings set in sterling silver. Features genuine blue sapphires with brilliant sparkle.",
    price: 299.99,
    categorySlug: "jewelery",
    image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: false
  },
  {
    title: "Men's Signet Ring",
    description: "Classic men's signet ring in polished stainless steel. Bold design with a flat top surface.",
    price: 89.99,
    categorySlug: "jewelery",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800",
    isNew: false,
    isBestSeller: false,
    onSale: true
  },
  {
    title: "Crystal Statement Necklace",
    description: "Dramatic statement necklace featuring cascading crystals. Perfect for special occasions and evening wear.",
    price: 249.99,
    categorySlug: "jewelery",
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800",
    isNew: true,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "Minimalist Cuff Bracelet",
    description: "Sleek minimalist cuff bracelet in brushed gold. Adjustable fit with an open-back design.",
    price: 79.99,
    categorySlug: "jewelery",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800",
    isNew: false,
    isBestSeller: false,
    onSale: false
  },

  // Electronics
  {
    title: "Wireless Noise-Canceling Headphones",
    description: "Premium wireless headphones with active noise cancellation. Features 30-hour battery life and comfortable over-ear design.",
    price: 349.99,
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    isNew: true,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "Smart Watch Pro Series",
    description: "Advanced smartwatch with health monitoring, GPS, and water resistance. Compatible with iOS and Android.",
    price: 449.99,
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    isNew: true,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "Portable Bluetooth Speaker",
    description: "Compact wireless speaker with powerful 360-degree sound. Waterproof design with 12-hour battery life.",
    price: 129.99,
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
    isNew: false,
    isBestSeller: false,
    onSale: true
  },
  {
    title: "4K Action Camera",
    description: "Rugged action camera with 4K video recording and image stabilization. Includes waterproof housing and mounts.",
    price: 299.99,
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: false
  },
  {
    title: "Wireless Earbuds Elite",
    description: "True wireless earbuds with premium sound quality and active noise cancellation. Compact charging case included.",
    price: 199.99,
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    isNew: false,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "Mechanical Gaming Keyboard",
    description: "RGB mechanical gaming keyboard with customizable switches. Features programmable keys and dedicated media controls.",
    price: 159.99,
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: true
  },
  {
    title: "Wireless Gaming Mouse",
    description: "High-precision wireless gaming mouse with adjustable DPI. Features RGB lighting and programmable buttons.",
    price: 89.99,
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
    isNew: false,
    isBestSeller: true,
    onSale: false
  },
  {
    title: "USB-C Hub Multiport Adapter",
    description: "Versatile USB-C hub with HDMI, USB-A, SD card reader, and power delivery. Perfect for laptop users.",
    price: 69.99,
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800",
    isNew: false,
    isBestSeller: false,
    onSale: false
  },
  {
    title: "Portable Power Bank 20000mAh",
    description: "High-capacity portable charger with fast charging support. Features dual USB ports and LED display.",
    price: 49.99,
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
    isNew: true,
    isBestSeller: false,
    onSale: false
  },
  {
    title: "Webcam HD Pro",
    description: "Professional HD webcam with auto-focus and built-in microphone. Perfect for video conferencing and streaming.",
    price: 119.99,
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800",
    isNew: false,
    isBestSeller: true,
    onSale: true
  },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateSizes(category: string): string[] {
  if (category.includes('clothing')) {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL']
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
      { name: 'Burgundy', hex: '#800020' },
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
    { name: 'Silver', hex: '#c0c0c0' },
  ]
}

async function seedMoreProducts() {
  const client = await pool.connect()

  try {
    logger.info('Adding more products to database...')

    await client.query('BEGIN')

    let productCount = 0
    let startId = 100 // Start from ID 100 to avoid conflicts

    for (const product of additionalProducts) {
      // Get category ID
      const categoryResult = await client.query(
        'SELECT id FROM categories WHERE slug = $1',
        [product.categorySlug]
      )

      if (categoryResult.rows.length === 0) {
        logger.warn(`Category not found for: ${product.categorySlug}`)
        continue
      }

      const categoryId = categoryResult.rows[0].id
      const slug = generateSlug(product.title)
      const sku = `${product.categorySlug.substring(0, 3).toUpperCase()}-${(startId++).toString().padStart(4, '0')}`
      const originalPrice = product.onSale ? Math.round(product.price * 1.25 * 100) / 100 : null

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
        [product.title, slug, product.description, product.price, originalPrice, categoryId, sku, product.isNew, product.isBestSeller, product.onSale]
      )

      const productId = productResult.rows[0].id

      // Insert product image
      await client.query(
        `INSERT INTO product_images (product_id, url, is_primary) VALUES ($1, $2, true)
         ON CONFLICT DO NOTHING`,
        [productId, product.image]
      )

      // Insert sizes
      const sizes = generateSizes(product.categorySlug)
      for (const size of sizes) {
        await client.query(
          `INSERT INTO product_sizes (product_id, name, in_stock) VALUES ($1, $2, true)
           ON CONFLICT DO NOTHING`,
          [productId, size]
        )
      }

      // Insert colors
      const colors = generateColors(product.categorySlug)
      for (const color of colors) {
        await client.query(
          `INSERT INTO product_colors (product_id, name, hex_code, in_stock) VALUES ($1, $2, $3, true)
           ON CONFLICT DO NOTHING`,
          [productId, color.name, color.hex]
        )
      }

      productCount++
      logger.info(`Added product: ${product.title}`)
    }

    await client.query('COMMIT')
    logger.info(`Successfully added ${productCount} new products!`)
  } catch (error) {
    await client.query('ROLLBACK')
    logger.error('Seeding failed:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seedMoreProducts()
