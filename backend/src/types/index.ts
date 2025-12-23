import { Request } from 'express'

export interface User {
  id: string
  email: string
  passwordHash?: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  emailVerified: boolean
  authProvider: 'local' | 'google' | 'github'
  providerId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  userId: string
  firstName: string
  lastName: string
  street: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault: boolean
  createdAt: Date
}

export interface Category {
  id: number
  name: string
  slug: string
  image?: string
}

export interface Product {
  id: number
  title: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  categoryId: number
  category?: Category
  sku: string
  isActive: boolean
  isNew: boolean
  isBestSeller: boolean
  onSale: boolean
  images: string[]
  sizes: ProductSize[]
  colors: ProductColor[]
  rating?: number
  reviewCount?: number
  createdAt: Date
}

export interface ProductSize {
  id: number
  productId: number
  name: string
  inStock: boolean
}

export interface ProductColor {
  id: number
  productId: number
  name: string
  hexCode: string
  inStock: boolean
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  userId: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  shippingAddress: Address
  paymentMethod: string
  items: OrderItem[]
  createdAt: Date
}

export interface OrderItem {
  id: number
  orderId: string
  productId: number
  quantity: number
  price: number
  selectedSize?: string
  selectedColor?: string
  productSnapshot: Partial<Product>
}

export interface Review {
  id: string
  productId: number
  userId: string
  userName: string
  rating: number
  title: string
  text: string
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: Date
}

export interface CartItem {
  id: number
  userId: string
  productId: number
  quantity: number
  selectedSize?: string
  selectedColor?: string
  product?: Product
}

export interface WishlistItem {
  userId: string
  productId: number
  addedAt: Date
  product?: Product
}

export interface RefreshToken {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  revokedAt?: Date
}

// Express request with user
export interface AuthenticatedRequest extends Request {
  user?: User
}

// JWT Payload
export interface JwtPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

// Pagination
export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

// Product filters
export interface ProductFilters {
  categoryId?: number
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  isNew?: boolean
  isBestSeller?: boolean
  onSale?: boolean
  search?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name_asc' | 'name_desc'
}
