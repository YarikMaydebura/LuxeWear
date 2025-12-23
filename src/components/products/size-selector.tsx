import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import type { Size } from '@/types'

interface SizeSelectorProps {
  sizes: Size[]
  selectedSize?: string
  onSizeSelect: (size: string) => void
  showSizeGuide?: boolean
  onSizeGuideClick?: () => void
  required?: boolean
  className?: string
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
  showSizeGuide = true,
  onSizeGuideClick,
  required = false,
  className = '',
}: SizeSelectorProps) {
  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium">
          Size {required && <span className="text-rose-500">*</span>}
        </label>
        {showSizeGuide && (
          <button
            onClick={onSizeGuideClick}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Info className="w-4 h-4" />
            Size Guide
          </button>
        )}
      </div>

      {/* Size Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {sizes.map((size) => (
          <motion.button
            key={size.name}
            onClick={() => size.inStock && onSizeSelect(size.name)}
            disabled={!size.inStock}
            whileHover={size.inStock ? { scale: 1.05 } : undefined}
            whileTap={size.inStock ? { scale: 0.95 } : undefined}
            className={`
              relative px-4 py-3 rounded-md border-2 text-sm font-medium transition-all
              ${
                selectedSize === size.name
                  ? 'border-primary bg-primary text-primary-foreground'
                  : size.inStock
                  ? 'border-stone-300 hover:border-stone-400'
                  : 'border-stone-200 bg-stone-100 cursor-not-allowed'
              }
            `}
          >
            <span className={!size.inStock ? 'line-through opacity-50' : ''}>
              {size.name}
            </span>
            {!size.inStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-stone-400 rotate-[-25deg]" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected Size Display */}
      {selectedSize && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground mt-3"
        >
          Selected: <span className="font-medium text-foreground">{selectedSize}</span>
        </motion.p>
      )}

      {/* Out of Stock Message */}
      {!selectedSize && sizes.every((s) => !s.inStock) && (
        <p className="text-sm text-rose-500 mt-3">All sizes are currently out of stock</p>
      )}
    </div>
  )
}
