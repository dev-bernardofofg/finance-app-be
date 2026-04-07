import { UserNotFoundError } from '../../errors/user'
import { IPostgresGetUserByIdRepository } from '../../repositories/postgres'
import { UserResponse } from '../../types'

export interface IGetUserByIdUseCase {
  execute(id: string): Promise<UserResponse>
}

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  private getUserByIdRepository: IPostgresGetUserByIdRepository
  constructor(getUserByIdRepository: IPostgresGetUserByIdRepository) {
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(id: string) {
    const user = await this.getUserByIdRepository.execute({ id })
    if (!user) {
      throw new UserNotFoundError(id)
    }
    return user
  }
}
