import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Truck, RefreshCw, Shield, ChevronLeft } from 'lucide-react'
import { useProduct } from '@/hooks/use-products'
import { useProducts } from '@/hooks/use-products'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { useToast } from '@/components/ui/toast'
import { ProductGallery } from '@/components/products/product-gallery'
import { SizeSelector } from '@/components/products/size-selector'
import { ColorSelector } from '@/components/products/color-selector'
import { ProductTabs } from '@/components/products/product-tabs'
import { ProductGrid } from '@/components/products/product-grid'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { fadeInVariants, fadeInUpVariants } from '@/lib/animations'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productId = id ? parseInt(id) : 0

  // Fetch product data
  const { data: product, isLoading, error } = useProduct(productId)
  const { data: allProducts } = useProducts()

  // Cart and Wishlist
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { showToast } = useToast()

  // Selection state
  const [selectedSize, setSelectedSize] = useState<string | undefined>()
  const [selectedColor, setSelectedColor] = useState<string | undefined>()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  // Reset selections when product changes
  useEffect(() => {
    setSelectedSize(undefined)
    setSelectedColor(undefined)
    setQuantity(1)
    setAddedToCart(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [productId])

  const inWishlist = product ? isInWishlist(product.id) : false

  const handleAddToCart = () => {
    if (!product) return

    // Check if size is required but not selected
    const needsSize = product.sizes && product.sizes.length > 1
    if (needsSize && !selectedSize) {
      showToast({ type: 'error', title: 'Size Required', message: 'Please select a size before adding to cart' })
      return
    }

    // Check if color is required but not selected
    const needsColor = product.colors && product.colors.length > 0
    if (needsColor && !selectedColor) {
      showToast({ type: 'error', title: 'Color Required', message: 'Please select a color before adding to cart' })
      return
    }

    addToCart(product, selectedSize, selectedColor, quantity)
    showToast({ type: 'success', title: 'Added to Cart', message: `${product.title} has been added to your cart` })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlistToggle = () => {
    if (product) {
      toggleWishlist(product)
    }
  }

  // Get related products (same category)
  const relatedProducts =
    product && allProducts
      ? allProducts
          .filter(
            (p) =>
              p.category.name === product.category.name && p.id !== product.id
          )
          .slice(0, 4)
      : []

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Gallery Skeleton */}
          <div className="animate-pulse">
            <div className="aspect-square bg-muted rounded-lg mb-4" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-muted rounded-md" />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="h-24 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  // Error or not found
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-heading font-light mb-4">
          Product Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link
              to={`/shop/${product.category.name.toLowerCase().replace(/['\s]/g, '-')}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Product Gallery */}
          <motion.div variants={fadeInVariants} initial="hidden" animate="visible" className="max-w-md mx-auto lg:max-w-lg">
            <ProductGallery images={product.images} productName={product.title} />
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isNew && (
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  NEW
                </span>
              )}
              {product.isBestSeller && (
                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                  BESTSELLER
                </span>
              )}
              {product.onSale && (
                <span className="px-3 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
                  SALE
                </span>
              )}
            </div>

            {/* Title & Category */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category.name}
              </p>
              <h1 className="text-3xl lg:text-4xl font-heading font-light mb-3">
                {product.title}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(product.rating!)
                            ? 'text-amber-500'
                            : 'text-stone-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <p className="text-3xl font-semibold">
                {formatPrice(product.price)}
              </p>
              {product.onSale && product.originalPrice && (
                <>
                  <p className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                  <span className="px-2 py-1 bg-rose-100 text-rose-700 text-sm font-medium rounded">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 1 && (
              <div>
                <label className="block text-sm font-medium mb-3">
                  Select Size
                </label>
                <SizeSelector
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSizeSelect={setSelectedSize}
                />
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-3">
                  Select Color {selectedColor && `- ${selectedColor}`}
                </label>
                <ColorSelector
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                />
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-stone-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 border-x border-stone-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-4 py-2 hover:bg-stone-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Max 10 items
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1"
                disabled={addedToCart}
              >
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleWishlistToggle}
                size="lg"
                variant="outline"
                className="px-4"
              >
                <Heart
                  className={`w-5 h-5 ${
                    inWishlist ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </Button>
            </div>

            {/* Product Benefits */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    On orders over $100
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-sm text-muted-foreground">
                    30-day return policy
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-sm text-muted-foreground">
                    100% secure transactions
                  </p>
                </div>
              </div>
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-sm text-muted-foreground pt-4 border-t">
                SKU: {product.sku}
              </p>
            )}
          </motion.div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <ProductTabs product={product} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-heading font-light">
                You May Also Like
              </h2>
              <Link
                to={`/shop/${product.category.name.toLowerCase().replace(/['\s]/g, '-')}`}
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </div>
  )
}
