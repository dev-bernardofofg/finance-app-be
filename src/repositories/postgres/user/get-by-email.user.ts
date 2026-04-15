import { prisma } from '../../../prisma/prisma'
import { UserResponse } from '../../../types'

export interface IPostgresGetUserByEmailRepository {
  execute(email: string): Promise<UserResponse | null>
}

export class PostgresGetUserByEmailRepository implements IPostgresGetUserByEmailRepository {
  async execute(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }
}
