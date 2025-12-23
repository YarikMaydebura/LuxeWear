import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Filter } from 'lucide-react'
import { ReviewCard, ReviewCardSkeleton } from './review-card'
import { ReviewForm } from './review-form'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'
import type { ReviewSortOption } from '@/hooks/use-reviews'

interface ReviewListProps {
  reviews: Review[]
  totalReviews: number
  sortBy: ReviewSortOption
  onSortChange: (sort: ReviewSortOption) => void
  filterRating: number | null
  onFilterChange: (rating: number | null) => void
  canReview: boolean
  userReview?: Review
  onAddReview: (data: { rating: number; title: string; text: string }) => { success: boolean; error?: string }
  onUpdateReview: (reviewId: string, data: { rating?: number; title?: string; text?: string }) => { success: boolean; error?: string }
  onDeleteReview: (reviewId: string) => { success: boolean; error?: string }
  onVoteHelpful: (reviewId: string) => void
  isLoading?: boolean
  className?: string
}

const sortOptions: { value: ReviewSortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' },
  { value: 'helpful', label: 'Most Helpful' },
]

const filterOptions = [
  { value: null, label: 'All Ratings' },
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 3, label: '3 Stars' },
  { value: 2, label: '2 Stars' },
  { value: 1, label: '1 Star' },
]

export function ReviewList({
  reviews,
  totalReviews,
  sortBy,
  onSortChange,
  filterRating,
  onFilterChange,
  canReview,
  userReview,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
  onVoteHelpful,
  isLoading = false,
  className,
}: ReviewListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)

  const handleEditReview = (reviewId: string) => {
    setEditingReviewId(reviewId)
    setShowForm(false)
  }

  const handleCancelEdit = () => {
    setEditingReviewId(null)
  }

  const handleUpdateReview = (data: { rating: number; title: string; text: string }) => {
    if (editingReviewId) {
      const result = onUpdateReview(editingReviewId, data)
      if (result.success) {
        setEditingReviewId(null)
      }
      return result
    }
    return { success: false, error: 'No review being edited' }
  }

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      onDeleteReview(reviewId)
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">
          {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
        </h3>

        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setFilterDropdownOpen(!filterDropdownOpen)
                setSortDropdownOpen(false)
              }}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              {filterOptions.find((o) => o.value === filterRating)?.label}
              <ChevronDown className={cn('w-4 h-4 transition-transform', filterDropdownOpen && 'rotate-180')} />
            </button>

            {filterDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setFilterDropdownOpen(false)} />
                <div className="absolute right-0 mt-1 w-40 bg-background border border-border rounded-md shadow-lg z-20">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value ?? 'all'}
                      onClick={() => {
                        onFilterChange(option.value)
                        setFilterDropdownOpen(false)
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors',
                        filterRating === option.value && 'bg-muted font-medium'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setSortDropdownOpen(!sortDropdownOpen)
                setFilterDropdownOpen(false)
              }}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm"
            >
              Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
              <ChevronDown className={cn('w-4 h-4 transition-transform', sortDropdownOpen && 'rotate-180')} />
            </button>

            {sortDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
                <div className="absolute right-0 mt-1 w-40 bg-background border border-border rounded-md shadow-lg z-20">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value)
                        setSortDropdownOpen(false)
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors',
                        sortBy === option.value && 'bg-muted font-medium'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      {canReview && !showForm && !userReview && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <ReviewForm
            onSubmit={onAddReview}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Reviews */}
      {!isLoading && (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {editingReviewId === review.id ? (
                  <ReviewForm
                    onSubmit={handleUpdateReview}
                    onCancel={handleCancelEdit}
                    initialData={{
                      rating: review.rating,
                      title: review.title,
                      text: review.text,
                    }}
                    isEditing
                  />
                ) : (
                  <ReviewCard
                    review={review}
                    isOwnReview={userReview?.id === review.id}
                    onVoteHelpful={onVoteHelpful}
                    onEdit={userReview?.id === review.id ? handleEditReview : undefined}
                    onDelete={userReview?.id === review.id ? handleDeleteReview : undefined}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {filterRating !== null
                  ? `No ${filterRating}-star reviews yet.`
                  : 'No reviews yet. Be the first to review!'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
