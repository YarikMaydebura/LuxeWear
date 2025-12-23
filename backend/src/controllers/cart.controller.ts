import { Request, Response, NextFunction } from 'express'
import { cartService } from '../services/cart.service'
import { sendSuccess, sendCreated, sendNoContent } from '../utils/api-response'
import { AuthenticatedRequest } from '../types'
import { ApiError } from '../utils/api-error'

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const cart = await cartService.getCart(user.id)
    sendSuccess(res, cart)
  } catch (error) {
    next(error)
  }
}

export async function addToCart(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const item = await cartService.addToCart(user.id, req.body)
    sendCreated(res, item, 'Added to cart')
  } catch (error) {
    next(error)
  }
}

export async function updateCartItem(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const itemId = parseInt(req.params.itemId)
    const { quantity } = req.body

    const item = await cartService.updateCartItem(user.id, itemId, quantity)
    sendSuccess(res, item, 'Cart updated')
  } catch (error) {
    next(error)
  }
}

export async function removeFromCart(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const itemId = parseInt(req.params.itemId)
    await cartService.removeFromCart(user.id, itemId)
    sendNoContent(res)
  } catch (error) {
    next(error)
  }
}

export async function clearCart(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    await cartService.clearCart(user.id)
    sendNoContent(res)
  } catch (error) {
    next(error)
  }
}

export async function syncCart(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const cart = await cartService.syncCart(user.id, req.body)
    sendSuccess(res, cart, 'Cart synced')
  } catch (error) {
    next(error)
  }
}
