import { PostgresHelper } from '../../db/postgres/helper'
import { UserResponse } from '../../types/user'
import { IPostgresHelper } from './create-user'

export interface GetUserByEmailParams {
  email: string
}

export interface IPostgresGetUserByEmailRepository {
  execute(params: GetUserByEmailParams): Promise<UserResponse | null>
}

export class PostgresGetUserByEmailRepository implements IPostgresGetUserByEmailRepository {
  private postgresHelper: IPostgresHelper

  constructor(postgresHelper: IPostgresHelper = PostgresHelper) {
    this.postgresHelper = postgresHelper
  }

  async execute(params: GetUserByEmailParams) {
    const result = await this.postgresHelper.query<UserResponse[]>(
      'SELECT id, first_name, last_name, email FROM users WHERE email = $1',
      [params.email],
    )
    return result[0] ?? null
  }
}
