import { prisma } from '../../../prisma/prisma'
import { UserResponse } from '../../../types'

export interface IPostgresDeleteUserRepository {
  execute(userId: string): Promise<UserResponse | null>
}

export class PostgresDeleteUserRepository implements IPostgresDeleteUserRepository {
  async execute(userId: string): Promise<UserResponse | null> {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    })
    return deletedUser
  }
}
