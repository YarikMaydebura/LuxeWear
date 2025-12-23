import { useState, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useProducts } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductSort } from '@/components/products/product-sort'
import { ProductFilters } from '@/components/products/product-filters'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { filterByPriceRange, searchProducts, sortProducts } from '@/lib/enrichment'
import { fadeInVariants } from '@/lib/animations'
import type { SortOption } from '@/types'

interface FilterState {
  categories: number[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
}

export function ShopPage() {
  const { category } = useParams<{ category: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  // Fetch data
  const { data: allProducts, isLoading } = useProducts()
  const { data: categories } = useCategories()

  // UI State
  const [viewMode, setViewMode] = useState<2 | 3 | 4>(4)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('featured')

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 1000],
  })

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!allProducts) return []

    let products = [...allProducts]

    // Filter by URL category parameter (match by slug)
    if (category && categories) {
      const categoryData = categories.find((c) => c.slug === category)
      if (categoryData) {
        products = products.filter(
          (p) => p.category.name.toLowerCase() === categoryData.name.toLowerCase()
        )
      }
    }

    // Filter by selected categories
    if (filters.categories.length > 0) {
      products = products.filter((p) =>
        filters.categories.includes(p.category.id || 0)
      )
    }

    // Filter by search query
    if (searchQuery) {
      products = searchProducts(products, searchQuery)
    }

    // Filter by price range
    products = filterByPriceRange(
      products,
      filters.priceRange[0],
      filters.priceRange[1]
    )

    // Filter by sizes (client-side, based on enriched data)
    if (filters.sizes.length > 0) {
      products = products.filter((p) =>
        p.sizes?.some((size) => filters.sizes.includes(size.name) && size.inStock)
      )
    }

    // Filter by colors (client-side, based on enriched data)
    if (filters.colors.length > 0) {
      products = products.filter((p) =>
        p.colors?.some((color) =>
          filters.colors.includes(color.name) && color.inStock
        )
      )
    }

    // Sort products
    products = sortProducts(products, sortBy)

    return products
  }, [allProducts, category, categories, filters, searchQuery, sortBy])

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 1000],
    })
    setSortBy('featured')
  }

  const activeFiltersCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000 ? 1 : 0)

  // Get page title
  const pageTitle = category
    ? categories?.find((c) => c.slug === category)?.name || 'Shop'
    : searchQuery
    ? `Search: "${searchQuery}"`
    : 'All Products'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="border-b bg-stone-50/50"
      >
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl lg:text-5xl font-heading font-light mb-2">
            {pageTitle}
          </h1>
          <p className="text-muted-foreground">
            {category
              ? `Explore our collection of ${pageTitle.toLowerCase()}`
              : searchQuery
              ? `Showing results for "${searchQuery}"`
              : 'Discover our complete product collection'}
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all ({activeFiltersCount})
                  </button>
                )}
              </div>
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <ProductSort
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              resultsCount={filteredProducts.length}
              showViewToggle
              showMobileFilter
              onMobileFilterClick={() => setMobileFiltersOpen(true)}
              className="mb-6"
            />

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.categories.map((catId) => {
                  const cat = categories?.find((c) => c.id === catId)
                  if (!cat) return null
                  return (
                    <FilterTag
                      key={`cat-${catId}`}
                      label={cat.name}
                      onRemove={() =>
                        setFilters({
                          ...filters,
                          categories: filters.categories.filter((id) => id !== catId),
                        })
                      }
                    />
                  )
                })}
                {filters.sizes.map((size) => (
                  <FilterTag
                    key={`size-${size}`}
                    label={`Size: ${size}`}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        sizes: filters.sizes.filter((s) => s !== size),
                      })
                    }
                  />
                ))}
                {filters.colors.map((color) => (
                  <FilterTag
                    key={`color-${color}`}
                    label={`Color: ${color}`}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        colors: filters.colors.filter((c) => c !== color),
                      })
                    }
                  />
                ))}
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              columns={viewMode}
              showQuickAdd
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Filter Tag Component
interface FilterTagProps {
  label: string
  onRemove: () => void
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onClick={onRemove}
      className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-sm transition-colors"
    >
      <span>{label}</span>
      <X className="w-3 h-3" />
    </motion.button>
  )
}
