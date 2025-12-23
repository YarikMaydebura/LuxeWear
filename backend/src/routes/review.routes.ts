import { Router } from 'express'
import * as reviewController from '../controllers/review.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { createReviewSchema, updateReviewSchema } from '../validators/review.validator'

const router = Router()

// Public routes
router.get('/products/:productId/reviews', reviewController.getProductReviews)

// Protected routes
router.post('/products/:productId/reviews', authenticate, validate(createReviewSchema), reviewController.createReview)
router.put('/:id', authenticate, validate(updateReviewSchema), reviewController.updateReview)
router.delete('/:id', authenticate, reviewController.deleteReview)
router.post('/:id/vote', authenticate, reviewController.voteHelpful)

export default router
