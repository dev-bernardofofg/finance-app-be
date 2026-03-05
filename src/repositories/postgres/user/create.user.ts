import { prisma } from '../../../../prisma/prisma'
import { PostgresHelper } from '../../../db/postgres/helper'
import { ICreateUserParams, UserResponse } from '../../../types'

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
    const user = await prisma.user.create({
      data: {
        id: createUserParams.id,
        first_name: createUserParams.first_name,
        last_name: createUserParams.last_name,
        email: createUserParams.email,
        password: createUserParams.password,
      },
    })
    return user
  }
}
