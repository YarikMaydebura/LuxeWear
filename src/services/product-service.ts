import { api, fakeStoreApi, useBackend } from '@/lib/api'
import type { FakeStoreProduct, PlatziProduct, PlatziCategory } from '@/types'

/**
 * Converts FakeStore API product to internal format
 */
function convertFakeStoreProduct(fakeProduct: FakeStoreProduct): PlatziProduct {
  return {
    ...fakeProduct,
    images: [fakeProduct.image], // FakeStore has single image, convert to array
    category: {
      name: fakeProduct.category,
      id: getCategoryId(fakeProduct.category),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Maps category name to ID for consistency
 */
function getCategoryId(categoryName: string): number {
  const categoryMap: Record<string, number> = {
    'electronics': 1,
    'jewelery': 2,
    "men's clothing": 3,
    "women's clothing": 4,
  }
  return categoryMap[categoryName.toLowerCase()] || 0
}

/**
 * Maps category name to image URL
 */
function getCategoryImage(categoryName: string): string {
  const imageMap: Record<string, string> = {
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    'jewelery': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    "men's clothing": 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800',
    "women's clothing": 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
  }
  return imageMap[categoryName.toLowerCase()] || ''
}

// Backend API methods
const backendProductService = {
  getAll: async (params?: { limit?: number; page?: number; category?: string }) => {
    const { data } = await api.get('/products', { params })
    return data.data
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/products/${id}`)
    return data.data
  },

  getByCategory: async (categorySlug: string, limit?: number) => {
    const { data } = await api.get(`/categories/${categorySlug}`, {
      params: { limit },
    })
    return data.data.products
  },

  getCategories: async () => {
    const { data } = await api.get('/categories')
    return data.data
  },

  getCategory: async (categorySlug: string) => {
    const { data } = await api.get(`/categories/${categorySlug}`)
    return data.data.category
  },

  getFeatured: async (limit = 8) => {
    const { data } = await api.get('/products/featured', { params: { limit } })
    return data.data
  },

  getNewArrivals: async (limit = 8) => {
    const { data } = await api.get('/products/new-arrivals', { params: { limit } })
    return data.data
  },

  getBestSellers: async (limit = 8) => {
    const { data } = await api.get('/products/best-sellers', { params: { limit } })
    return data.data
  },

  getOnSale: async (limit = 8) => {
    const { data } = await api.get('/products/on-sale', { params: { limit } })
    return data.data
  },

  search: async (query: string, limit = 20) => {
    const { data } = await api.get('/products/search', {
      params: { q: query, limit },
    })
    return data.data
  },
}

// FakeStore API methods (fallback)
const fakeStoreProductService = {
  getAll: async (params?: { limit?: number }) => {
    const { data } = await fakeStoreApi.get<FakeStoreProduct[]>('/products', { params })
    return data.map(convertFakeStoreProduct)
  },

  getById: async (id: number) => {
    const { data } = await fakeStoreApi.get<FakeStoreProduct>(`/products/${id}`)
    return convertFakeStoreProduct(data)
  },

  getByCategory: async (categoryName: string, limit?: number) => {
    const { data } = await fakeStoreApi.get<FakeStoreProduct[]>(
      `/products/category/${categoryName}`
    )
    const products = data.map(convertFakeStoreProduct)
    return limit ? products.slice(0, limit) : products
  },

  getCategories: async () => {
    const { data } = await fakeStoreApi.get<string[]>('/products/categories')
    return data.map((name) => ({
      id: getCategoryId(name),
      name,
      image: getCategoryImage(name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  },

  getCategory: async (categoryName: string) => {
    return {
      id: getCategoryId(categoryName),
      name: categoryName,
      image: getCategoryImage(categoryName),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  getFeatured: async (limit = 8) => {
    const products = await fakeStoreProductService.getAll({ limit })
    return products.slice(0, limit)
  },

  getNewArrivals: async (limit = 8) => {
    const products = await fakeStoreProductService.getAll({ limit })
    return products.slice(0, limit)
  },

  getBestSellers: async (limit = 8) => {
    const products = await fakeStoreProductService.getAll({ limit })
    return products.slice(0, limit)
  },

  getOnSale: async (limit = 8) => {
    const products = await fakeStoreProductService.getAll({ limit })
    return products.slice(0, limit)
  },

  search: async (query: string, limit = 20) => {
    const allProducts = await fakeStoreProductService.getAll({})
    return allProducts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
  },
}

// Export product service that switches between backend and FakeStore
export const productService = {
  getAll: useBackend ? backendProductService.getAll : fakeStoreProductService.getAll,
  getById: useBackend ? backendProductService.getById : fakeStoreProductService.getById,
  getByCategory: useBackend ? backendProductService.getByCategory : fakeStoreProductService.getByCategory,
  getCategories: useBackend ? backendProductService.getCategories : fakeStoreProductService.getCategories,
  getCategory: useBackend ? backendProductService.getCategory : fakeStoreProductService.getCategory,
  getFeatured: useBackend ? backendProductService.getFeatured : fakeStoreProductService.getFeatured,
  getNewArrivals: useBackend ? backendProductService.getNewArrivals : fakeStoreProductService.getNewArrivals,
  getBestSellers: useBackend ? backendProductService.getBestSellers : fakeStoreProductService.getBestSellers,
  getOnSale: useBackend ? backendProductService.getOnSale : fakeStoreProductService.getOnSale,
  search: useBackend ? backendProductService.search : fakeStoreProductService.search,
}
