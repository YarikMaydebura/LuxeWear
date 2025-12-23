import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { env } from '../config/env'
import { query, queryOne } from '../config/database'
import { JwtPayload, RefreshToken } from '../types'

class TokenService {
  generateAccessToken(userId: string, email: string): string {
    const payload: JwtPayload = { userId, email }
    // Convert expiry string like '15m' to seconds
    const expiresIn = this.parseExpiry(env.JWT_ACCESS_EXPIRY)
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn })
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/)
    if (!match) return 900 // Default 15 minutes
    const value = parseInt(match[1])
    const unit = match[2]
    switch (unit) {
      case 's': return value
      case 'm': return value * 60
      case 'h': return value * 60 * 60
      case 'd': return value * 60 * 60 * 24
      default: return 900
    }
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex')
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    const tokenHash = this.hashToken(token)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    await query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    )
  }

  async validateRefreshToken(token: string): Promise<RefreshToken | null> {
    const tokenHash = this.hashToken(token)

    const row = await queryOne<Record<string, unknown>>(
      `SELECT * FROM refresh_tokens
       WHERE token_hash = $1
       AND expires_at > NOW()
       AND revoked_at IS NULL`,
      [tokenHash]
    )

    if (!row) return null

    return {
      id: row.id as string,
      userId: row.user_id as string,
      tokenHash: row.token_hash as string,
      expiresAt: row.expires_at as Date,
      revokedAt: row.revoked_at as Date | undefined,
    }
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const tokenHash = this.hashToken(token)
    await query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1',
      [tokenHash]
    )
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
      [userId]
    )
  }

  async cleanupExpiredTokens(): Promise<void> {
    await query('DELETE FROM refresh_tokens WHERE expires_at < NOW()')
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload
    } catch {
      return null
    }
  }
}

export const tokenService = new TokenService()
