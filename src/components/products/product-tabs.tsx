import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Truck, Star, FileText } from 'lucide-react'
import { fadeInVariants } from '@/lib/animations'
import { useReviews, type ReviewSortOption } from '@/hooks/use-reviews'
import { RatingSummary } from '@/components/reviews/rating-summary'
import { ReviewList } from '@/components/reviews/review-list'
import { useAuth } from '@/hooks/use-auth'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'

interface ProductTabsProps {
  product: Product
  className?: string
}

type TabKey = 'description' | 'details' | 'shipping' | 'reviews'

interface Tab {
  key: TabKey
  label: string
  icon: React.ReactNode
}

const TABS: Tab[] = [
  { key: 'description', label: 'Description', icon: <FileText className="w-4 h-4" /> },
  { key: 'details', label: 'Details', icon: <Package className="w-4 h-4" /> },
  { key: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
  { key: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
]

export function ProductTabs({ product, className = '' }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('description')

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="border-b border-stone-200">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                relative flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap
                ${
                  activeTab === tab.key
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {tab.icon}
              {tab.label}
              {tab.key === 'reviews' && product.reviewCount && (
                <span className="ml-1 text-xs">({product.reviewCount})</span>
              )}

              {/* Active Indicator */}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {activeTab === 'description' && (
              <DescriptionTab product={product} />
            )}
            {activeTab === 'details' && <DetailsTab product={product} />}
            {activeTab === 'shipping' && <ShippingTab />}
            {activeTab === 'reviews' && <ReviewsTab product={product} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Description Tab
function DescriptionTab({ product }: { product: Product }) {
  return (
    <div className="prose prose-stone max-w-none">
      <p className="text-muted-foreground leading-relaxed">
        {product.description}
      </p>
      <p className="text-muted-foreground leading-relaxed mt-4">
        This premium {product.category.name.toLowerCase()} item combines timeless design with modern comfort.
        Crafted with attention to detail, it's perfect for both casual and formal occasions.
      </p>
    </div>
  )
}

// Details Tab
function DetailsTab({ product }: { product: Product }) {
  const details = [
    { label: 'SKU', value: product.sku || 'N/A' },
    { label: 'Category', value: product.category.name },
    { label: 'Material', value: 'Premium fabric blend' },
    { label: 'Care', value: 'Machine wash cold, tumble dry low' },
    { label: 'Fit', value: 'True to size' },
    { label: 'Origin', value: 'Imported' },
  ]

  if (product.sizes && product.sizes.length > 0) {
    details.push({
      label: 'Available Sizes',
      value: product.sizes.filter(s => s.inStock).map(s => s.name).join(', '),
    })
  }

  if (product.colors && product.colors.length > 0) {
    details.push({
      label: 'Available Colors',
      value: product.colors.filter(c => c.inStock).map(c => c.name).join(', '),
    })
  }

  return (
    <div className="space-y-4">
      {details.map((detail, index) => (
        <div
          key={index}
          className="flex py-3 border-b border-stone-200 last:border-0"
        >
          <dt className="w-1/3 text-sm font-medium text-muted-foreground">
            {detail.label}
          </dt>
          <dd className="w-2/3 text-sm">{detail.value}</dd>
        </div>
      ))}
    </div>
  )
}

// Shipping Tab
function ShippingTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          Shipping Information
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Free standard shipping on orders over $100</li>
          <li>• Standard shipping (5-7 business days): $10</li>
          <li>• Express shipping (2-3 business days): $20</li>
          <li>• International shipping available</li>
        </ul>
      </div>

      <div>
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Returns & Exchanges
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• 30-day return policy</li>
          <li>• Items must be unworn with tags attached</li>
          <li>• Free return shipping on exchanges</li>
          <li>• Refunds processed within 5-7 business days</li>
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Note:</strong> Final sale items are not eligible for returns or exchanges.
        </p>
      </div>
    </div>
  )
}

// Reviews Tab
function ReviewsTab({ product }: { product: Product }) {
  const [sortBy, setSortBy] = useState<ReviewSortOption>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const { isAuthenticated } = useAuth()

  const {
    reviews,
    totalReviews,
    averageRating,
    ratingDistribution,
    ratingPercentages,
    userReview,
    canReview,
    addReview,
    updateReview,
    deleteReview,
    voteHelpful,
  } = useReviews({
    productId: product.id,
    sortBy,
    filterRating,
  })

  if (totalReviews === 0) {
    return (
      <div className="text-center py-8">
        <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
        <p className="text-muted-foreground mb-6">
          Be the first to review this product
        </p>
        {isAuthenticated ? (
          <ReviewList
            reviews={[]}
            totalReviews={0}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterRating={filterRating}
            onFilterChange={setFilterRating}
            canReview={canReview}
            userReview={userReview}
            onAddReview={addReview}
            onUpdateReview={updateReview}
            onDeleteReview={deleteReview}
            onVoteHelpful={voteHelpful}
          />
        ) : (
          <Link
            to="/login"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign in to Write a Review
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <RatingSummary
        averageRating={averageRating}
        totalReviews={totalReviews}
        ratingDistribution={ratingDistribution}
        ratingPercentages={ratingPercentages}
        onFilterByRating={setFilterRating}
        activeFilter={filterRating}
      />

      {/* Reviews List */}
      <div className="border-t border-stone-200 pt-6">
        {!isAuthenticated && canReview && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-muted-foreground mb-2">
              Want to share your thoughts on this product?
            </p>
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in to write a review
            </Link>
          </div>
        )}

        <ReviewList
          reviews={reviews}
          totalReviews={totalReviews}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterRating={filterRating}
          onFilterChange={setFilterRating}
          canReview={isAuthenticated && canReview}
          userReview={userReview}
          onAddReview={addReview}
          onUpdateReview={updateReview}
          onDeleteReview={deleteReview}
          onVoteHelpful={voteHelpful}
        />
      </div>
    </div>
  )
}
