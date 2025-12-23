import { productRepository } from '../repositories/product.repository'
import { Product, ProductFilters, PaginationParams } from '../types'
import { ApiError } from '../utils/api-error'

class ProductService {
  async getProducts(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<{ products: Product[]; total: number }> {
    return productRepository.findAll(filters, pagination)
  }

  async getProductById(id: number): Promise<Product> {
    const product = await productRepository.findById(id)
    if (!product) {
      throw ApiError.notFound('Product not found')
    }
    return product
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const product = await productRepository.findBySlug(slug)
    if (!product) {
      throw ApiError.notFound('Product not found')
    }
    return product
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    return productRepository.findFeatured(limit)
  }

  async getNewArrivals(limit = 8): Promise<Product[]> {
    return productRepository.findNewArrivals(limit)
  }

  async getBestSellers(limit = 8): Promise<Product[]> {
    return productRepository.findBestSellers(limit)
  }

  async getOnSaleProducts(limit = 8): Promise<Product[]> {
    return productRepository.findOnSale(limit)
  }

  async searchProducts(query: string, limit = 20): Promise<Product[]> {
    if (!query || query.trim().length < 2) {
      return []
    }
    return productRepository.search(query.trim(), limit)
  }
}

export const productService = new ProductService()
