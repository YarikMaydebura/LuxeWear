import bcrypt from 'bcryptjs'
import { env } from '../config/env'
import { userRepository } from '../repositories/user.repository'
import { tokenService } from './token.service'
import { ApiError } from '../utils/api-error'
import { User } from '../types'
import { RegisterInput, LoginInput } from '../validators/auth.validator'

interface AuthResult {
  user: Omit<User, 'passwordHash'>
  accessToken: string
  refreshToken: string
}

class AuthService {
  private sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash: _, ...sanitized } = user
    return sanitized
  }

  async register(data: RegisterInput): Promise<AuthResult> {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email)
    if (existingUser) {
      throw ApiError.conflict('Email already registered')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, env.BCRYPT_ROUNDS)

    // Create user
    const user = await userRepository.create({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      authProvider: 'local',
    })

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user.id, user.email)
    const refreshToken = tokenService.generateRefreshToken()
    await tokenService.saveRefreshToken(user.id, refreshToken)

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }

  async login(data: LoginInput): Promise<AuthResult> {
    // Find user
    const user = await userRepository.findByEmail(data.email)
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password')
    }

    // Check if user has password (not OAuth-only)
    if (!user.passwordHash) {
      throw ApiError.unauthorized(
        `This account uses ${user.authProvider} authentication. Please sign in with ${user.authProvider}.`
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash)
    if (!isValidPassword) {
      throw ApiError.unauthorized('Invalid email or password')
    }

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user.id, user.email)
    const refreshToken = tokenService.generateRefreshToken()
    await tokenService.saveRefreshToken(user.id, refreshToken)

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await tokenService.revokeRefreshToken(refreshToken)
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Validate refresh token
    const tokenData = await tokenService.validateRefreshToken(refreshToken)
    if (!tokenData) {
      throw ApiError.unauthorized('Invalid or expired refresh token')
    }

    // Get user
    const user = await userRepository.findById(tokenData.userId)
    if (!user) {
      throw ApiError.unauthorized('User not found')
    }

    // Revoke old token and generate new ones
    await tokenService.revokeRefreshToken(refreshToken)

    const newAccessToken = tokenService.generateAccessToken(user.id, user.email)
    const newRefreshToken = tokenService.generateRefreshToken()
    await tokenService.saveRefreshToken(user.id, newRefreshToken)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }

  async getCurrentUser(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await userRepository.findById(userId)
    return user ? this.sanitizeUser(user) : null
  }

  async handleOAuthUser(user: User): Promise<AuthResult> {
    const accessToken = tokenService.generateAccessToken(user.id, user.email)
    const refreshToken = tokenService.generateRefreshToken()
    await tokenService.saveRefreshToken(user.id, refreshToken)

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }
}

export const authService = new AuthService()
