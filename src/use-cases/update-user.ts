import bcrypt from 'bcrypt'
import { EmailAlreadyInUseError, UserNotFoundError } from '../errors/user'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email'
import {
  PostgresUpdateUserRepository,
  UserFields,
} from '../repositories/postgres/update-user'

export const UpdateUserUseCase = {
  execute: async (userId: string, updateUserParams: UserFields) => {
    if (updateUserParams.email) {
      const user = await PostgresGetUserByEmailRepository.execute({
        email: updateUserParams.email,
      })
      if (user && user.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email)
      }
    }

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)
      updateUserParams.password = hashedPassword
    }

    const updatedUser = await PostgresUpdateUserRepository.execute(
      userId,
      updateUserParams,
    )

    if (!updatedUser) {
      throw new UserNotFoundError(userId)
    }

    return updatedUser
  },
}
