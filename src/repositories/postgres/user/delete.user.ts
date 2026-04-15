import { Prisma } from '../../../../generated/prisma/client'
import { UserNotFoundError } from '../../../errors/user'
import { prisma } from '../../../prisma/prisma'
import { UserResponse } from '../../../types'

export interface IPostgresDeleteUserRepository {
  execute(userId: string): Promise<UserResponse | null>
}

export class PostgresDeleteUserRepository implements IPostgresDeleteUserRepository {
  async execute(userId: string): Promise<UserResponse | null> {
    try {
      const deletedUser = await prisma.user.delete({
        where: {
          id: userId,
        },
      })
      return deletedUser
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new UserNotFoundError(userId)
      }
      throw error
    }
  }
}
