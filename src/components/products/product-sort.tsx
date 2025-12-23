import { motion } from 'framer-motion'
import { Grid2X2, Grid3X3, LayoutGrid, SlidersHorizontal } from 'lucide-react'
import { SORT_OPTIONS } from '@/lib/constants'
import type { SortOption } from '@/types'

interface ProductSortProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  viewMode?: 2 | 3 | 4
  onViewModeChange?: (mode: 2 | 3 | 4) => void
  resultsCount?: number
  showViewToggle?: boolean
  showMobileFilter?: boolean
  onMobileFilterClick?: () => void
  className?: string
}

export function ProductSort({
  sortBy,
  onSortChange,
  viewMode = 4,
  onViewModeChange,
  resultsCount,
  showViewToggle = true,
  showMobileFilter = false,
  onMobileFilterClick,
  className = '',
}: ProductSortProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* Left Side: Results Count */}
      <div className="flex items-center gap-4">
        {resultsCount !== undefined && (
          <p className="text-sm text-muted-foreground">
            {resultsCount} {resultsCount === 1 ? 'product' : 'products'}
          </p>
        )}

        {/* Mobile Filter Button */}
        {showMobileFilter && (
          <button
            onClick={onMobileFilterClick}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-md hover:bg-stone-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        )}
      </div>

      {/* Right Side: Sort & View Controls */}
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none pl-3 pr-10 py-2 border border-stone-300 rounded-md text-sm bg-white hover:border-stone-400 focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer transition-colors"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-stone-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* View Mode Toggle */}
        {showViewToggle && onViewModeChange && (
          <div className="hidden md:flex items-center gap-1 border border-stone-300 rounded-md p-1">
            <ViewButton
              isActive={viewMode === 2}
              onClick={() => onViewModeChange(2)}
              icon={<Grid2X2 className="w-4 h-4" />}
              label="2 columns"
            />
            <ViewButton
              isActive={viewMode === 3}
              onClick={() => onViewModeChange(3)}
              icon={<Grid3X3 className="w-4 h-4" />}
              label="3 columns"
            />
            <ViewButton
              isActive={viewMode === 4}
              onClick={() => onViewModeChange(4)}
              icon={<LayoutGrid className="w-4 h-4" />}
              label="4 columns"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// View Toggle Button Component
interface ViewButtonProps {
  isActive: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

function ViewButton({ isActive, onClick, icon, label }: ViewButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        p-2 rounded transition-colors
        ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-stone-100 text-stone-600'
        }
      `}
      aria-label={label}
      title={label}
    >
      {icon}
    </motion.button>
  )
}
