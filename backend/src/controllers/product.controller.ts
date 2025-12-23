import { Request, Response, NextFunction } from 'express'
import { productService } from '../services/product.service'
import { sendSuccess, sendPaginated } from '../utils/api-response'
import { ProductQueryInput } from '../validators/product.validator'

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as ProductQueryInput
    const page = query.page || 1
    const limit = Math.min(query.limit || 20, 100)
    const offset = (page - 1) * limit

    const { products, total } = await productService.getProducts(
      {
        categorySlug: query.category,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        isNew: query.isNew,
        isBestSeller: query.isBestSeller,
        onSale: query.onSale,
        search: query.search,
        sort: query.sort,
      },
      { page, limit, offset }
    )

    sendPaginated(res, products, page, limit, total)
  } catch (error) {
    next(error)
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const product = await productService.getProductById(id)
    sendSuccess(res, product)
  } catch (error) {
    next(error)
  }
}

export async function getFeaturedProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 8
    const products = await productService.getFeaturedProducts(limit)
    sendSuccess(res, products)
  } catch (error) {
    next(error)
  }
}

export async function getNewArrivals(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 8
    const products = await productService.getNewArrivals(limit)
    sendSuccess(res, products)
  } catch (error) {
    next(error)
  }
}

export async function getBestSellers(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 8
    const products = await productService.getBestSellers(limit)
    sendSuccess(res, products)
  } catch (error) {
    next(error)
  }
}

export async function getOnSaleProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 8
    const products = await productService.getOnSaleProducts(limit)
    sendSuccess(res, products)
  } catch (error) {
    next(error)
  }
}

export async function searchProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query.q as string
    const limit = parseInt(req.query.limit as string) || 20
    const products = await productService.searchProducts(query, limit)
    sendSuccess(res, products)
  } catch (error) {
    next(error)
  }
}
