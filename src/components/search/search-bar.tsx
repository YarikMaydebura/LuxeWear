import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp, ArrowRight, Tag } from 'lucide-react'
import { useSearch } from '@/hooks/use-search'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface SearchBarProps {
  className?: string
  onClose?: () => void
  isFullScreen?: boolean
}

export function SearchBar({ className, onClose, isFullScreen = false }: SearchBarProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isFocused, setIsFocused] = useState(false)
  const {
    query,
    setQuery,
    isSearching,
    suggestions,
    recentSearches,
    saveToRecent,
    clearRecentSearches,
    removeRecentSearch,
  } = useSearch({ limit: 6 })

  const showDropdown = isFocused && (query.length > 0 || recentSearches.length > 0)

  // Focus input on mount if fullscreen
  useEffect(() => {
    if (isFullScreen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFullScreen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveToRecent(query.trim())
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsFocused(false)
      onClose?.()
    }
  }

  const handleSuggestionClick = (suggestion: { type: 'product' | 'category'; item?: Product; name?: string }) => {
    if (suggestion.type === 'product' && suggestion.item) {
      navigate(`/product/${suggestion.item.id}`)
    } else if (suggestion.type === 'category' && suggestion.name) {
      const categorySlug = suggestion.name.toLowerCase().replace(/['\s]/g, '-')
      navigate(`/shop/${categorySlug}`)
    }
    setQuery('')
    setIsFocused(false)
    onClose?.()
  }

  const handleRecentClick = (searchTerm: string) => {
    setQuery(searchTerm)
    saveToRecent(searchTerm)
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
    setIsFocused(false)
    onClose?.()
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 text-yellow-900">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Search Input */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search products..."
            className={cn(
              'w-full pl-12 pr-12 py-3 border border-stone-300 rounded-lg',
              'focus:ring-2 focus:ring-primary focus:border-transparent',
              'transition-all bg-white',
              isFullScreen && 'text-lg py-4'
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-lg shadow-lg z-50 overflow-hidden',
              isFullScreen && 'max-h-[60vh] overflow-y-auto'
            )}
          >
            {/* Loading State */}
            {isSearching && query && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            {/* Suggestions */}
            {query && suggestions.length > 0 && !isSearching && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-stone-50 transition-colors text-left"
                  >
                    {suggestion.type === 'category' ? (
                      <>
                        <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">
                          Shop <span className="font-medium">{suggestion.name}</span>
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      </>
                    ) : suggestion.item ? (
                      <>
                        <div className="w-10 h-10 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={suggestion.item.images[0]}
                            alt=""
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {highlightMatch(suggestion.item.title, query)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${suggestion.item.price.toFixed(2)}
                          </p>
                        </div>
                      </>
                    ) : null}
                  </button>
                ))}

                {/* View All Results */}
                <button
                  onClick={handleSubmit}
                  className="w-full px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors border-t border-stone-100"
                >
                  View all results for "{query}"
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* No Results */}
            {query && suggestions.length === 0 && !isSearching && (
              <div className="px-4 py-6 text-center">
                <p className="text-muted-foreground">No results for "{query}"</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try different keywords
                </p>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Recent Searches
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches.map((searchTerm, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 flex items-center gap-3 hover:bg-stone-50 transition-colors group"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <button
                      onClick={() => handleRecentClick(searchTerm)}
                      className="flex-1 text-sm text-left truncate"
                    >
                      {searchTerm}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(searchTerm)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Trending (when no query and no recent) */}
            {!query && recentSearches.length === 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Popular Searches
                </div>
                {['Electronics', 'Jewelry', 'Clothing', 'Watches'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleRecentClick(term)}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-stone-50 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
