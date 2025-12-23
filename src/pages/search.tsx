import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useProducts } from '@/hooks/use-products'
import { useSearch } from '@/hooks/use-search'
import { ProductCard } from '@/components/products/product-card'
import { SearchBar } from '@/components/search/search-bar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
]

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''

  const { data: allProducts, isLoading } = useProducts()
  const { saveToRecent } = useSearch()

  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Save query to recent searches on mount
  useEffect(() => {
    if (queryParam) {
      saveToRecent(queryParam)
    }
  }, [queryParam, saveToRecent])

  // Get unique categories
  const categories = useMemo(() => {
    if (!allProducts) return []
    const categorySet = new Set<string>()
    allProducts.forEach((product) => {
      const name = typeof product.category === 'string'
        ? product.category
        : product.category.name
      categorySet.add(name)
    })
    return Array.from(categorySet)
  }, [allProducts])

  // Search and filter products
  const filteredProducts = useMemo(() => {
    if (!allProducts || !queryParam) return []

    const searchTerms = queryParam.toLowerCase().split(' ').filter(Boolean)

    let results = allProducts
      .map((product) => {
        const titleLower = product.title.toLowerCase()
        const descLower = product.description.toLowerCase()
        const categoryName = typeof product.category === 'string'
          ? product.category
          : product.category.name
        const categoryLower = categoryName.toLowerCase()

        // Calculate relevance score
        let score = 0
        for (const term of searchTerms) {
          if (titleLower === term) score += 100
          else if (titleLower.startsWith(term)) score += 50
          else if (titleLower.includes(term)) score += 30
          if (categoryLower.includes(term)) score += 20
          if (descLower.includes(term)) score += 10
        }

        return { product, score, categoryName }
      })
      .filter((item) => item.score > 0)

    // Filter by category
    if (selectedCategories.length > 0) {
      results = results.filter((item) =>
        selectedCategories.includes(item.categoryName)
      )
    }

    // Filter by price
    results = results.filter(
      (item) =>
        item.product.price >= priceRange[0] && item.product.price <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.product.price - b.product.price)
        break
      case 'price-desc':
        results.sort((a, b) => b.product.price - a.product.price)
        break
      case 'newest':
        results.sort(
          (a, b) =>
            new Date(b.product.createdAt || 0).getTime() -
            new Date(a.product.createdAt || 0).getTime()
        )
        break
      default:
        results.sort((a, b) => b.score - a.score)
    }

    return results.map((item) => item.product)
  }, [allProducts, queryParam, sortBy, priceRange, selectedCategories])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setSortBy('relevance')
  }

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)

  return (
    <div className="min-h-screen bg-stone-50/50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <SearchBar isFullScreen />
        </motion.div>

        {/* Results Header */}
        {queryParam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-2xl lg:text-3xl font-light tracking-wide mb-2">
              Search results for "{queryParam}"
            </h1>
            <p className="text-muted-foreground">
              {isLoading
                ? 'Searching...'
                : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
            </p>
          </motion.div>
        )}

        {/* No Query State */}
        {!queryParam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Start searching</h2>
            <p className="text-muted-foreground">
              Enter a keyword to find products
            </p>
          </motion.div>
        )}

        {queryParam && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'lg:w-64 flex-shrink-0',
                !showFilters && 'hidden lg:block'
              )}
            >
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-medium">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 rounded border-stone-300"
                        />
                        <span className="text-sm capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Price Range</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
                    />
                  </div>
                </div>

                {/* Sort (Mobile) */}
                <div className="lg:hidden mb-6">
                  <h3 className="text-sm font-medium mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => setShowFilters(false)}
                  className="w-full lg:hidden"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.aside>

            {/* Results Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-md"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort (Desktop) */}
                <div className="hidden lg:flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-stone-300 rounded-md text-sm bg-white"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className="flex items-center gap-1 px-3 py-1 bg-stone-100 rounded-full text-sm"
                    >
                      {category}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <button
                      onClick={() => setPriceRange([0, 1000])}
                      className="flex items-center gap-1 px-3 py-1 bg-stone-100 rounded-full text-sm"
                    >
                      ${priceRange[0]} - ${priceRange[1]}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Products Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-stone-200 rounded-lg mb-4" />
                      <div className="h-4 bg-stone-200 rounded mb-2" />
                      <div className="h-4 bg-stone-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">No results found</h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                    <Link to="/shop">
                      <Button>Browse All Products</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
