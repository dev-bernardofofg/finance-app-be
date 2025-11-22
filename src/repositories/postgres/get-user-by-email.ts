import { PostgresHelper } from '../../db/postgres/helper'

export interface GetUserByEmailParams {
  email: string
}

export const PostgresGetUserByEmailRepository = {
  execute: async ({ email }: GetUserByEmailParams) => {
    const user = await PostgresHelper.query(
      'SELECT id, first_name, last_name, email FROM users WHERE email = $1',
      [email],
    )
    return user
  },
}
