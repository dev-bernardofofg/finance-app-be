import { UserNotFoundError } from '../../errors/user'
import { IPostgresGetUserByEmailRepository } from '../../repositories/postgres'
import { UserResponse } from '../../types'

export interface IGetUserByEmailUseCase {
  execute(email: string): Promise<UserResponse>
}

export class GetUserByEmailUseCase implements IGetUserByEmailUseCase {
  private getUserByEmailRepository: IPostgresGetUserByEmailRepository
  constructor(getUserByEmailRepository: IPostgresGetUserByEmailRepository) {
    this.getUserByEmailRepository = getUserByEmailRepository
  }

  async execute(email: string) {
    const user = await this.getUserByEmailRepository.execute(email)
    if (!user) {
      throw new UserNotFoundError(email)
    }
    return user
  }
}
