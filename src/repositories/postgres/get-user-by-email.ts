import { PostgresHelper } from '../../db/postgres/helper'

export interface GetUserByEmailParams {
  email: string
}

export const PostgresGetUserByEmailRepository = {
  execute: async ({ email }: GetUserByEmailParams) => {
    const result = await PostgresHelper.query<
      Array<{
        id: string
        first_name: string
        last_name: string
        email: string
      }>
    >('SELECT id, first_name, last_name, email FROM users WHERE email = $1', [
      email,
    ])
    return result[0] ?? null
  },
}
