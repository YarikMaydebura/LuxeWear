import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Review } from '@/types'

interface ReviewStore {
  reviews: Review[]

  // Actions
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>) => Review
  updateReview: (reviewId: string, updates: Partial<Pick<Review, 'rating' | 'title' | 'text'>>) => void
  deleteReview: (reviewId: string) => void
  voteHelpful: (reviewId: string) => void

  // Queries
  getReviewsByProductId: (productId: number) => Review[]
  getReviewsByUserId: (userId: string) => Review[]
  getUserReviewForProduct: (userId: string, productId: number) => Review | undefined
  getAverageRating: (productId: number) => number
  getRatingDistribution: (productId: number) => Record<number, number>
}

// Generate unique review ID
const generateReviewId = (): string => {
  return `rev-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
}

// Mock reviews for demo
const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-demo-1',
    productId: 1,
    userId: 'mock-user-1',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Absolutely love it!',
    text: 'This product exceeded my expectations. The quality is outstanding and it fits perfectly. Will definitely buy more from this brand.',
    isVerifiedPurchase: true,
    helpfulCount: 12,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-demo-2',
    productId: 1,
    userId: 'mock-user-2',
    userName: 'John D.',
    rating: 4,
    title: 'Great quality, runs slightly large',
    text: 'The material is premium and the craftsmanship is excellent. I would recommend sizing down if you prefer a fitted look.',
    isVerifiedPurchase: true,
    helpfulCount: 8,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-demo-3',
    productId: 1,
    userId: 'mock-user-3',
    userName: 'Emily R.',
    rating: 5,
    title: 'Perfect for everyday wear',
    text: 'I have been wearing this almost every day since I got it. Very comfortable and versatile. Highly recommend!',
    isVerifiedPurchase: false,
    helpfulCount: 5,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-demo-4',
    productId: 2,
    userId: 'mock-user-1',
    userName: 'Sarah M.',
    rating: 4,
    title: 'Good value for money',
    text: 'Solid product at a reasonable price. The design is elegant and modern. Shipping was fast too!',
    isVerifiedPurchase: true,
    helpfulCount: 3,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-demo-5',
    productId: 3,
    userId: 'mock-user-4',
    userName: 'Michael T.',
    rating: 5,
    title: 'Exceeded expectations',
    text: 'This is exactly what I was looking for. The attention to detail is impressive. Would buy again without hesitation.',
    isVerifiedPurchase: true,
    helpfulCount: 15,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: MOCK_REVIEWS,

      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: generateReviewId(),
          helpfulCount: 0,
          createdAt: new Date().toISOString(),
        }

        set({ reviews: [newReview, ...get().reviews] })
        return newReview
      },

      updateReview: (reviewId, updates) => {
        set({
          reviews: get().reviews.map((review) =>
            review.id === reviewId ? { ...review, ...updates } : review
          ),
        })
      },

      deleteReview: (reviewId) => {
        set({
          reviews: get().reviews.filter((review) => review.id !== reviewId),
        })
      },

      voteHelpful: (reviewId) => {
        set({
          reviews: get().reviews.map((review) =>
            review.id === reviewId
              ? { ...review, helpfulCount: review.helpfulCount + 1 }
              : review
          ),
        })
      },

      getReviewsByProductId: (productId) => {
        return get().reviews.filter((review) => review.productId === productId)
      },

      getReviewsByUserId: (userId) => {
        return get().reviews.filter((review) => review.userId === userId)
      },

      getUserReviewForProduct: (userId, productId) => {
        return get().reviews.find(
          (review) => review.userId === userId && review.productId === productId
        )
      },

      getAverageRating: (productId) => {
        const productReviews = get().getReviewsByProductId(productId)
        if (productReviews.length === 0) return 0

        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0)
        return Math.round((sum / productReviews.length) * 10) / 10
      },

      getRatingDistribution: (productId) => {
        const productReviews = get().getReviewsByProductId(productId)
        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

        productReviews.forEach((review) => {
          distribution[review.rating]++
        })

        return distribution
      },
    }),
    {
      name: 'luxe-review-storage',
    }
  )
)
