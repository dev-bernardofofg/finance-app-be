import { IPostgresDeleteUserRepository } from '@/repositories/postgres'
import { UserResponse } from '@/types'

export interface IDeleteUserUseCase {
  execute(user_id: string): Promise<UserResponse | null>
}
export class DeleteUserUseCase implements IDeleteUserUseCase {
  private deleteUserRepository: IPostgresDeleteUserRepository
  constructor(deleteUserRepository: IPostgresDeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository
  }
  async execute(user_id: string) {
    const user = await this.deleteUserRepository.execute(user_id)

    return user
  }
}
