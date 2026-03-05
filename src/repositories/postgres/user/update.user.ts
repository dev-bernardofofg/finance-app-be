import { prisma } from '../../../../prisma/prisma'
import { UserResponse } from '../../../types'

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
    userId: string,
    updateUserParams: UserFields,
  ): Promise<UserResponse | null>
}

export class PostgresUpdateUserRepository implements IPostgresUpdateUserRepository {
  async execute(
    userId: string,
    updateUserParams: UserFields,
  ): Promise<UserResponse | null> {
    return prisma.user.update({
      where: { id: userId },
      data: updateUserParams,
    })
  }
}
