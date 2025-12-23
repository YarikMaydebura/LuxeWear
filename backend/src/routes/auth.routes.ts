import { Router } from 'express'
import passport from 'passport'
import * as authController from '../controllers/auth.controller'
import { validate } from '../middleware/validate.middleware'
import { authenticate } from '../middleware/auth.middleware'
import { registerSchema, loginSchema } from '../validators/auth.validator'

const router = Router()

// Local authentication
router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.post('/logout', authController.logout)
router.post('/refresh', authController.refresh)
router.get('/me', authenticate, authController.me)

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
)

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }))
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  authController.githubCallback
)

export default router
