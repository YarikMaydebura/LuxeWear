import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  showValue?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const value = index + 1
        const isFilled = value <= displayRating
        const isHalfFilled = !isFilled && value - 0.5 <= displayRating

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={cn(
              'relative transition-transform',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
            aria-label={`${value} star${value !== 1 ? 's' : ''}`}
          >
            {/* Background star (empty) */}
            <Star
              className={cn(
                sizeClasses[size],
                'text-stone-300'
              )}
            />
            {/* Filled star overlay */}
            {(isFilled || isHalfFilled) && (
              <Star
                className={cn(
                  sizeClasses[size],
                  'absolute inset-0 text-yellow-400 fill-yellow-400',
                  isHalfFilled && 'clip-path-half'
                )}
                style={isHalfFilled ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
              />
            )}
          </button>
        )
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

// Display-only star rating (simpler, for product cards)
interface StarDisplayProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

export function StarDisplay({ rating, reviewCount, size = 'sm', className }: StarDisplayProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: 5 }, (_, index) => {
          const isFilled = index < fullStars
          const isHalf = index === fullStars && hasHalfStar

          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                isFilled || isHalf
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-stone-300'
              )}
              style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
            />
          )
        })}
      </div>
      {typeof reviewCount === 'number' && (
        <span className="text-xs text-muted-foreground">
          ({reviewCount})
        </span>
      )}
    </div>
  )
}
