import { pool } from './client.js'

export const PostgresHelper = {
  query: async <T>(query: string, params?: unknown[]): Promise<T> => {
    const client = await pool.connect()
    try {
      const result = await client.query(query, params)
      return result.rows as T
    } finally {
      client.release()
    }
  },
} as const
