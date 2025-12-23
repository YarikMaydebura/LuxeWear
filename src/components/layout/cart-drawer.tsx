import { Link } from 'react-router-dom'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()
  const total = getTotal()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-heading font-light">
                Shopping Bag ({items.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2">Your bag is empty</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Add items to get started
                  </p>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 pb-4 border-b border-border last:border-0"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && ' • '}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                        <p className="font-medium text-sm">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity - 1)
                            }
                            className="p-1 hover:bg-muted rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity + 1)
                            }
                            className="p-1 hover:bg-muted rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="ml-auto p-1 hover:bg-destructive/10 text-destructive rounded transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-heading">{formatPrice(total)}</span>
                </div>

                {/* Shipping Note */}
                <p className="text-xs text-muted-foreground text-center">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Actions */}
                <div className="space-y-2">
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="block w-full py-3 bg-primary text-primary-foreground text-center rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="block w-full py-3 border border-border text-center rounded-md hover:bg-muted transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
