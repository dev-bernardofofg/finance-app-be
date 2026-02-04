import { UserNotFoundError } from '../../errors/user'
import {
  GetUserByIdParams,
  IPostgresGetUserByIdRepository,
} from '../../repositories/postgres'
import { UserResponse } from '../../types/user.type'

export interface IGetUserByIdUseCase {
  execute(params: GetUserByIdParams): Promise<UserResponse>
}

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  private getUserByIdRepository: IPostgresGetUserByIdRepository
  constructor(getUserByIdRepository: IPostgresGetUserByIdRepository) {
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(params: GetUserByIdParams) {
    const user = await this.getUserByIdRepository.execute(params)
    if (!user) {
      throw new UserNotFoundError(params.id)
    }
    return user
  }
}
