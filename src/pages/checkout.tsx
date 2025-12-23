import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import { useOrderStore } from '@/store/order-store'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { fadeInVariants, fadeInUpVariants } from '@/lib/animations'
import type { Address } from '@/types'

type CheckoutStep = 'information' | 'shipping' | 'payment'

interface FormData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  shippingMethod: 'standard' | 'express' | 'overnight'
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const addOrder = useOrderStore((state) => state.addOrder)
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    shippingMethod: 'standard',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })
  const shippingCost = formData.shippingMethod === 'standard' ? 10 : formData.shippingMethod === 'express' ? 20 : 35
  const tax = subtotal * 0.1
  const total = subtotal + shippingCost + tax

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items, navigate])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = (): boolean => {
    if (currentStep === 'information') {
      return !!(
        formData.email &&
        formData.firstName &&
        formData.lastName &&
        formData.address &&
        formData.city &&
        formData.state &&
        formData.zipCode
      )
    }
    if (currentStep === 'shipping') {
      return !!formData.shippingMethod
    }
    if (currentStep === 'payment') {
      return !!(
        formData.cardNumber &&
        formData.cardName &&
        formData.expiryDate &&
        formData.cvv
      )
    }
    return false
  }

  const handleNext = () => {
    if (!validateStep()) {
      alert('Please fill in all required fields')
      return
    }

    if (currentStep === 'information') {
      setCurrentStep('shipping')
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment')
    }
  }

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping')
    } else if (currentStep === 'shipping') {
      setCurrentStep('information')
    }
  }

  const handlePlaceOrder = () => {
    if (!validateStep()) {
      alert('Please fill in all payment details')
      return
    }

    setIsProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      // Create shipping address from form data
      const shippingAddress: Address = {
        id: Math.random().toString(36).substring(2),
        userId: user?.id || 'guest',
        firstName: formData.firstName,
        lastName: formData.lastName,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        isDefault: false,
      }

      // Create and save the order
      const order = addOrder({
        userId: user?.id || 'guest',
        items: [...items],
        subtotal,
        shipping: shippingCost,
        tax,
        total,
        status: 'processing',
        shippingAddress,
        paymentMethod: 'Credit Card',
      })

      clearCart()
      setIsProcessing(false)
      navigate('/order-success', {
        state: {
          orderNumber: order.id,
          total,
          email: formData.email,
        },
      })
    }, 1500)
  }

  const steps = [
    { id: 'information', label: 'Information', number: 1 },
    { id: 'shipping', label: 'Shipping', number: 2 },
    { id: 'payment', label: 'Payment', number: 3 },
  ]

  return (
    <div className="min-h-screen bg-stone-50/50">
      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : steps.findIndex((s) => s.id === currentStep) > index
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {steps.findIndex((s) => s.id === currentStep) > index ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-sm mt-2 hidden sm:block">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-stone-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-lg p-6 lg:p-8"
            >
              <AnimatePresence mode="wait">
                {currentStep === 'information' && (
                  <InformationStep
                    formData={formData}
                    onChange={handleInputChange}
                    onNext={handleNext}
                  />
                )}
                {currentStep === 'shipping' && (
                  <ShippingStep
                    formData={formData}
                    onChange={handleInputChange}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 'payment' && (
                  <PaymentStep
                    formData={formData}
                    onChange={handleInputChange}
                    onPlaceOrder={handlePlaceOrder}
                    onBack={handleBack}
                    isProcessing={isProcessing}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-lg p-6 sticky top-24"
            >
              <h2 className="text-xl font-heading font-light mb-6">Order Summary</h2>

              {/* Products */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="w-16 h-16 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-muted-foreground">Size: {item.selectedSize}</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">{formatPrice(total)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step Components
interface StepProps {
  formData: FormData
  onChange: (field: keyof FormData, value: string) => void
  onNext?: () => void
  onBack?: () => void
  onPlaceOrder?: () => void
  isProcessing?: boolean
}

function InformationStep({ formData, onChange, onNext }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-heading font-light mb-6">Contact & Shipping Information</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="123 Main St"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => onChange('state', e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">ZIP Code</label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => onChange('zipCode', e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <select
            value={formData.country}
            onChange={(e) => onChange('country', e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
          </select>
        </div>
      </div>

      <Button onClick={onNext} size="lg" className="w-full">
        Continue to Shipping
      </Button>
    </motion.div>
  )
}

function ShippingStep({ formData, onChange, onNext, onBack }: StepProps) {
  const shippingOptions = [
    { id: 'standard', label: 'Standard Shipping', time: '5-7 business days', price: 10 },
    { id: 'express', label: 'Express Shipping', time: '2-3 business days', price: 20 },
    { id: 'overnight', label: 'Overnight Shipping', time: 'Next business day', price: 35 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-heading font-light mb-6">Select Shipping Method</h2>

      <div className="space-y-3">
        {shippingOptions.map((option) => (
          <label
            key={option.id}
            className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.shippingMethod === option.id
                ? 'border-primary bg-primary/5'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  value={option.id}
                  checked={formData.shippingMethod === option.id}
                  onChange={(e) => onChange('shippingMethod', e.target.value as any)}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm text-muted-foreground">{option.time}</p>
                </div>
              </div>
              <p className="font-semibold">${option.price.toFixed(2)}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </motion.div>
  )
}

function PaymentStep({ formData, onChange, onPlaceOrder, onBack, isProcessing }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-emerald-600" />
        <h2 className="text-2xl font-heading font-light">Secure Payment</h2>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Card Number</label>
        <input
          type="text"
          value={formData.cardNumber}
          onChange={(e) => onChange('cardNumber', e.target.value)}
          className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Cardholder Name</label>
        <input
          type="text"
          value={formData.cardName}
          onChange={(e) => onChange('cardName', e.target.value)}
          className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="John Doe"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Expiry Date</label>
          <input
            type="text"
            value={formData.expiryDate}
            onChange={(e) => onChange('expiryDate', e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="MM/YY"
            maxLength={5}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">CVV</label>
          <input
            type="text"
            value={formData.cvv}
            onChange={(e) => onChange('cvv', e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="123"
            maxLength={4}
          />
        </div>
      </div>

      <div className="bg-stone-50 p-4 rounded-lg text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Your payment information is encrypted and secure
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1" disabled={isProcessing}>
          Back
        </Button>
        <Button onClick={onPlaceOrder} size="lg" className="flex-1" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </motion.div>
  )
}
