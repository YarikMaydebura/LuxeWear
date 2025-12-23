import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, CheckCircle } from 'lucide-react'
import { StarRating } from './star-rating'
import { cn } from '@/lib/utils'

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  text: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => { success: boolean; error?: string }
  onCancel?: () => void
  initialData?: Partial<ReviewFormData>
  isEditing?: boolean
  className?: string
}

export function ReviewForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  className,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating || 0)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      title: initialData?.title || '',
      text: initialData?.text || '',
    },
  })

  const handleRatingChange = (value: number) => {
    setRating(value)
    setValue('rating', value, { shouldValidate: true })
  }

  const handleFormSubmit = async (data: ReviewFormData) => {
    setSubmitStatus('idle')
    setErrorMessage('')

    const result = onSubmit(data)

    if (result.success) {
      setSubmitStatus('success')
      if (!isEditing) {
        reset()
        setRating(0)
      }
      setTimeout(() => {
        setSubmitStatus('idle')
        onCancel?.()
      }, 2000)
    } else {
      setSubmitStatus('error')
      setErrorMessage(result.error || 'Failed to submit review')
    }
  }

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn('bg-muted/30 rounded-lg p-6', className)}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">
          {isEditing ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Overall Rating <span className="text-destructive">*</span>
          </label>
          <div className="flex items-center gap-4">
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onChange={handleRatingChange}
            />
            {rating > 0 && (
              <span className="text-sm text-muted-foreground">
                {ratingLabels[rating]}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="review-title" className="block text-sm font-medium mb-2">
            Review Title <span className="text-destructive">*</span>
          </label>
          <input
            id="review-title"
            type="text"
            {...register('title')}
            placeholder="Summarize your experience"
            className={cn(
              'w-full px-4 py-3 border rounded-md bg-background transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              errors.title && 'border-destructive'
            )}
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review-text" className="block text-sm font-medium mb-2">
            Your Review <span className="text-destructive">*</span>
          </label>
          <textarea
            id="review-text"
            {...register('text')}
            rows={5}
            placeholder="Share your experience with this product. What did you like or dislike?"
            className={cn(
              'w-full px-4 py-3 border rounded-md bg-background transition-colors resize-none',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              errors.text && 'border-destructive'
            )}
          />
          {errors.text && (
            <p className="text-sm text-destructive mt-1">{errors.text.message}</p>
          )}
        </div>

        {/* Submit Status Messages */}
        <AnimatePresence mode="wait">
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-md"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{isEditing ? 'Review updated successfully!' : 'Review submitted successfully!'}</span>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-md"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success'}
            className={cn(
              'px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md',
              'hover:bg-primary/90 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  )
}
