import { PostgresHelper } from '../../../db/postgres/helper'
import { UserResponse } from '../../../types/user.type'

export interface GetUserByIdParams {
  id: string
}

export interface IPostgresGetUserByIdRepository {
  execute(params: GetUserByIdParams): Promise<UserResponse | null>
}

export class PostgresGetUserByIdRepository implements IPostgresGetUserByIdRepository {
  async execute(params: GetUserByIdParams) {
    const user = await PostgresHelper.query<UserResponse[]>(
      'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
      [params.id],
    )
    return user[0] ?? null
  }
}
