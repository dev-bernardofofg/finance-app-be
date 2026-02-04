import { CreateUserController } from '../../controllers/create-user'
import { DeleteUserController } from '../../controllers/delete-user'
import { GetUserByEmailController } from '../../controllers/get-user-by-email'
import { GetUserByIdController } from '../../controllers/get-user-by-id'
import { UpdateUserController } from '../../controllers/update-user'
import { PostgresCreateUserRepository } from '../../repositories/postgres/create-user'
import { PostgresDeleteUserRepository } from '../../repositories/postgres/delete.user'
import { PostgresGetUserByEmailRepository } from '../../repositories/postgres/get-user-by-email'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/get-user-by-id'
import { PostgresUpdateUserRepository } from '../../repositories/postgres/update-user'
import { CreateUserUseCase } from '../../use-cases/create-user'
import { DeleteUserUseCase } from '../../use-cases/delete.user'
import { GetUserByEmailUseCase } from '../../use-cases/get-user-by-email'
import { GetUserByIdUseCase } from '../../use-cases/get-user-by-id'
import { UpdateUserUseCase } from '../../use-cases/update-user'

export const makeGetUserByIdController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  return getUserByIdController
}

export const makeGetUserByEmailController = () => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
  const getUserByEmailUseCase = new GetUserByEmailUseCase(
    getUserByEmailRepository,
  )
  const getUserByEmailController = new GetUserByEmailController(
    getUserByEmailUseCase,
  )

  return getUserByEmailController
}

export const makeUpdateUserByIdController = () => {
  const updateUserRepository = new PostgresUpdateUserRepository()
  const updateUserUseCase = new UpdateUserUseCase(updateUserRepository)
  const updateUserController = new UpdateUserController(updateUserUseCase)

  return updateUserController
}

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository()
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  return deleteUserController
}

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository()
  const createUserUseCase = new CreateUserUseCase(createUserRepository)
  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}
