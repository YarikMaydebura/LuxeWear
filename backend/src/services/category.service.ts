import { categoryRepository } from '../repositories/category.repository'
import { productRepository } from '../repositories/product.repository'
import { Category, Product, PaginationParams } from '../types'
import { ApiError } from '../utils/api-error'

class CategoryService {
  async getCategories(): Promise<Category[]> {
    return categoryRepository.findAll()
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await categoryRepository.findById(id)
    if (!category) {
      throw ApiError.notFound('Category not found')
    }
    return category
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await categoryRepository.findBySlug(slug)
    if (!category) {
      throw ApiError.notFound('Category not found')
    }
    return category
  }

  async getCategoryWithProducts(
    slug: string,
    pagination: PaginationParams
  ): Promise<{ category: Category; products: Product[]; total: number }> {
    const category = await this.getCategoryBySlug(slug)

    const { products, total } = await productRepository.findAll(
      { categoryId: category.id },
      pagination
    )

    return { category, products, total }
  }
}

export const categoryService = new CategoryService()
