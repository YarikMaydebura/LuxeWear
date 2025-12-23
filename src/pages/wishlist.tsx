import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { useWishlist } from '@/hooks/use-wishlist'
import { useProducts } from '@/hooks/use-products'
import { useCart } from '@/hooks/use-cart'
import { ProductGrid } from '@/components/products/product-grid'
import { Button } from '@/components/ui/button'
import { fadeInVariants, fadeInUpVariants } from '@/lib/animations'

export function WishlistPage() {
  const navigate = useNavigate()
  const { items: wishlistItems, removeFromWishlist } = useWishlist()
  const { data: allProducts } = useProducts()
  const { addToCart } = useCart()

  // Get full product details for wishlist items
  const wishlistProducts = allProducts?.filter((product) =>
    wishlistItems.some((item) => item.productId === product.id)
  ) || []

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      addToCart(product)
    })
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-stone-400" />
          </div>
          <h1 className="text-3xl font-heading font-light mb-4">
            Your Wishlist is Empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Save your favorite items to your wishlist for easy access later.
          </p>
          <Button onClick={() => navigate('/shop')} size="lg">
            Explore Products
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="border-b bg-stone-50/50"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl lg:text-5xl font-heading font-light">
              My Wishlist
            </h1>
            <Button
              onClick={handleAddAllToCart}
              variant="outline"
              className="hidden md:flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Add All to Cart
            </Button>
          </div>
          <p className="text-muted-foreground">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </motion.div>

      {/* Wishlist Products */}
      <div className="container mx-auto px-4 py-12">
        {/* Mobile: Add All Button */}
        <div className="md:hidden mb-6">
          <Button
            onClick={handleAddAllToCart}
            className="w-full flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add All to Cart
          </Button>
        </div>

        {/* Products Grid with custom cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <WishlistCard
              key={product.id}
              product={product}
              onRemove={() => removeFromWishlist(product.id)}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Wishlist Card Component
interface WishlistCardProps {
  product: any
  onRemove: () => void
  onAddToCart: () => void
}

function WishlistCard({ product, onRemove, onAddToCart }: WishlistCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
        aria-label="Remove from wishlist"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Product Image */}
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="aspect-square overflow-hidden bg-white cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category.name}
        </p>
        <h3
          onClick={() => navigate(`/product/${product.id}`)}
          className="font-medium mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors min-h-[3rem]"
        >
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.onSale && product.originalPrice ? (
            <>
              <p className="font-semibold text-primary">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="font-semibold text-primary">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart()
          }}
          className="w-full"
          size="sm"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  )
}
