import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { productService } from '@/services/product-service'
import type { PlatziCategory, Product } from '@/types'
import { enrichProducts } from '@/lib/enrichment'

/**
 * Hook to fetch all categories
 */
export function useCategories(
  options?: Omit<UseQueryOptions<PlatziCategory[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PlatziCategory[]>({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes (categories rarely change)
    ...options,
  })
}

/**
 * Hook to fetch a single category by name
 */
export function useCategory(
  categoryName: string,
  options?: Omit<UseQueryOptions<PlatziCategory>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PlatziCategory>({
    queryKey: ['category', categoryName],
    queryFn: () => productService.getCategory(categoryName),
    staleTime: 30 * 60 * 1000,
    enabled: !!categoryName,
    ...options,
  })
}

/**
 * Hook to fetch products for a specific category
 */
export function useCategoryProducts(
  categoryName: string,
  limit?: number,
  options?: Omit<UseQueryOptions<Product[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Product[]>({
    queryKey: ['category-products', categoryName, limit],
    queryFn: async () => {
      const data = await productService.getByCategory(categoryName, limit)
      return enrichProducts(data)
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!categoryName,
    ...options,
  })
}
