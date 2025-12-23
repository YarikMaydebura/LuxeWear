import { Pool } from 'pg'
import { env } from './env'
import { logger } from '../utils/logger'

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
  logger.error('Unexpected database pool error', err)
})

export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    await client.query('SELECT NOW()')
    client.release()
    logger.info('Database connection established')
    return true
  } catch (error) {
    logger.error('Database connection failed', error)
    return false
  }
}

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const start = Date.now()
  const result = await pool.query(text, params)
  const duration = Date.now() - start

  if (env.NODE_ENV === 'development') {
    logger.debug(`Query executed in ${duration}ms: ${text.substring(0, 100)}...`)
  }

  return result.rows as T[]
}

export async function queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] || null
}

export async function transaction<T>(
  callback: (client: Pool) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(pool)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
