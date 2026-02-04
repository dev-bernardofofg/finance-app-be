import { PostgresHelper } from '../../../db/postgres/helper'
import { UserResponse } from '../../../types/user.type'

export interface IPostgresDeleteUserRepository {
  execute(userId: string): Promise<UserResponse | null>
}

export class PostgresDeleteUserRepository implements IPostgresDeleteUserRepository {
  async execute(userId: string): Promise<UserResponse | null> {
    const deletedUser = await PostgresHelper.query<UserResponse[]>(
      'DELETE FROM users WHERE id = $1 RETURNING id, first_name, last_name, email',
      [userId],
    )
    return deletedUser[0] ?? null
  }
}
