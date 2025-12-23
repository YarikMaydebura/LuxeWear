import fs from 'fs'
import path from 'path'
import { pool } from '../config/database'
import { logger } from '../utils/logger'

async function runMigrations() {
  const client = await pool.connect()

  try {
    // Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Get list of executed migrations
    const result = await client.query('SELECT name FROM migrations ORDER BY id')
    const executedMigrations = new Set(result.rows.map((r) => r.name))

    // Read migration files
    const migrationsDir = path.join(__dirname, 'migrations')
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()

    for (const file of files) {
      if (executedMigrations.has(file)) {
        logger.info(`Migration ${file} already executed, skipping...`)
        continue
      }

      logger.info(`Running migration: ${file}`)

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')

      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [file])
        await client.query('COMMIT')
        logger.info(`Migration ${file} completed successfully`)
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      }
    }

    logger.info('All migrations completed successfully')
  } catch (error) {
    logger.error('Migration failed:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations()
