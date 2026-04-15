import { PasswordHasherAdapter } from '../../adapters'
import { EmailAlreadyInUseError } from '../../errors/user'
import {
  IPostgresGetUserByEmailRepository,
  IPostgresUpdateUserRepository,
  UserFields,
} from '../../repositories/postgres'
import { UserResponse } from '../../types'

export interface IUpdateUserUseCase {
  execute(
    userId: string,
    updateUserParams: UserFields,
  ): Promise<UserResponse | null>
}
export class UpdateUserUseCase implements IUpdateUserUseCase {
  private getUserByEmailRepository: IPostgresGetUserByEmailRepository
  private updateUserRepository: IPostgresUpdateUserRepository
  private passwordHasherAdapter: PasswordHasherAdapter
  constructor(
    getUserByEmailRepository: IPostgresGetUserByEmailRepository,
    updateUserRepository: IPostgresUpdateUserRepository,
    passwordHasherAdapter: PasswordHasherAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.updateUserRepository = updateUserRepository
    this.passwordHasherAdapter = passwordHasherAdapter
  }
  async execute(userId: string, updateUserParams: UserFields) {
    if (updateUserParams.email) {
      const userWithEmail = await this.getUserByEmailRepository.execute(
        updateUserParams.email,
      )

      if (userWithEmail && userWithEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email)
      }
    }

    if (updateUserParams.password) {
      updateUserParams.password = await this.passwordHasherAdapter.execute(
        updateUserParams.password,
      )
    }

    const updatedUser = await this.updateUserRepository.execute(
      userId,
      updateUserParams,
    )

    return updatedUser
  }
}
