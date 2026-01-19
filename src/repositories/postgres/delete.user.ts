import { PostgresHelper } from '../../db/postgres/helper'
import { UserResponse } from '../../types/user'
import { IPostgresHelper } from './create-user'

export interface IPostgresDeleteUserRepository {
  execute(userId: string): Promise<UserResponse | null>
}

export class PostgresDeleteUserRepository implements IPostgresDeleteUserRepository {
  private postgresHelper: IPostgresHelper

  constructor(postgresHelper: IPostgresHelper = PostgresHelper) {
    this.postgresHelper = postgresHelper
  }

  async execute(userId: string): Promise<UserResponse | null> {
    const result = await this.postgresHelper.query<UserResponse[]>(
      'DELETE FROM users WHERE id = $1 RETURNING id, first_name, last_name, email',
      [userId],
    )
    return result[0] ?? null
  }
}
