import { PostgresHelper } from '../../db/postgres/helper'
import { UserResponse } from '../../types/user'
import { IPostgresHelper } from './create-user'

export interface GetUserByIdParams {
  id: string
}

export interface IPostgresGetUserByIdRepository {
  execute(params: GetUserByIdParams): Promise<UserResponse | null>
}

export class PostgresGetUserByIdRepository implements IPostgresGetUserByIdRepository {
  private postgresHelper: IPostgresHelper

  constructor(postgresHelper: IPostgresHelper = PostgresHelper) {
    this.postgresHelper = postgresHelper
  }

  async execute(params: GetUserByIdParams) {
    const result = await this.postgresHelper.query<UserResponse[]>(
      'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
      [params.id],
    )
    return result[0] ?? null
  }
}
