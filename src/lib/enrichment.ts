import type { PlatziProduct, Product, Size, Color } from '@/types'
import { SIZES, COLORS } from './constants'
import { generateSKU } from './utils'

/**
 * Validates if a product has valid data
 * FakeStore API has much better data quality, so less validation needed
 */
function isValidProduct(product: PlatziProduct): boolean {
  // Check basic required fields
  if (!product.title || product.title.trim().length < 3) return false
  if (!product.price || product.price <= 0) return false
  if (!product.images || product.images.length === 0) return false

  return true
}

/**
 * Filters valid images from a product
 * FakeStore API images are already clean, just basic validation
 */
function getValidImages(images: string[]): string[] {
  return images.filter(img => img && typeof img === 'string' && img.startsWith('http'))
}

/**
 * Enriches a Platzi API product with luxury store features
 */
export function enrichProduct(product: PlatziProduct): Product {
  const isNew = product.createdAt ? isProductNew(product.createdAt) : false
  const isBestSeller = Math.random() > 0.7 // 30% chance to be bestseller
  const hasDiscount = Math.random() > 0.8 // 20% chance to have discount

  // Filter to only valid images
  const validImages = getValidImages(product.images)

  // Use FakeStore rating if available, otherwise generate
  const rating = 'rating' in product && product.rating ? product.rating.rate : generateRating()
  const reviewCount = 'rating' in product && product.rating ? product.rating.count : generateReviewCount()

  return {
    ...product,
    images: validImages.length > 0 ? validImages : product.images,
    sku: generateSKU(product.id, typeof product.category === 'object' ? product.category.id || 0 : 0),
    sizes: getProductSizes(typeof product.category === 'object' ? product.category.name : product.category),
    colors: getProductColors(typeof product.category === 'object' ? product.category.name : product.category),
    isNew,
    isBestSeller,
    onSale: hasDiscount,
    originalPrice: hasDiscount ? product.price * 1.3 : undefined,
    rating,
    reviewCount,
  }
}

/**
 * Enriches multiple products and filters out invalid ones
 */
export function enrichProducts(products: PlatziProduct[]): Product[] {
  return products
    .filter(isValidProduct) // Filter out products with bad data
    .map(enrichProduct)
}

/**
 * Determines if a product is "new" (created within last 30 days)
 */
function isProductNew(createdAt: string): boolean {
  const created = new Date(createdAt)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return created > thirtyDaysAgo
}

/**
 * Returns available sizes based on category
 */
function getProductSizes(categoryName: string): Size[] {
  const lowerCategory = categoryName.toLowerCase()

  // Shoes might have different sizes
  if (lowerCategory.includes('shoes') || lowerCategory.includes('zapatos')) {
    return [
      { name: '6', inStock: true },
      { name: '7', inStock: true },
      { name: '8', inStock: true },
      { name: '9', inStock: true },
      { name: '10', inStock: Math.random() > 0.3 },
      { name: '11', inStock: Math.random() > 0.5 },
    ]
  }

  // Accessories might not have sizes
  if (lowerCategory.includes('accessories') || lowerCategory.includes('electronics')) {
    return [{ name: 'One Size', inStock: true }]
  }

  // Default clothing sizes
  return SIZES.map(size => ({
    ...size,
    inStock: Math.random() > 0.2, // 80% chance to be in stock
  }))
}

/**
 * Returns available colors based on category
 */
function getProductColors(categoryName: string): Color[] {
  const lowerCategory = categoryName.toLowerCase()

  // Electronics might have fewer color options
  if (lowerCategory.includes('electronics')) {
    return COLORS.filter(c =>
      ['Black', 'White', 'Gray'].includes(c.name)
    ).map(color => ({
      ...color,
      inStock: Math.random() > 0.3,
    }))
  }

  // Clothing gets full color range
  const colorCount = Math.floor(Math.random() * 3) + 3 // 3-5 colors
  return COLORS.slice(0, colorCount).map(color => ({
    ...color,
    inStock: Math.random() > 0.2,
  }))
}

/**
 * Generates a random rating between 3.5 and 5.0
 */
function generateRating(): number {
  return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10
}

/**
 * Generates a random review count
 */
function generateReviewCount(): number {
  return Math.floor(Math.random() * 200) + 5
}

/**
 * Filters products by category name
 */
export function filterByCategory(products: Product[], category: string): Product[] {
  const lowerCategory = category.toLowerCase()
  return products.filter(p =>
    p.category.name.toLowerCase().includes(lowerCategory)
  )
}

/**
 * Sorts products by various criteria
 */
export function sortProducts(
  products: Product[],
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest'
): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)

    case 'newest':
      return sorted.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

    case 'featured':
    default:
      // Featured: prioritize bestsellers and new items
      return sorted.sort((a, b) => {
        if (a.isBestSeller && !b.isBestSeller) return -1
        if (!a.isBestSeller && b.isBestSeller) return 1
        if (a.isNew && !b.isNew) return -1
        if (!a.isNew && b.isNew) return 1
        return 0
      })
  }
}

/**
 * Filters products by price range
 */
export function filterByPriceRange(
  products: Product[],
  minPrice?: number,
  maxPrice?: number
): Product[] {
  return products.filter(p => {
    if (minPrice !== undefined && p.price < minPrice) return false
    if (maxPrice !== undefined && p.price > maxPrice) return false
    return true
  })
}

/**
 * Searches products by title
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return products.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.category.name.toLowerCase().includes(lowerQuery)
  )
}
