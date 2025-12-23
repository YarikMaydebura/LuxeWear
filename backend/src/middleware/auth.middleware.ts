import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { ApiError } from '../utils/api-error'
import { User, AuthenticatedRequest } from '../types'

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: User | false) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return next(ApiError.unauthorized('Authentication required'))
    }
    (req as AuthenticatedRequest).user = user
    next()
  })(req, res, next)
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: User | false) => {
    if (err) {
      return next(err)
    }
    if (user) {
      (req as AuthenticatedRequest).user = user
    }
    next()
  })(req, res, next)
}
