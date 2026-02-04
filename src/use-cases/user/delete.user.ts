import { UserNotFoundError } from '../../errors/user'
import { IPostgresDeleteUserRepository } from '../../repositories/postgres'
import { UserResponse } from '../../types/user.type'

export interface IDeleteUserUseCase {
  execute(userId: string): Promise<UserResponse>
}
export class DeleteUserUseCase implements IDeleteUserUseCase {
  private deleteUserRepository: IPostgresDeleteUserRepository
  constructor(deleteUserRepository: IPostgresDeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository
  }
  async execute(userId: string) {
    const user = await this.deleteUserRepository.execute(userId)
    if (!user) {
      throw new UserNotFoundError(userId)
    }
    return user
  }
}
