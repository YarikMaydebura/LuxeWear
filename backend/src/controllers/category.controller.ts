import { Request, Response, NextFunction } from 'express'
import { categoryService } from '../services/category.service'
import { sendSuccess, sendPaginated } from '../utils/api-response'

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoryService.getCategories()
    sendSuccess(res, categories)
  } catch (error) {
    next(error)
  }
}

export async function getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
    const offset = (page - 1) * limit

    const { category, products, total } = await categoryService.getCategoryWithProducts(
      slug,
      { page, limit, offset }
    )

    sendSuccess(res, {
      category,
      products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}
