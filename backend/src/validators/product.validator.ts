import { z } from 'zod'

export const productQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  category: z.string().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  isNew: z.string().transform((v) => v === 'true').optional(),
  isBestSeller: z.string().transform((v) => v === 'true').optional(),
  onSale: z.string().transform((v) => v === 'true').optional(),
  search: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'name_asc', 'name_desc']).optional(),
})

export type ProductQueryInput = z.infer<typeof productQuerySchema>
