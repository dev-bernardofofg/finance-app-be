import { isPrismaErrorCode } from '../../errors/prisma'
import { UserNotFoundError } from '../../errors/user'
import { IPostgresDeleteUserRepository } from '../../repositories/postgres'
import { UserResponse } from '../../types'

export interface IDeleteUserUseCase {
  execute(userId: string): Promise<UserResponse>
}
export class DeleteUserUseCase implements IDeleteUserUseCase {
  private deleteUserRepository: IPostgresDeleteUserRepository
  constructor(deleteUserRepository: IPostgresDeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository
  }
  async execute(userId: string) {
    let user: UserResponse | null = null

    try {
      user = await this.deleteUserRepository.execute(userId)
    } catch (error) {
      if (isPrismaErrorCode(error, 'P2025')) {
        throw new UserNotFoundError(userId)
      }

      throw error
    }

    if (!user) {
      throw new UserNotFoundError(userId)
    }
    return user
  }
}
