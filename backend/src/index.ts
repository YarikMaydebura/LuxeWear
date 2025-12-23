import { createApp } from './app'
import { env } from './config/env'
import { testConnection } from './config/database'
import { logger } from './utils/logger'
import './config/passport'

async function bootstrap() {
  try {
    // Test database connection
    const dbConnected = await testConnection()
    if (!dbConnected) {
      logger.warn('Database connection failed - server will start but some features may not work')
    }

    // Create and start Express app
    const app = createApp()

    app.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT}`)
      logger.info(`Environment: ${env.NODE_ENV}`)
      logger.info(`Frontend URL: ${env.FRONTEND_URL}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...')
  process.exit(0)
})

bootstrap()
