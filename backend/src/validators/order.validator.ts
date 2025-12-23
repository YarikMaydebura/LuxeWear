import { z } from 'zod'

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
    price: z.number().positive(),
    selectedSize: z.string().optional(),
    selectedColor: z.string().optional(),
  })).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    street: z.string().min(1),
    apartment: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().default('United States'),
    phone: z.string().optional(),
  }),
  paymentMethod: z.string().default('credit_card'),
  subtotal: z.number().positive(),
  shipping: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().positive(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
