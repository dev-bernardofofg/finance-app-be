import {
  IPostgresUpdateUserRepository,
  UserFields,
} from '../../repositories/postgres'
import { UserResponse } from '../../types/user'

export interface IUpdateUserUseCase {
  execute(
    userId: string,
    updateUserParams: UserFields,
  ): Promise<UserResponse | null>
}
export class UpdateUserUseCase implements IUpdateUserUseCase {
  private updateUserRepository: IPostgresUpdateUserRepository
  constructor(updateUserRepository: IPostgresUpdateUserRepository) {
    this.updateUserRepository = updateUserRepository
  }
  async execute(userId: string, updateUserParams: UserFields) {
    return await this.updateUserRepository.execute(userId, updateUserParams)
  }
}
