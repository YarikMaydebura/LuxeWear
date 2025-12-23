import { query, queryOne } from '../config/database'
import { Address } from '../types'

interface AddressRow {
  id: string
  user_id: string
  first_name: string
  last_name: string
  street: string
  apartment: string | null
  city: string
  state: string
  zip_code: string
  country: string
  phone: string | null
  is_default: boolean
  created_at: Date
}

interface CreateAddressData {
  userId: string
  firstName: string
  lastName: string
  street: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

interface UpdateAddressData {
  firstName?: string
  lastName?: string
  street?: string
  apartment?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  phone?: string
  isDefault?: boolean
}

class AddressRepository {
  private mapRow(row: AddressRow): Address {
    return {
      id: row.id,
      userId: row.user_id,
      firstName: row.first_name,
      lastName: row.last_name,
      street: row.street,
      apartment: row.apartment || undefined,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      country: row.country,
      phone: row.phone || undefined,
      isDefault: row.is_default,
      createdAt: row.created_at,
    }
  }

  async findByUserId(userId: string): Promise<Address[]> {
    const rows = await query<AddressRow>(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [userId]
    )
    return rows.map(this.mapRow)
  }

  async findById(id: string): Promise<Address | null> {
    const row = await queryOne<AddressRow>(
      'SELECT * FROM addresses WHERE id = $1',
      [id]
    )
    return row ? this.mapRow(row) : null
  }

  async create(data: CreateAddressData): Promise<Address> {
    // If setting as default, unset all other defaults
    if (data.isDefault) {
      await query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [data.userId]
      )
    }

    const rows = await query<AddressRow>(
      `INSERT INTO addresses (user_id, first_name, last_name, street, apartment, city, state, zip_code, country, phone, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        data.userId,
        data.firstName,
        data.lastName,
        data.street,
        data.apartment || null,
        data.city,
        data.state,
        data.zipCode,
        data.country,
        data.phone || null,
        data.isDefault || false,
      ]
    )
    return this.mapRow(rows[0])
  }

  async update(id: string, userId: string, data: UpdateAddressData): Promise<Address | null> {
    // If setting as default, unset all other defaults
    if (data.isDefault) {
      await query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2',
        [userId, id]
      )
    }

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
    if (data.street !== undefined) {
      fields.push(`street = $${paramIndex++}`)
      values.push(data.street)
    }
    if (data.apartment !== undefined) {
      fields.push(`apartment = $${paramIndex++}`)
      values.push(data.apartment || null)
    }
    if (data.city !== undefined) {
      fields.push(`city = $${paramIndex++}`)
      values.push(data.city)
    }
    if (data.state !== undefined) {
      fields.push(`state = $${paramIndex++}`)
      values.push(data.state)
    }
    if (data.zipCode !== undefined) {
      fields.push(`zip_code = $${paramIndex++}`)
      values.push(data.zipCode)
    }
    if (data.country !== undefined) {
      fields.push(`country = $${paramIndex++}`)
      values.push(data.country)
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`)
      values.push(data.phone || null)
    }
    if (data.isDefault !== undefined) {
      fields.push(`is_default = $${paramIndex++}`)
      values.push(data.isDefault)
    }

    if (fields.length === 0) return this.findById(id)

    values.push(id)
    values.push(userId)

    const rows = await query<AddressRow>(
      `UPDATE addresses SET ${fields.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex} RETURNING *`,
      values
    )
    return rows[0] ? this.mapRow(rows[0]) : null
  }

  async setDefault(id: string, userId: string): Promise<Address | null> {
    // Unset all defaults
    await query(
      'UPDATE addresses SET is_default = false WHERE user_id = $1',
      [userId]
    )

    // Set this one as default
    const rows = await query<AddressRow>(
      'UPDATE addresses SET is_default = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    )
    return rows[0] ? this.mapRow(rows[0]) : null
  }

  async delete(id: string, userId: string): Promise<void> {
    await query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [id, userId])
  }
}

export const addressRepository = new AddressRepository()
