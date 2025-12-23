import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, Menu, User, LogOut, Package, Settings, ChevronDown, X } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useAuth } from '@/hooks/use-auth'
import { SearchBar } from '@/components/search/search-bar'
import { cn } from '@/lib/utils'

interface NavbarProps {
  onMenuClick: () => void
  onCartClick: () => void
}

export function Navbar({ onMenuClick, onCartClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const cartItemCount = useCartStore((state) => state.getItemCount())
  const wishlistItemCount = useWishlistStore((state) => state.getItemCount())
  const { user, isAuthenticated, logout, initials } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0"
          >
            <h1 className="text-2xl lg:text-3xl font-heading font-light tracking-wide">
              Luxe Wear
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/shop/womens-clothing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Women
            </Link>
            <Link
              to="/shop/mens-clothing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Men
            </Link>
            <Link
              to="/shop/jewelery"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Accessories
            </Link>
            <Link
              to="/shop/sale"
              className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
            >
              Sale
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
                  aria-label="Account menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {initials}
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 hidden lg:block transition-transform",
                    userMenuOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      Orders
                    </Link>
                    <Link
                      to="/account/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="border-t border-border mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors w-full text-left text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              >
                <User className="w-5 h-5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 pt-20">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="max-w-2xl mx-auto">
                <SearchBar
                  isFullScreen
                  onClose={() => setSearchOpen(false)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
