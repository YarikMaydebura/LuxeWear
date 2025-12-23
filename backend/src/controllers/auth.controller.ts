import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { sendSuccess, sendCreated } from '../utils/api-response'
import { ApiError } from '../utils/api-error'
import { AuthenticatedRequest, User } from '../types'
import { env } from '../config/env'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body)

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)

    sendCreated(res, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'Registration successful')
  } catch (error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body)

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)

    sendSuccess(res, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'Login successful')
  } catch (error) {
    next(error)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (refreshToken) {
      await authService.logout(refreshToken)
    }

    // Clear cookie
    res.clearCookie('refreshToken')

    sendSuccess(res, null, 'Logout successful')
  } catch (error) {
    next(error)
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token not provided')
    }

    const result = await authService.refresh(refreshToken)

    // Set new refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)

    sendSuccess(res, {
      accessToken: result.accessToken,
    }, 'Token refreshed')
  } catch (error) {
    next(error)
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) {
      throw ApiError.unauthorized('Not authenticated')
    }

    const currentUser = await authService.getCurrentUser(user.id)
    if (!currentUser) {
      throw ApiError.notFound('User not found')
    }

    sendSuccess(res, currentUser)
  } catch (error) {
    next(error)
  }
}

export function googleCallback(req: Request, res: Response, next: NextFunction) {
  handleOAuthCallback(req, res, next)
}

export function githubCallback(req: Request, res: Response, next: NextFunction) {
  handleOAuthCallback(req, res, next)
}

async function handleOAuthCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as User | undefined
    if (!user) {
      throw ApiError.unauthorized('OAuth authentication failed')
    }

    const result = await authService.handleOAuthUser(user)

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)

    // Redirect to frontend with access token
    const redirectUrl = `${env.FRONTEND_URL}/auth/callback?accessToken=${result.accessToken}`
    res.redirect(redirectUrl)
  } catch (error) {
    next(error)
  }
}
