import { prisma } from '../../../../prisma/prisma'
import { UserResponse } from '../../../types'

export interface GetUserByIdParams {
  id: string
}

export interface IPostgresGetUserByIdRepository {
  execute(params: GetUserByIdParams): Promise<UserResponse | null>
}

export class PostgresGetUserByIdRepository implements IPostgresGetUserByIdRepository {
  async execute(params: GetUserByIdParams) {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    })
    return user
  }
}
