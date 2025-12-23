import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { fadeInVariants, fadeInUpVariants } from '@/lib/animations'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['123 Fashion Avenue', 'New York, NY 10001', 'United States'],
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['hello@luxewear.com', 'support@luxewear.com'],
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Mon - Fri: 9AM - 6PM', 'Sat: 10AM - 4PM', 'Sun: Closed'],
  },
]

export function ContactPage() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast({ type: 'error', title: 'Validation Error', message: 'Please fix the errors in the form' })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    showToast({ type: 'success', title: 'Message Sent!', message: 'We\'ll get back to you within 24 hours' })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="bg-stone-50 py-16 lg:py-24"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-heading font-light mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Have a question or feedback? We'd love to hear from you. Send us a message
            and we'll respond as soon as possible.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-lg p-8 shadow-sm border">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-heading font-light mb-4">Thank You!</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Your message has been received. Our team will review it and get back
                      to you within 24-48 hours.
                    </p>
                    <Button
                      onClick={() => {
                        setIsSubmitted(false)
                        setFormData({ name: '', email: '', subject: '', message: '' })
                      }}
                      variant="outline"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-heading font-light mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Your Name <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                              errors.name ? 'border-destructive' : 'border-stone-300'
                            }`}
                            placeholder="John Doe"
                          />
                          {errors.name && (
                            <p className="text-destructive text-sm mt-1">{errors.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email Address <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                              errors.email ? 'border-destructive' : 'border-stone-300'
                            }`}
                            placeholder="you@example.com"
                          />
                          {errors.email && (
                            <p className="text-destructive text-sm mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Subject <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleChange('subject', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                            errors.subject ? 'border-destructive' : 'border-stone-300'
                          }`}
                          placeholder="How can we help you?"
                        />
                        {errors.subject && (
                          <p className="text-destructive text-sm mt-1">{errors.subject}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Message <span className="text-destructive">*</span>
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          rows={6}
                          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none ${
                            errors.message ? 'border-destructive' : 'border-stone-300'
                          }`}
                          placeholder="Tell us more about your inquiry..."
                        />
                        {errors.message && (
                          <p className="text-destructive text-sm mt-1">{errors.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full sm:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-muted-foreground text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 aspect-square bg-stone-100 rounded-lg overflow-hidden"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304603!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1640000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Luxe Wear Location"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-light mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find quick answers to common questions about our products and services.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'What is your return policy?',
                answer: 'We offer a 30-day return policy for all unworn items with original tags attached. Simply initiate a return through your account or contact our support team.',
              },
              {
                question: 'How long does shipping take?',
                answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight options are also available at checkout.',
              },
              {
                question: 'Do you ship internationally?',
                answer: 'Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days depending on the destination.',
              },
              {
                question: 'How can I track my order?',
                answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order through your account dashboard.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
