import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/api-error'
import { logger } from '../utils/logger'
import { env } from '../config/env'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    })
    return
  }

  // Log unexpected errors
  logger.error('Unexpected error:', err)

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  })
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  })
}
