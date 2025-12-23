import { useCallback, useMemo } from 'react'
import { useReviewStore } from '@/store/review-store'
import { useAuth } from './use-auth'
import { useOrderStore } from '@/store/order-store'
import type { Review } from '@/types'

export type ReviewSortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'

interface UseReviewsOptions {
  productId: number
  sortBy?: ReviewSortOption
  filterRating?: number | null
}

export function useReviews(options: UseReviewsOptions) {
  const { productId, sortBy = 'newest', filterRating = null } = options

  const { user, isAuthenticated } = useAuth()
  const orders = useOrderStore((state) => state.orders)

  // Get all reviews from store and filter by productId in useMemo
  const allReviews = useReviewStore((state) => state.reviews)
  const addReviewToStore = useReviewStore((state) => state.addReview)
  const updateReviewInStore = useReviewStore((state) => state.updateReview)
  const deleteReviewFromStore = useReviewStore((state) => state.deleteReview)
  const voteHelpfulInStore = useReviewStore((state) => state.voteHelpful)

  // Filter reviews for this product
  const reviews = useMemo(() => {
    return allReviews.filter((review) => review.productId === productId)
  }, [allReviews, productId])

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }, [reviews])

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach((review) => {
      distribution[review.rating]++
    })
    return distribution
  }, [reviews])

  // Check if user has purchased this product
  const hasUserPurchasedProduct = useMemo(() => {
    if (!user) return false
    return orders.some(
      (order) =>
        order.userId === user.id &&
        order.status !== 'cancelled' &&
        order.items.some((item) => item.id === productId)
    )
  }, [user, orders, productId])

  // Check if user has already reviewed this product
  const userReview = useMemo(() => {
    if (!user) return undefined
    return reviews.find((review) => review.userId === user.id)
  }, [user, reviews])

  const canReview = isAuthenticated && !userReview

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews]

    // Filter by rating
    if (filterRating !== null) {
      result = result.filter((review) => review.rating === filterRating)
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'highest':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating)
        break
      case 'helpful':
        result.sort((a, b) => b.helpfulCount - a.helpfulCount)
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [reviews, sortBy, filterRating])

  // Add review
  const addReview = useCallback(
    (data: { rating: number; title: string; text: string }) => {
      if (!user || !canReview) {
        return { success: false, error: 'Cannot add review' }
      }

      try {
        const review = addReviewToStore({
          productId,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName[0]}.`,
          rating: data.rating,
          title: data.title,
          text: data.text,
          isVerifiedPurchase: hasUserPurchasedProduct,
        })

        return { success: true, review }
      } catch (error) {
        return { success: false, error: 'Failed to add review' }
      }
    },
    [user, canReview, productId, hasUserPurchasedProduct, addReviewToStore]
  )

  // Update review
  const updateReview = useCallback(
    (reviewId: string, data: { rating?: number; title?: string; text?: string }) => {
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const review = reviews.find((r) => r.id === reviewId)
      if (!review || review.userId !== user.id) {
        return { success: false, error: 'Cannot update this review' }
      }

      try {
        updateReviewInStore(reviewId, data)
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to update review' }
      }
    },
    [user, reviews, updateReviewInStore]
  )

  // Delete review
  const deleteReview = useCallback(
    (reviewId: string) => {
      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const review = reviews.find((r) => r.id === reviewId)
      if (!review || review.userId !== user.id) {
        return { success: false, error: 'Cannot delete this review' }
      }

      try {
        deleteReviewFromStore(reviewId)
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to delete review' }
      }
    },
    [user, reviews, deleteReviewFromStore]
  )

  // Vote helpful
  const voteHelpful = useCallback(
    (reviewId: string) => {
      // In a real app, we'd track which reviews the user has voted on
      voteHelpfulInStore(reviewId)
    },
    [voteHelpfulInStore]
  )

  // Calculate rating percentages for distribution
  const ratingPercentages = useMemo(() => {
    const total = reviews.length
    if (total === 0) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    return {
      1: Math.round((ratingDistribution[1] / total) * 100),
      2: Math.round((ratingDistribution[2] / total) * 100),
      3: Math.round((ratingDistribution[3] / total) * 100),
      4: Math.round((ratingDistribution[4] / total) * 100),
      5: Math.round((ratingDistribution[5] / total) * 100),
    }
  }, [reviews.length, ratingDistribution])

  return {
    // Data
    reviews: filteredAndSortedReviews,
    totalReviews: reviews.length,
    averageRating,
    ratingDistribution,
    ratingPercentages,

    // User-specific
    userReview,
    canReview,
    hasUserPurchasedProduct,

    // Actions
    addReview,
    updateReview,
    deleteReview,
    voteHelpful,
  }
}
