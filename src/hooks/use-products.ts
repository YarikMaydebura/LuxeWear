import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { productService } from '@/services/product-service'
import type { Product, PlatziProduct } from '@/types'
import { enrichProducts, enrichProduct } from '@/lib/enrichment'

interface UseProductsParams {
  offset?: number
  limit?: number
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  title?: string
}

/**
 * Hook to fetch all products with optional filters
 */
export function useProducts(
  params?: UseProductsParams,
  options?: Omit<UseQueryOptions<Product[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Product[]>({
    queryKey: ['products', params],
    queryFn: async () => {
      const data = await productService.getAll(params)
      return enrichProducts(data)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(
  id: number,
  options?: Omit<UseQueryOptions<Product>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const data = await productService.getById(id)
      return enrichProduct(data)
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!id,
    ...options,
  })
}

/**
 * Hook to fetch products by category
 */
export function useProductsByCategory(
  categoryId: number,
  limit?: number,
  options?: Omit<UseQueryOptions<Product[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Product[]>({
    queryKey: ['products', 'category', categoryId, limit],
    queryFn: async () => {
      const data = await productService.getByCategory(categoryId, limit)
      return enrichProducts(data)
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!categoryId,
    ...options,
  })
}

/**
 * Hook to fetch featured products (limited set)
 */
export function useFeaturedProducts(limit: number = 8) {
  return useProducts(
    { limit },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes for featured
    }
  )
}

/**
 * Hook to fetch new arrivals (sorted by date)
 */
export function useNewArrivals(limit: number = 8) {
  return useQuery<Product[]>({
    queryKey: ['products', 'new-arrivals', limit],
    queryFn: async () => {
      const data = await productService.getAll({ limit: limit * 2 })
      const enriched = enrichProducts(data)

      // Sort by creation date and filter only new products
      return enriched
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .filter(p => p.isNew)
        .slice(0, limit)
    },
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Hook to fetch bestsellers
 */
export function useBestSellers(limit: number = 8) {
  return useQuery<Product[]>({
    queryKey: ['products', 'bestsellers', limit],
    queryFn: async () => {
      const data = await productService.getAll({ limit: limit * 3 })
      const enriched = enrichProducts(data)

      // Filter only bestsellers
      return enriched
        .filter(p => p.isBestSeller)
        .slice(0, limit)
    },
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Hook to fetch sale items
 */
export function useSaleProducts(limit?: number) {
  return useQuery<Product[]>({
    queryKey: ['products', 'sale', limit],
    queryFn: async () => {
      const data = await productService.getAll({ limit: limit ? limit * 2 : 50 })
      const enriched = enrichProducts(data)

      // Filter only products on sale
      const saleItems = enriched.filter(p => p.onSale)
      return limit ? saleItems.slice(0, limit) : saleItems
    },
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch related products (same category, excluding current)
 */
export function useRelatedProducts(
  productId: number,
  categoryId: number,
  limit: number = 6
) {
  return useQuery<Product[]>({
    queryKey: ['products', 'related', productId, categoryId, limit],
    queryFn: async () => {
      const data = await productService.getByCategory(categoryId, limit + 5)
      const enriched = enrichProducts(data)

      // Exclude the current product and limit results
      return enriched
        .filter(p => p.id !== productId)
        .slice(0, limit)
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!productId && !!categoryId,
  })
}
