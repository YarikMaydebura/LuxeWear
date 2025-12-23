import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import { useCategories } from '@/hooks/use-categories'
import { SIZES, COLORS } from '@/lib/constants'
import { accordionVariants, fadeInVariants } from '@/lib/animations'

interface FilterState {
  categories: number[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
}

interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  className?: string
}

export function ProductFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  className = '',
}: ProductFiltersProps) {
  const { data: categories } = useCategories()
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'categories',
    'price',
  ])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const handleCategoryToggle = (categoryId: number) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size]
    onFiltersChange({ ...filters, sizes: newSizes })
  }

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color]
    onFiltersChange({ ...filters, colors: newColors })
  }

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newPriceRange: [number, number] = [...filters.priceRange]
    newPriceRange[index] = value
    onFiltersChange({ ...filters, priceRange: newPriceRange })
  }

  const activeFiltersCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-light">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection
        title="Categories"
        isExpanded={expandedSections.includes('categories')}
        onToggle={() => toggleSection('categories')}
      >
        <div className="space-y-2">
          {categories?.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
              />
              <span className="text-sm group-hover:text-foreground transition-colors">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.includes('price')}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(0, Number(e.target.value))}
              min="0"
              max={filters.priceRange[1]}
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Min"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(1, Number(e.target.value))}
              min={filters.priceRange[0]}
              max="1000"
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Max"
            />
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(1, Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </FilterSection>

      {/* Sizes */}
      <FilterSection
        title="Sizes"
        isExpanded={expandedSections.includes('sizes')}
        onToggle={() => toggleSection('sizes')}
      >
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => (
            <button
              key={size.name}
              onClick={() => handleSizeToggle(size.name)}
              disabled={!size.inStock}
              className={`
                px-3 py-2 text-sm rounded-md border transition-all
                ${
                  filters.sizes.includes(size.name)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-stone-300 hover:border-stone-400'
                }
                ${!size.inStock && 'opacity-50 cursor-not-allowed line-through'}
              `}
            >
              {size.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection
        title="Colors"
        isExpanded={expandedSections.includes('colors')}
        onToggle={() => toggleSection('colors')}
      >
        <div className="grid grid-cols-5 gap-3">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorToggle(color.name)}
              disabled={!color.inStock}
              className={`
                relative w-10 h-10 rounded-full border-2 transition-all
                ${
                  filters.colors.includes(color.name)
                    ? 'border-primary scale-110'
                    : 'border-stone-300 hover:border-stone-400'
                }
                ${!color.inStock && 'opacity-50 cursor-not-allowed'}
              `}
              title={color.name}
              aria-label={color.name}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: color.hex }}
              />
              {filters.colors.includes(color.name) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white drop-shadow-lg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

// Filter Section Component
interface FilterSectionProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ title, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-stone-200 pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
      >
        <span className="font-medium">{title}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={accordionVariants}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
