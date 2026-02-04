import { UserNotFoundError } from '../../errors/user'
import {
  GetUserByEmailParams,
  IPostgresGetUserByEmailRepository,
} from '../../repositories/postgres'
import { UserResponse } from '../../types/user.type'

export interface IGetUserByEmailUseCase {
  execute(params: GetUserByEmailParams): Promise<UserResponse>
}

export class GetUserByEmailUseCase implements IGetUserByEmailUseCase {
  private getUserByEmailRepository: IPostgresGetUserByEmailRepository
  constructor(getUserByEmailRepository: IPostgresGetUserByEmailRepository) {
    this.getUserByEmailRepository = getUserByEmailRepository
  }

  async execute(params: GetUserByEmailParams) {
    const user = await this.getUserByEmailRepository.execute(params)
    if (!user) {
      throw new UserNotFoundError(params.email)
    }
    return user
  }
}
