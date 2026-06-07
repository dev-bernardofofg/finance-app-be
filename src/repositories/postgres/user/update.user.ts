import { Prisma } from '../../../../generated/prisma/client'
import { UserNotFoundError } from '@/errors/user'
import { prisma } from '@/prisma/prisma'
import { UserResponse } from '@/types'

export interface UpdateUserParams {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  password?: string
}

export type UserFields = Omit<UpdateUserParams, 'id'>

export interface IPostgresUpdateUserRepository {
  execute(
    user_id: string,
    updateUserParams: UserFields,
  ): Promise<UserResponse | null>
}

export class PostgresUpdateUserRepository implements IPostgresUpdateUserRepository {
  async execute(
    user_id: string,
    updateUserParams: UserFields,
  ): Promise<UserResponse | null> {
    try {
      return await prisma.user.update({
        where: { id: user_id },
        data: updateUserParams,
      })
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
