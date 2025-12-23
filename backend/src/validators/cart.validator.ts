import { z } from 'zod'

export const addToCartSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1).max(10).default(1),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().min(1).max(10),
})

export const syncCartSchema = z.object({
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1).max(10),
    selectedSize: z.string().optional(),
    selectedColor: z.string().optional(),
  })),
})

export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type SyncCartInput = z.infer<typeof syncCartSchema>
