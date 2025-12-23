import cors from 'cors'
import { env } from './env'

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [env.FRONTEND_URL]

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else if (env.NODE_ENV === 'development') {
      // In development, allow localhost with any port
      if (origin.startsWith('http://localhost:')) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
