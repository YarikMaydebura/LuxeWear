import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import passport from 'passport'

import { corsOptions } from './config/cors'
import { env } from './config/env'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'

// Import routes
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import categoryRoutes from './routes/category.routes'
import orderRoutes from './routes/order.routes'
import reviewRoutes from './routes/review.routes'
import cartRoutes from './routes/cart.routes'
import wishlistRoutes from './routes/wishlist.routes'
import addressRoutes from './routes/address.routes'

export function createApp(): Application {
  const app = express()

  // Security middleware
  app.use(helmet())
  app.use(cors(corsOptions))

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later.' },
    skip: () => env.NODE_ENV === 'development',
  })
  app.use('/api', limiter)

  // Body parsing
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(cookieParser())
  app.use(compression())

  // Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'))
  }

  // Passport initialization
  app.use(passport.initialize())

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // API routes
  app.use('/api/auth', authRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/categories', categoryRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/reviews', reviewRoutes)
  app.use('/api/cart', cartRoutes)
  app.use('/api/wishlist', wishlistRoutes)
  app.use('/api/addresses', addressRoutes)

  // Error handling
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
