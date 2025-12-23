import { z } from 'zod'

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(1, 'Title is required').max(200),
  text: z.string().min(10, 'Review must be at least 10 characters').max(2000),
})

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  title: z.string().min(1).max(200).optional(),
  text: z.string().min(10).max(2000).optional(),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>
