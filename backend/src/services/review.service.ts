import { reviewRepository } from '../repositories/review.repository'
import { orderRepository } from '../repositories/order.repository'
import { userRepository } from '../repositories/user.repository'
import { Review } from '../types'
import { ApiError } from '../utils/api-error'
import { CreateReviewInput, UpdateReviewInput } from '../validators/review.validator'

class ReviewService {
  async getProductReviews(productId: number): Promise<Review[]> {
    return reviewRepository.findByProductId(productId)
  }

  async createReview(userId: string, productId: number, data: CreateReviewInput): Promise<Review> {
    // Check if user already reviewed this product
    const existingReview = await reviewRepository.findByUserAndProduct(userId, productId)
    if (existingReview) {
      throw ApiError.conflict('You have already reviewed this product')
    }

    // Check if user has purchased the product
    const hasPurchased = await orderRepository.hasUserPurchasedProduct(userId, productId)

    // Get user name
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.unauthorized('User not found')
    }

    const userName = `${user.firstName} ${user.lastName[0]}.`

    const review = await reviewRepository.create({
      productId,
      userId,
      userName,
      rating: data.rating,
      title: data.title,
      text: data.text,
      isVerifiedPurchase: hasPurchased,
    })

    return review
  }

  async updateReview(userId: string, reviewId: string, data: UpdateReviewInput): Promise<Review> {
    const review = await reviewRepository.findById(reviewId)
    if (!review) {
      throw ApiError.notFound('Review not found')
    }

    if (review.userId !== userId) {
      throw ApiError.forbidden('You can only edit your own reviews')
    }

    const updatedReview = await reviewRepository.update(reviewId, data)
    if (!updatedReview) {
      throw ApiError.internal('Failed to update review')
    }

    return updatedReview
  }

  async deleteReview(userId: string, reviewId: string): Promise<void> {
    const review = await reviewRepository.findById(reviewId)
    if (!review) {
      throw ApiError.notFound('Review not found')
    }

    if (review.userId !== userId) {
      throw ApiError.forbidden('You can only delete your own reviews')
    }

    await reviewRepository.delete(reviewId)
  }

  async voteHelpful(userId: string, reviewId: string): Promise<void> {
    const review = await reviewRepository.findById(reviewId)
    if (!review) {
      throw ApiError.notFound('Review not found')
    }

    if (review.userId === userId) {
      throw ApiError.badRequest('You cannot vote on your own review')
    }

    const hasVoted = await reviewRepository.hasUserVoted(reviewId, userId)
    if (hasVoted) {
      throw ApiError.badRequest('You have already voted on this review')
    }

    await reviewRepository.addVote(reviewId, userId)
  }
}

export const reviewService = new ReviewService()
