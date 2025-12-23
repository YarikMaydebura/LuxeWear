import type { Size, Color, SortOption } from '@/types'

// Available sizes for products
export const SIZES: Size[] = [
  { name: 'XS', inStock: true },
  { name: 'S', inStock: true },
  { name: 'M', inStock: true },
  { name: 'L', inStock: true },
  { name: 'XL', inStock: true },
]

// Available colors for products
export const COLORS: Color[] = [
  { name: 'Black', hex: '#000000', inStock: true },
  { name: 'White', hex: '#FFFFFF', inStock: true },
  { name: 'Gray', hex: '#6B7280', inStock: true },
  { name: 'Navy', hex: '#1E3A8A', inStock: true },
  { name: 'Beige', hex: '#D4C5B0', inStock: true },
  { name: 'Olive', hex: '#6B7F39', inStock: true },
]

// Sort options for product listing
export const SORT_OPTIONS: SortOption[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
]

// Shipping information
export const SHIPPING_INFO = {
  freeShippingThreshold: 150,
  standardShipping: {
    cost: 10,
    estimatedDays: '5-7 business days',
  },
  expressShipping: {
    cost: 25,
    estimatedDays: '2-3 business days',
  },
}

// Return policy
export const RETURN_POLICY = {
  days: 30,
  description: 'Free returns within 30 days of purchase',
}

// Contact information
export const CONTACT_INFO = {
  email: 'hello@luxewear.com',
  phone: '+1 (555) 123-4567',
  address: {
    street: '123 Fashion Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
  },
  hours: {
    weekdays: '10am - 8pm',
    weekends: '11am - 6pm',
  },
}

// Social media links
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/luxewear',
  facebook: 'https://facebook.com/luxewear',
  pinterest: 'https://pinterest.com/luxewear',
  twitter: 'https://twitter.com/luxewear',
}
