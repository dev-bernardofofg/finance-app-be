import { Prisma } from '../../../../generated/prisma/client'
import { EmailUserNotFoundError } from '../../../errors/user'
import { prisma } from '../../../prisma/prisma'
import { UserResponse } from '../../../types'

export interface IPostgresGetUserByEmailRepository {
  execute(email: string): Promise<UserResponse | null>
}

export class PostgresGetUserByEmailRepository implements IPostgresGetUserByEmailRepository {
  async execute(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      return user
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EmailUserNotFoundError(email)
      }
      throw error
    }
  }
}
