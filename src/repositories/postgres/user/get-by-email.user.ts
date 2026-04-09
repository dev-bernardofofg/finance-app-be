import { prisma } from '../../../prisma/prisma'
import { UserResponse } from '../../../types'

export interface GetUserByEmailParams {
  email: string
}

export interface IPostgresGetUserByEmailRepository {
  execute(params: GetUserByEmailParams): Promise<UserResponse | null>
}

export class PostgresGetUserByEmailRepository implements IPostgresGetUserByEmailRepository {
  async execute(params: GetUserByEmailParams) {
    const user = await prisma.user.findUnique({
      where: {
        email: params.email,
      },
    })
    return user
  }
}
