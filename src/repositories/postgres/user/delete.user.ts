import { Prisma } from '../../../../generated/prisma/client'
import { UserNotFoundError } from '@/errors/user'
import { prisma } from '@/prisma/prisma'
import { UserResponse } from '@/types'

export interface IPostgresDeleteUserRepository {
  execute(user_id: string): Promise<UserResponse | null>
}

export class PostgresDeleteUserRepository implements IPostgresDeleteUserRepository {
  async execute(user_id: string): Promise<UserResponse | null> {
    try {
      const deletedUser = await prisma.user.delete({
        where: {
          id: user_id,
        },
      })
      return deletedUser
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new UserNotFoundError(user_id)
      }
      throw error
    }
  }
}
