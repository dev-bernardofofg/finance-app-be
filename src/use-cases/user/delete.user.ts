import { IPostgresDeleteUserRepository } from '../../repositories/postgres'
import { UserResponse } from '../../types'

export interface IDeleteUserUseCase {
  execute(userId: string): Promise<UserResponse | null>
}
export class DeleteUserUseCase implements IDeleteUserUseCase {
  private deleteUserRepository: IPostgresDeleteUserRepository
  constructor(deleteUserRepository: IPostgresDeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository
  }
  async execute(userId: string) {
    const user = await this.deleteUserRepository.execute(userId)

    return user
  }
}
