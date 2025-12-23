import { useState, useEffect, useCallback, useMemo } from 'react'
import { useProducts } from './use-products'
import type { Product } from '@/types'

const RECENT_SEARCHES_KEY = 'luxe-recent-searches'
const MAX_RECENT_SEARCHES = 5
const DEBOUNCE_MS = 300

interface UseSearchOptions {
  limit?: number
}

export function useSearch(options: UseSearchOptions = {}) {
  const { limit = 5 } = options
  const { data: allProducts } = useProducts()

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (stored) {
        setRecentSearches(JSON.parse(stored))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Debounce search query
  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      setIsSearching(false)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [query])

  // Search products
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim() || !allProducts) return []

    const searchTerms = debouncedQuery.toLowerCase().split(' ').filter(Boolean)

    const results = allProducts
      .map((product) => {
        const titleLower = product.title.toLowerCase()
        const descLower = product.description.toLowerCase()
        const categoryLower = typeof product.category === 'string'
          ? product.category.toLowerCase()
          : product.category.name.toLowerCase()

        // Calculate relevance score
        let score = 0

        for (const term of searchTerms) {
          // Exact title match (highest priority)
          if (titleLower === term) score += 100
          // Title starts with term
          else if (titleLower.startsWith(term)) score += 50
          // Title contains term
          else if (titleLower.includes(term)) score += 30
          // Category match
          if (categoryLower.includes(term)) score += 20
          // Description match
          if (descLower.includes(term)) score += 10
        }

        return { product, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product)

    return results.slice(0, limit)
  }, [debouncedQuery, allProducts, limit])

  // Get suggestions (products + categories)
  const suggestions = useMemo(() => {
    if (!debouncedQuery.trim() || !allProducts) return []

    const query = debouncedQuery.toLowerCase()
    const productSuggestions: { type: 'product'; item: Product }[] = []
    const categorySuggestions: { type: 'category'; name: string }[] = []
    const seenCategories = new Set<string>()

    for (const product of allProducts) {
      const titleLower = product.title.toLowerCase()
      const categoryName = typeof product.category === 'string'
        ? product.category
        : product.category.name

      // Add product if title matches
      if (titleLower.includes(query) && productSuggestions.length < 4) {
        productSuggestions.push({ type: 'product', item: product })
      }

      // Add category if it matches and not already added
      if (
        categoryName.toLowerCase().includes(query) &&
        !seenCategories.has(categoryName) &&
        categorySuggestions.length < 2
      ) {
        seenCategories.add(categoryName)
        categorySuggestions.push({ type: 'category', name: categoryName })
      }
    }

    return [...categorySuggestions, ...productSuggestions]
  }, [debouncedQuery, allProducts])

  // Save search to recent
  const saveToRecent = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== searchTerm.toLowerCase())
      const updated = [searchTerm, ...filtered].slice(0, MAX_RECENT_SEARCHES)

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      } catch {
        // Ignore localStorage errors
      }

      return updated
    })
  }, [])

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Remove single recent search
  const removeRecentSearch = useCallback((searchTerm: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== searchTerm)
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      } catch {
        // Ignore localStorage errors
      }
      return updated
    })
  }, [])

  return {
    // State
    query,
    setQuery,
    debouncedQuery,
    isSearching,

    // Results
    searchResults,
    suggestions,
    hasResults: searchResults.length > 0,

    // Recent searches
    recentSearches,
    saveToRecent,
    clearRecentSearches,
    removeRecentSearch,
  }
}
