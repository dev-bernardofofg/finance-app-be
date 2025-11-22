import { PostgresHelper } from '../../db/postgres/helper'

export interface GetUserByIdParams {
  id: string
}

export const PostgresGetUserByIdRepository = {
  execute: async ({ id }: GetUserByIdParams) => {
    const result = await PostgresHelper.query<{
      id: string
      first_name: string
      last_name: string
      email: string
    }>('SELECT id, first_name, last_name, email FROM users WHERE id = $1', [id])
    return result[0] ?? null
  },
}
