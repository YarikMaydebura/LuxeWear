import { Request, Response, NextFunction } from 'express'
import { reviewService } from '../services/review.service'
import { sendSuccess, sendCreated, sendNoContent } from '../utils/api-response'
import { AuthenticatedRequest } from '../types'
import { ApiError } from '../utils/api-error'

export async function getProductReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = parseInt(req.params.productId)
    const reviews = await reviewService.getProductReviews(productId)
    sendSuccess(res, reviews)
  } catch (error) {
    next(error)
  }
}

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const productId = parseInt(req.params.productId)
    const review = await reviewService.createReview(user.id, productId, req.body)
    sendCreated(res, review, 'Review created successfully')
  } catch (error) {
    next(error)
  }
}

export async function updateReview(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const review = await reviewService.updateReview(user.id, req.params.id, req.body)
    sendSuccess(res, review, 'Review updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    await reviewService.deleteReview(user.id, req.params.id)
    sendNoContent(res)
  } catch (error) {
    next(error)
  }
}

export async function voteHelpful(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    await reviewService.voteHelpful(user.id, req.params.id)
    sendSuccess(res, null, 'Vote recorded')
  } catch (error) {
    next(error)
  }
}
