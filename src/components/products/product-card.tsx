import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { useWishlist } from '@/hooks/use-wishlist'
import {
  fadeInUpVariants,
  productCardVariants,
  productImageVariants,
  iconButtonVariants,
} from '@/lib/animations'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  showQuickAdd?: boolean
  className?: string
}

export function ProductCard({ product, showQuickAdd = false, className = '' }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [imageIndex, setImageIndex] = useState(0)
  const inWishlist = isInWishlist(product.id)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  const handleMouseEnter = () => {
    if (product.images.length > 1) {
      setImageIndex(1)
    }
  }

  const handleMouseLeave = () => {
    setImageIndex(0)
  }

  return (
    <motion.div
      variants={fadeInUpVariants}
      whileHover="hover"
      initial="rest"
      className={`group cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${product.id}`}>
        <motion.div
          variants={productCardVariants}
          className="bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
        >
          {/* Image Section */}
          <div className="aspect-square overflow-hidden bg-white relative">
            <motion.img
              key={imageIndex}
              variants={productImageVariants}
              src={product.images[imageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-contain p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.isNew && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full"
                >
                  NEW
                </motion.span>
              )}
              {product.onSale && product.originalPrice && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="px-3 py-1 bg-rose-500 text-white text-xs font-medium rounded-full"
                >
                  SALE
                </motion.span>
              )}
              {product.isBestSeller && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full"
                >
                  BESTSELLER
                </motion.span>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              variants={iconButtonVariants}
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  inWishlist ? 'fill-rose-500 text-rose-500' : 'text-stone-600'
                }`}
              />
            </motion.button>

            {/* Quick Add Button (Optional) */}
            {showQuickAdd && (
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Quick add functionality will be implemented later
                  }}
                  className="w-full py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors text-sm font-medium"
                >
                  Quick Add
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
              {product.category.name}
            </p>
            <h3 className="font-medium mb-2 line-clamp-2 min-h-[3rem]">
              {product.title}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              {product.onSale && product.originalPrice ? (
                <>
                  <p className="font-semibold text-primary">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                  <span className="text-xs font-medium text-rose-500">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              ) : (
                <p className="font-semibold text-primary">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(product.rating!)
                          ? 'text-amber-500'
                          : 'text-stone-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {product.reviewCount && (
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            )}

            {/* Colors Preview (if available) */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1 mt-3">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-stone-300"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
