import { PostgresHelper } from '../../db/postgres/helper'

export const PostgresDeleteUserRepository = {
  execute: async (userId: string) => {
    const result = await PostgresHelper.query<{
      id: string
      first_name: string
      last_name: string
      email: string
    }>('DELETE FROM users WHERE id = $1 RETURNING *', [userId])
    return result[0] ?? null
  },
}
