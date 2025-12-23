import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { fadeInVariants, fadeInUpVariants } from '@/lib/animations'

export function OrderSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderNumber, total, email } = location.state || {}

  // Redirect if no order data
  if (!orderNumber) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50/50">
      <motion.div
        variants={fadeInUpVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 py-12 text-center"
      >
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-heading font-light mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg p-8 mb-8 text-left">
          <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="font-semibold text-lg">{orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="font-semibold text-lg">{formatPrice(total)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <p className="font-medium mb-1">Confirmation Email Sent</p>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation email to <strong>{email}</strong> with your order details and tracking information.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <p className="font-medium mb-1">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Your order will be delivered within 5-7 business days. You'll receive a tracking number once your order ships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/shop')} size="lg" className="min-w-[200px]">
            Continue Shopping
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            Back to Home
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Need help with your order?{' '}
            <Link to="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
