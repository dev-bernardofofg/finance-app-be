import { PostgresHelper } from '../../db/postgres/helper'

export interface GetUserByIdParams {
  id: string
}

export const PostgresGetUserByIdRepository = {
  execute: async ({ id }: GetUserByIdParams) => {
    const user = await PostgresHelper.query(
      'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
      [id],
    )
    return user
  },
}
