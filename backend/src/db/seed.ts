import fs from 'fs'
import path from 'path'
import { pool } from '../config/database'
import { logger } from '../utils/logger'

async function runSeeds() {
  const client = await pool.connect()

  try {
    // Read seed files
    const seedsDir = path.join(__dirname, 'seeds')
    const files = fs.readdirSync(seedsDir).filter((f) => f.endsWith('.sql')).sort()

    for (const file of files) {
      logger.info(`Running seed: ${file}`)

      const sql = fs.readFileSync(path.join(seedsDir, file), 'utf-8')

      try {
        await client.query(sql)
        logger.info(`Seed ${file} completed successfully`)
      } catch (error) {
        logger.error(`Seed ${file} failed:`, error)
        // Continue with other seeds
      }
    }

    logger.info('All seeds completed')
  } catch (error) {
    logger.error('Seeding failed:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runSeeds()
