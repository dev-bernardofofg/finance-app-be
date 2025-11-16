import pg from 'pg'
import { env } from '../../config/env.js'

const { Pool } = pg

export const pool = new Pool({
  user: env.POSTGRES_USER,
  database: env.POSTGRES_DB,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
})

// Tratamento de erros do pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export default pool
