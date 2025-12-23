import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from './components/layout/navbar'
import { Footer } from './components/layout/footer'
import { MobileMenu } from './components/layout/mobile-menu'
import { CartDrawer } from './components/layout/cart-drawer'
import { ToastProvider } from './components/ui/toast'
import { FlyToCartProvider } from './components/ui/fly-to-cart'
import { ScrollProgress } from './components/ui/scroll-progress'
import { HomePage } from './pages/home'
import { ShopPage } from './pages/shop'
import { ProductDetailPage } from './pages/product-detail'
import { CartPage } from './pages/cart'
import { WishlistPage } from './pages/wishlist'
import { CheckoutPage } from './pages/checkout'
import { OrderSuccessPage } from './pages/order-success'
import { AboutPage } from './pages/about'
import { ContactPage } from './pages/contact'
import { NotFoundPage } from './pages/not-found'
import { LoginPage } from './pages/login'
import { RegisterPage } from './pages/register'
import { AccountPage } from './pages/account'
import { OrdersPage } from './pages/account/orders'
import { AddressesPage } from './pages/account/addresses'
import { SettingsPage } from './pages/account/settings'
import { ProtectedRoute } from './components/auth/protected-route'
import { SearchPage } from './pages/search'
import { AuthCallbackPage } from './pages/auth-callback'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/shop" element={<PageWrapper><ShopPage /></PageWrapper>} />
        <Route path="/shop/:category" element={<PageWrapper><ShopPage /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><CartPage /></PageWrapper>} />
        <Route path="/wishlist" element={<PageWrapper><WishlistPage /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><CheckoutPage /></PageWrapper>} />
        <Route path="/order-success" element={<PageWrapper><OrderSuccessPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
        <Route path="/auth/callback" element={<PageWrapper><AuthCallbackPage /></PageWrapper>} />
        <Route path="/search" element={<PageWrapper><SearchPage /></PageWrapper>} />
        <Route path="/account" element={<PageWrapper><ProtectedRoute><AccountPage /></ProtectedRoute></PageWrapper>} />
        <Route path="/account/orders" element={<PageWrapper><ProtectedRoute><OrdersPage /></ProtectedRoute></PageWrapper>} />
        <Route path="/account/addresses" element={<PageWrapper><ProtectedRoute><AddressesPage /></ProtectedRoute></PageWrapper>} />
        <Route path="/account/settings" element={<PageWrapper><ProtectedRoute><SettingsPage /></ProtectedRoute></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <ToastProvider>
      <FlyToCartProvider>
        <BrowserRouter>
          <ScrollProgress />
          <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <Navbar
              onMenuClick={() => setIsMobileMenuOpen(true)}
              onCartClick={() => setIsCartOpen(true)}
            />

            {/* Mobile Menu */}
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Cart Drawer */}
            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />

            {/* Main Content */}
            <main className="flex-1 pt-16 lg:pt-20">
              <AnimatedRoutes />
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </FlyToCartProvider>
    </ToastProvider>
  )
}

export default App
