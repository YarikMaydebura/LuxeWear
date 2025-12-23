import { useState } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, CheckCircle, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { StarDisplay } from './star-rating'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
  isOwnReview?: boolean
  onVoteHelpful?: (reviewId: string) => void
  onEdit?: (reviewId: string) => void
  onDelete?: (reviewId: string) => void
  className?: string
}

export function ReviewCard({
  review,
  isOwnReview = false,
  onVoteHelpful,
  onEdit,
  onDelete,
  className,
}: ReviewCardProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleVoteHelpful = () => {
    if (!hasVoted && !isOwnReview && onVoteHelpful) {
      onVoteHelpful(review.id)
      setHasVoted(true)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('border-b border-border pb-6 last:border-0', className)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {review.userName.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.userName}</span>
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Verified Purchase
                </span>
              )}
              {isOwnReview && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  Your Review
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarDisplay rating={review.rating} size="sm" />
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Actions Menu (for own reviews) */}
        {isOwnReview && (onEdit || onDelete) && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Review actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                {/* Menu */}
                <div className="absolute right-0 mt-1 w-36 bg-background border border-border rounded-md shadow-lg z-20">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(review.id)
                        setMenuOpen(false)
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(review.id)
                        setMenuOpen(false)
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="ml-[52px]">
        <h4 className="font-medium mb-2">{review.title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{review.text}</p>
      </div>

      {/* Helpful Section */}
      <div className="ml-[52px] mt-4 flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {review.helpfulCount > 0
            ? `${review.helpfulCount} ${review.helpfulCount === 1 ? 'person' : 'people'} found this helpful`
            : 'Was this review helpful?'}
        </span>

        {!isOwnReview && (
          <button
            onClick={handleVoteHelpful}
            disabled={hasVoted}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors',
              hasVoted
                ? 'bg-primary/10 text-primary cursor-default'
                : 'border border-border hover:bg-muted'
            )}
          >
            <ThumbsUp className={cn('w-4 h-4', hasVoted && 'fill-current')} />
            {hasVoted ? 'Helpful' : 'Yes'}
          </button>
        )}
      </div>
    </motion.div>
  )
}

// Skeleton for loading state
export function ReviewCardSkeleton() {
  return (
    <div className="border-b border-border pb-6 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-muted rounded mb-2" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      </div>
      <div className="ml-[52px] space-y-2">
        <div className="h-4 w-48 bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-3/4 bg-muted rounded" />
      </div>
    </div>
  )
}
