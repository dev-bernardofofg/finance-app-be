import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import {
  IPostgresGetUserByEmailRepository,
  IPostgresUpdateUserRepository,
  UserFields,
} from '../../repositories/postgres'
import { UserResponse } from '../../types'

export interface IUpdateUserUseCase {
  execute(userId: string, updateUserParams: UserFields): Promise<UserResponse>
}
export class UpdateUserUseCase implements IUpdateUserUseCase {
  private getUserByEmailRepository: IPostgresGetUserByEmailRepository
  private updateUserRepository: IPostgresUpdateUserRepository
  constructor(
    getUserByEmailRepository: IPostgresGetUserByEmailRepository,
    updateUserRepository: IPostgresUpdateUserRepository,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.updateUserRepository = updateUserRepository
  }
  async execute(userId: string, updateUserParams: UserFields) {
    if (updateUserParams.email) {
      const userWithEmail = await this.getUserByEmailRepository.execute({
        email: updateUserParams.email,
      })

      if (userWithEmail && userWithEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email)
      }
    }

    const updatedUser = await this.updateUserRepository.execute(
      userId,
      updateUserParams,
    )

    if (!updatedUser) {
      throw new UserNotFoundError(userId)
    }

    return updatedUser
  }
}
