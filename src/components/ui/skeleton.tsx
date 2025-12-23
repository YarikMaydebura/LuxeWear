import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-stone-200',
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Image skeleton */}
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      {/* Price skeleton */}
      <Skeleton className="h-5 w-1/4" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-md" />
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-12 h-12 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <Skeleton className="w-24 h-24 rounded-md flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  )
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-4 left-4 right-4">
        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[80vh] min-h-[600px]">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
        <Skeleton className="h-12 w-3/4 max-w-xl" />
        <Skeleton className="h-6 w-1/2 max-w-md" />
        <Skeleton className="h-12 w-40 mt-4" />
      </div>
    </div>
  )
}
