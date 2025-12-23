import { query, queryOne } from '../config/database'
import { User } from '../types'

interface CreateUserData {
  email: string
  passwordHash?: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  authProvider: 'local' | 'google' | 'github'
  providerId?: string
  emailVerified?: boolean
}

interface UpdateUserData {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
}

class UserRepository {
  private mapRow(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      email: row.email as string,
      passwordHash: row.password_hash as string | undefined,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      phone: row.phone as string | undefined,
      avatar: row.avatar as string | undefined,
      emailVerified: row.email_verified as boolean,
      authProvider: row.auth_provider as 'local' | 'google' | 'github',
      providerId: row.provider_id as string | undefined,
      createdAt: row.created_at as Date,
      updatedAt: row.updated_at as Date,
    }
  }

  async findById(id: string): Promise<User | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return row ? this.mapRow(row) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    )
    return row ? this.mapRow(row) : null
  }

  async findByProviderId(provider: string, providerId: string): Promise<User | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM users WHERE auth_provider = $1 AND provider_id = $2',
      [provider, providerId]
    )
    return row ? this.mapRow(row) : null
  }

  async create(data: CreateUserData): Promise<User> {
    const rows = await query<Record<string, unknown>>(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, avatar, auth_provider, provider_id, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        data.email.toLowerCase(),
        data.passwordHash || null,
        data.firstName,
        data.lastName,
        data.phone || null,
        data.avatar || null,
        data.authProvider,
        data.providerId || null,
        data.emailVerified || false,
      ]
    )
    return this.mapRow(rows[0])
  }

  async update(id: string, data: UpdateUserData): Promise<User | null> {
    const fields: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    if (data.firstName !== undefined) {
      fields.push(`first_name = $${paramIndex++}`)
      values.push(data.firstName)
    }
    if (data.lastName !== undefined) {
      fields.push(`last_name = $${paramIndex++}`)
      values.push(data.lastName)
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`)
      values.push(data.phone)
    }
    if (data.avatar !== undefined) {
      fields.push(`avatar = $${paramIndex++}`)
      values.push(data.avatar)
    }

    if (fields.length === 0) return this.findById(id)

    fields.push(`updated_at = NOW()`)
    values.push(id)

    const rows = await query<Record<string, unknown>>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )
    return rows[0] ? this.mapRow(rows[0]) : null
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, id]
    )
  }

  async updateProvider(id: string, provider: 'google' | 'github', providerId: string): Promise<User | null> {
    const rows = await query<Record<string, unknown>>(
      `UPDATE users SET auth_provider = $1, provider_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [provider, providerId, id]
    )
    return rows[0] ? this.mapRow(rows[0]) : null
  }

  async verifyEmail(id: string): Promise<void> {
    await query(
      'UPDATE users SET email_verified = true, updated_at = NOW() WHERE id = $1',
      [id]
    )
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM users WHERE id = $1', [id])
  }
}

export const userRepository = new UserRepository()
