import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { ApiError } from '../utils/api-error'

type RequestLocation = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, location: RequestLocation = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = req[location]
      const validated = schema.parse(data)
      req[location] = validated
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {}
        error.errors.forEach((err) => {
          const path = err.path.join('.')
          if (!errors[path]) {
            errors[path] = []
          }
          errors[path].push(err.message)
        })
        next(ApiError.badRequest('Validation failed', errors))
      } else {
        next(error)
      }
    }
  }
}
