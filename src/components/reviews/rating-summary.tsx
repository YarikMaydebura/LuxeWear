import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingSummaryProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number>
  ratingPercentages: Record<number, number>
  onFilterByRating?: (rating: number | null) => void
  activeFilter?: number | null
  className?: string
}

export function RatingSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
  ratingPercentages,
  onFilterByRating,
  activeFilter,
  className,
}: RatingSummaryProps) {
  const handleBarClick = (rating: number) => {
    if (onFilterByRating) {
      if (activeFilter === rating) {
        onFilterByRating(null) // Clear filter if clicking the same one
      } else {
        onFilterByRating(rating)
      }
    }
  }

  return (
    <div className={cn('flex flex-col md:flex-row gap-8', className)}>
      {/* Average Rating */}
      <div className="flex flex-col items-center justify-center text-center md:pr-8 md:border-r border-border">
        <div className="text-5xl font-light mb-2">{averageRating.toFixed(1)}</div>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'w-5 h-5',
                star <= Math.round(averageRating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-stone-300'
              )}
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating] || 0
          const percentage = ratingPercentages[rating] || 0
          const isActive = activeFilter === rating

          return (
            <button
              key={rating}
              onClick={() => handleBarClick(rating)}
              disabled={!onFilterByRating}
              className={cn(
                'w-full flex items-center gap-3 group',
                onFilterByRating && 'cursor-pointer hover:opacity-80',
                isActive && 'opacity-100'
              )}
            >
              {/* Star Label */}
              <div className="flex items-center gap-1 w-16 shrink-0">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>

              {/* Progress Bar */}
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={cn(
                    'h-full rounded-full transition-colors',
                    isActive ? 'bg-primary' : 'bg-yellow-400',
                    onFilterByRating && 'group-hover:bg-primary/80'
                  )}
                />
              </div>

              {/* Count */}
              <div className="w-12 text-right text-sm text-muted-foreground">
                {count}
              </div>
            </button>
          )
        })}

        {/* Clear Filter Button */}
        {activeFilter !== null && activeFilter !== undefined && onFilterByRating && (
          <button
            onClick={() => onFilterByRating(null)}
            className="text-sm text-primary hover:underline mt-2"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  )
}

// Compact version for product cards
interface RatingSummaryCompactProps {
  averageRating: number
  totalReviews: number
  className?: string
}

export function RatingSummaryCompact({
  averageRating,
  totalReviews,
  className,
}: RatingSummaryCompactProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4',
              star <= Math.round(averageRating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-stone-300'
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">
        ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  )
}
