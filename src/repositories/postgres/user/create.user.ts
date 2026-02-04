import { PostgresHelper } from '../../../db/postgres/helper'
import { UserResponse } from '../../../types/user'

export interface CreateUserParams {
  id?: string
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface IPostgresHelper {
  query<T>(query: string, params?: unknown[]): Promise<T>
}

export interface IPostgresCreateUserRepository {
  findByEmail(email: string): Promise<UserResponse | null>
  execute(createUserParams: CreateUserParams): Promise<UserResponse>
}

export class PostgresCreateUserRepository implements IPostgresCreateUserRepository {
  private postgresHelper: IPostgresHelper

  constructor(postgresHelper: IPostgresHelper = PostgresHelper) {
    this.postgresHelper = postgresHelper
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    const result = await this.postgresHelper.query<UserResponse[]>(
      'SELECT id, first_name, last_name, email FROM users WHERE email = $1',
      [email],
    )
    return result[0] ?? null
  }

  async execute(createUserParams: CreateUserParams): Promise<UserResponse> {
    await this.postgresHelper.query(
      'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
      [
        createUserParams.id,
        createUserParams.first_name,
        createUserParams.last_name,
        createUserParams.email,
        createUserParams.password,
      ],
    )
    const createdUser = await this.postgresHelper.query<UserResponse[]>(
      'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
      [createUserParams.id],
    )

    return createdUser[0] as UserResponse
  }
}
