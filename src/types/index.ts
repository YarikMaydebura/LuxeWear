// FakeStore API Response Types
export interface FakeStoreProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export interface FakeStoreCategory {
  name: string
}

// Legacy Platzi types (for compatibility)
export interface PlatziProduct extends FakeStoreProduct {
  images: string[]
  category: PlatziCategory | string
  createdAt?: string
  updatedAt?: string
}

export interface PlatziCategory {
  id?: number
  name: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

// Extended App Types (enriched with local data)
export interface Product extends PlatziProduct {
  // Additional fields for luxury store
  originalPrice?: number
  sizes?: Size[]
  colors?: Color[]
  isNew?: boolean
  isBestSeller?: boolean
  onSale?: boolean
  rating?: number
  reviewCount?: number
  sku?: string
}

export interface Size {
  name: string
  inStock: boolean
}

export interface Color {
  name: string
  hex: string
  inStock: boolean
}

export interface CartItem extends Product {
  selectedSize?: string
  selectedColor?: string
  quantity: number
  cartItemId: string // unique ID for cart item (product + size + color)
}

export interface WishlistItem {
  productId: number
  addedAt: string
}

export interface FilterState {
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  search?: string
  sizes?: string[]
  colors?: string[]
}

export interface SortOption {
  label: string
  value: 'featured' | 'price-asc' | 'price-desc' | 'newest'
}

// User & Authentication Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
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
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

// Order Types
export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  shippingAddress: Address
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

// Review Types
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
  createdAt: string
}
