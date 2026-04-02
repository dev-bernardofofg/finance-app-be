import { PasswordHasherAdapter } from '../../adapters'
import { isPrismaErrorCode } from '../../errors/prisma'
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
      const userWithEmail = await this.getUserByEmailRepository.execute({
        email: updateUserParams.email,
      })

      if (userWithEmail && userWithEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email)
      }
    }

    if (updateUserParams.password) {
      updateUserParams.password = await this.passwordHasherAdapter.execute(
        updateUserParams.password,
      )
    }

    let updatedUser: UserResponse | null = null

    try {
      updatedUser = await this.updateUserRepository.execute(
        userId,
        updateUserParams,
      )
    } catch (error) {
      if (isPrismaErrorCode(error, 'P2025')) {
        throw new UserNotFoundError(userId)
      }

      if (isPrismaErrorCode(error, 'P2002')) {
        throw new EmailAlreadyInUseError(updateUserParams.email ?? 'informado')
      }

      throw error
    }

    if (!updatedUser) {
      throw new UserNotFoundError(userId)
    }

    return updatedUser
  }
}
