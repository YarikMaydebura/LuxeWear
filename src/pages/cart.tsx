import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { fadeInVariants, fadeInUpVariants, staggerContainerVariants } from '@/lib/animations'

export function CartPage() {
  const navigate = useNavigate()
  const { items, removeFromCart, updateQuantity, getTotal, getItemCount } = useCart()

  const subtotal = getTotal()
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-stone-400" />
          </div>
          <h1 className="text-3xl font-heading font-light mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button onClick={() => navigate('/shop')} size="lg">
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    )
  }

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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-4xl lg:text-5xl font-heading font-light mb-2">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {items.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  variants={fadeInUpVariants}
                  className="flex gap-6 p-6 bg-white border rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.id}`}
                    className="flex-shrink-0 w-32 h-32 bg-white rounded-md overflow-hidden border"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      <h3 className="font-medium mb-1 line-clamp-2">{item.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.category.name}
                    </p>

                    {/* Variants */}
                    <div className="flex flex-wrap gap-3 text-sm mb-4">
                      {item.selectedSize && (
                        <span className="px-3 py-1 bg-stone-100 rounded-full">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="px-3 py-1 bg-stone-100 rounded-full">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>

                    {/* Mobile Price & Quantity */}
                    <div className="lg:hidden space-y-3">
                      <p className="font-semibold text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-stone-300 rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))
                            }
                            className="px-3 py-2 hover:bg-stone-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-stone-300 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, Math.min(10, item.quantity + 1))
                            }
                            className="px-3 py-2 hover:bg-stone-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Quantity & Price */}
                  <div className="hidden lg:flex flex-col items-end justify-between">
                    <p className="font-semibold text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-stone-300 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))
                          }
                          className="px-3 py-2 hover:bg-stone-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-stone-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, Math.min(10, item.quantity + 1))
                          }
                          className="px-3 py-2 hover:bg-stone-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="sticky top-24"
            >
              <div className="bg-stone-50 rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-heading font-light mb-4">Order Summary</h2>

                <div className="space-y-3 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold">{formatPrice(total)}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add {formatPrice(100 - subtotal)} more for free shipping
                  </p>
                )}

                <Button
                  onClick={() => navigate('/checkout')}
                  size="lg"
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>

                <Link
                  to="/shop"
                  className="block text-center text-sm text-primary hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Benefits */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Customer support available 24/7</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
