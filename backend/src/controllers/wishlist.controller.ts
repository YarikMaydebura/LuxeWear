import { Request, Response, NextFunction } from 'express'
import { wishlistService } from '../services/wishlist.service'
import { sendSuccess, sendCreated, sendNoContent } from '../utils/api-response'
import { AuthenticatedRequest } from '../types'
import { ApiError } from '../utils/api-error'

export async function getWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const wishlist = await wishlistService.getWishlist(user.id)
    sendSuccess(res, wishlist)
  } catch (error) {
    next(error)
  }
}

export async function addToWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const { productId } = req.body
    const item = await wishlistService.addToWishlist(user.id, productId)
    sendCreated(res, item, 'Added to wishlist')
  } catch (error) {
    next(error)
  }
}

export async function removeFromWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const productId = parseInt(req.params.productId)
    await wishlistService.removeFromWishlist(user.id, productId)
    sendNoContent(res)
  } catch (error) {
    next(error)
  }
}

export async function syncWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const { productIds } = req.body
    const wishlist = await wishlistService.syncWishlist(user.id, productIds)
    sendSuccess(res, wishlist, 'Wishlist synced')
  } catch (error) {
    next(error)
  }
}
