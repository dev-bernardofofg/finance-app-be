import { prisma } from '../../../../prisma/prisma'
import { ICreateUserParams, UserResponse } from '../../../types'

export interface IPostgresCreateUserRepository {
  execute(createUserParams: ICreateUserParams): Promise<UserResponse>
}

export class PostgresCreateUserRepository implements IPostgresCreateUserRepository {
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
