import { PostgresHelper } from '../../../db/postgres/helper'
import { UserResponse } from '../../../types/user.type'

export interface GetUserByEmailParams {
  email: string
}

export interface IPostgresGetUserByEmailRepository {
  execute(params: GetUserByEmailParams): Promise<UserResponse | null>
}

export class PostgresGetUserByEmailRepository implements IPostgresGetUserByEmailRepository {
  async execute(params: GetUserByEmailParams) {
    const user = await PostgresHelper.query<UserResponse[]>(
      'SELECT id, first_name, last_name, email FROM users WHERE email = $1',
      [params.email],
    )
    return user[0] ?? null
  }
}
