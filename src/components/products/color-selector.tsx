import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { Color } from '@/types'

interface ColorSelectorProps {
  colors: Color[]
  selectedColor?: string
  onColorSelect: (color: string) => void
  required?: boolean
  className?: string
}

export function ColorSelector({
  colors,
  selectedColor,
  onColorSelect,
  required = false,
  className = '',
}: ColorSelectorProps) {
  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-3">
        <label className="text-sm font-medium">
          Color {required && <span className="text-rose-500">*</span>}
        </label>
      </div>

      {/* Color Grid */}
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <motion.button
            key={color.name}
            onClick={() => color.inStock && onColorSelect(color.name)}
            disabled={!color.inStock}
            whileHover={color.inStock ? { scale: 1.1 } : undefined}
            whileTap={color.inStock ? { scale: 0.95 } : undefined}
            className={`
              relative flex flex-col items-center gap-2 group
              ${!color.inStock && 'cursor-not-allowed'}
            `}
            title={color.name}
          >
            {/* Color Swatch */}
            <div
              className={`
                w-12 h-12 rounded-full border-2 transition-all
                ${
                  selectedColor === color.name
                    ? 'border-primary ring-4 ring-primary/20 scale-110'
                    : color.inStock
                    ? 'border-stone-300 group-hover:border-stone-400'
                    : 'border-stone-200 opacity-50'
                }
              `}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: color.hex }}
              />

              {/* Selected Check */}
              {selectedColor === color.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                  </div>
                </motion.div>
              )}

              {/* Out of Stock Slash */}
              {!color.inStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-stone-400 rotate-45" />
                </div>
              )}
            </div>

            {/* Color Name */}
            <span
              className={`
                text-xs transition-colors
                ${
                  selectedColor === color.name
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                }
                ${!color.inStock && 'line-through opacity-50'}
              `}
            >
              {color.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Selected Color Display */}
      {selectedColor && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground mt-4"
        >
          Selected: <span className="font-medium text-foreground">{selectedColor}</span>
        </motion.p>
      )}

      {/* Out of Stock Message */}
      {!selectedColor && colors.every((c) => !c.inStock) && (
        <p className="text-sm text-rose-500 mt-3">All colors are currently out of stock</p>
      )}
    </div>
  )
}
