import { PostgresHelper } from '../../../db/postgres/helper'
import { ICreateUserParams, UserResponse } from '../../../types/user.type'

export interface IPostgresCreateUserRepository {
  findByEmail(email: string): Promise<UserResponse | null>
  execute(createUserParams: ICreateUserParams): Promise<UserResponse>
}

export class PostgresCreateUserRepository implements IPostgresCreateUserRepository {
  async findByEmail(email: string): Promise<UserResponse | null> {
    const result = await PostgresHelper.query<UserResponse[]>(
      'SELECT id, first_name, last_name, email FROM users WHERE email = $1',
      [email],
    )
    return result[0] ?? null
  }

  async execute(createUserParams: ICreateUserParams): Promise<UserResponse> {
    const createdUser = await PostgresHelper.query<UserResponse[]>(
      'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
      [
        createUserParams.id,
        createUserParams.first_name,
        createUserParams.last_name,
        createUserParams.email,
        createUserParams.password,
      ],
    )
    return createdUser[0] as UserResponse
  }
}
