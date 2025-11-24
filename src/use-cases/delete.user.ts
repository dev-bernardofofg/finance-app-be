import { UserNotFoundError } from '../errors/user'
import { PostgresDeleteUserRepository } from '../repositories/postgres/delete.user'

export const DeleteUserUseCase = {
  execute: async (userId: string) => {
    const user = await PostgresDeleteUserRepository.execute(userId)
    if (!user) {
      throw new UserNotFoundError(userId)
    }
    return user
  },
}
